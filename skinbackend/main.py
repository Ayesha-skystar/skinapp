from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image, ImageOps, UnidentifiedImageError
import io
import numpy as np
import cv2
import logging
import timm
import uvicorn
import os

# Configuration
DETECTION_MODEL_PATH = "D:/fyp/skinbackend/model/skin_detector_epoch_30.pth"
CLASS_NAMES = ['Acne', 'Eczema', 'Psoriasis', 'Tinea Ringworm', 'Warts Molluscum']
DETECTION_IMAGE_SIZE = 512
MIN_SKIN_PERCENTAGE = 10  # Reduced from 20% to 10% for better acceptance
MIN_CONFIDENCE_THRESHOLD = 0.6
app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response Models
class DetectionResponse(BaseModel):
    status: str
    message: str = None
    detection: dict = None
    confidence: float = None
    suggestion: str = None

# Skin Disease Detector Model
class SkinDiseaseDetector(nn.Module):
    def __init__(self, num_classes=5):
        super().__init__()
        self.backbone = timm.create_model('efficientnet_b0', 
                                         features_only=True,
                                         pretrained=True,
                                         out_indices=(4,))
        
        # Get correct number of channels from backbone
        dummy_input = torch.randn(1, 3, DETECTION_IMAGE_SIZE, DETECTION_IMAGE_SIZE)
        features = self.backbone(dummy_input)
        in_channels = features[0].shape[1]
        
        self.class_head = nn.Sequential(
            nn.Conv2d(in_channels, 256, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(256, num_classes, 3, padding=1)
        )
        self.bbox_head = nn.Sequential(
            nn.Conv2d(in_channels, 256, 3, padding=1),
            nn.ReLU(),
            nn.Conv2d(256, 4, 3, padding=1)
        )

    def forward(self, x):
        features = self.backbone(x)[0]
        return {
            'class_logits': self.class_head(features),
            'bbox_preds': torch.sigmoid(self.bbox_head(features))
        }

# Model Loader
def load_detection_model():
    detection_model = SkinDiseaseDetector(num_classes=len(CLASS_NAMES)).to(device)
    
    # Load state dict with strict=False to handle missing keys
    state_dict = torch.load(DETECTION_MODEL_PATH, map_location=device)
    
    # Filter out unnecessary keys and handle mismatches
    filtered_state_dict = {}
    for k, v in state_dict.items():
        # Remove 'module.' prefix if present (from DataParallel)
        if k.startswith('module.'):
            k = k[7:]
        filtered_state_dict[k] = v
    
    detection_model.load_state_dict(filtered_state_dict, strict=False)
    detection_model.eval()
    return detection_model

detection_model = load_detection_model()

# Detection transforms
detection_transform = transforms.Compose([
    transforms.Resize((DETECTION_IMAGE_SIZE, DETECTION_IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Process detection output function
def process_detection_output(outputs):
    """Process detection model outputs to get class and bbox predictions"""
    class_logits = outputs['class_logits'].permute(0, 2, 3, 1).contiguous()
    class_logits = class_logits.view(-1, len(CLASS_NAMES))
    class_probs = torch.softmax(class_logits, dim=1).mean(dim=0)
    
    bbox_preds = outputs['bbox_preds'].permute(0, 2, 3, 1).contiguous()
    bbox_preds = bbox_preds.view(-1, 4)
    avg_bbox = bbox_preds.mean(dim=0)
    
    return class_probs, avg_bbox

# Enhanced Medical Preprocessing
def medical_preprocess(image: Image.Image) -> torch.Tensor:
    # Convert to numpy for enhancement
    img = np.array(image)
    
    try:
        # Basic enhancement
        lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        enhanced = cv2.cvtColor(limg, cv2.COLOR_LAB2RGB)
        enhanced_img = Image.fromarray(enhanced)
    except Exception as e:
        logger.warning(f"Image enhancement failed: {str(e)}")
        enhanced_img = image
    
    return detection_transform(enhanced_img).unsqueeze(0).to(device)

# Improved skin validation - More lenient for disease images
def validate_skin_image(img: np.ndarray) -> dict:
    """Enhanced skin image validation with better disease detection"""
    validation = {
        'is_valid': False,
        'reasons': [],
        'suggestions': [],
        'skin_percentage': 0.0
    }
    
    try:
        # Check if image is valid (not corrupted)
        if img.size == 0:
            validation['reasons'].append("Empty image")
            return validation
        
        # Check image dimensions
        if img.shape[0] < 100 or img.shape[1] < 100:
            validation['reasons'].append("Image is too small")
            validation['suggestions'].append("Please upload a higher resolution image")
            return validation
            
        # Convert to HSV color space
        hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
        
        # Enhanced skin color ranges for different skin tones (more inclusive)
        skin_ranges = [
            # Light skin tones
            ([0, 15, 50], [25, 200, 255]),
            # Medium skin tones
            ([0, 25, 40], [25, 220, 240]),
            # Dark skin tones
            ([0, 40, 30], [25, 255, 220]),
            # Additional ranges for various lighting conditions
            ([0, 10, 50], [30, 180, 250]),
            # For reddish skin conditions (like acne, psoriasis)
            ([0, 30, 50], [10, 200, 255]),
            ([170, 30, 50], [180, 200, 255])  # For reddish tones
        ]
        
        # Combine skin masks
        combined_mask = np.zeros(img.shape[:2], dtype=np.uint8)
        for lower, upper in skin_ranges:
            mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
            combined_mask = cv2.bitwise_or(combined_mask, mask)
        
        # Apply morphological operations to clean up the mask
        kernel = np.ones((3,3), np.uint8)  # Smaller kernel
        combined_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, kernel)
        combined_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_OPEN, kernel)
        
        # Calculate skin percentage
        skin_pixels = cv2.countNonZero(combined_mask)
        total_pixels = img.shape[0] * img.shape[1]
        skin_percent = (skin_pixels / total_pixels) * 100
        validation['skin_percentage'] = skin_percent
        
        # Check for very low skin percentage (likely not a skin image)
        if skin_percent < 5:  # Very strict threshold for complete non-skin images
            validation['reasons'].append(f"Only {skin_percent:.1f}% skin detected")
            validation['suggestions'].append("Please upload a clear photo of affected skin area")
            return validation
        
        # Additional validation: check if image contains mostly textures/patterns
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        
        # Check image focus/blurriness (more lenient threshold)
        fm = cv2.Laplacian(gray, cv2.CV_64F).var()
        if fm < 50:  # Reduced from 100 to 50 for blurry images
            validation['reasons'].append("Image is too blurry")
            validation['suggestions'].append("Please take a clearer photo with good lighting")
        
        # For disease images, we should be more lenient about edges
        # Many skin diseases have textures that create edges
        edges = cv2.Canny(gray, 100, 200)
        edge_percent = (cv2.countNonZero(edges) / total_pixels) * 100
        
        # Only reject if it's clearly a non-skin object (very high edge density)
        if edge_percent > 50:  # Increased from 30 to 50
            validation['reasons'].append("Image appears to contain non-skin objects")
            validation['suggestions'].append("Please upload a clear photo of skin only")
        
        # Check if image is mostly one color (likely not a skin disease image)
        unique_colors = len(np.unique(img.reshape(-1, img.shape[2]), axis=0))
        if unique_colors < 10:  # Very few colors might indicate a non-skin image
            validation['reasons'].append("Image doesn't appear to contain skin texture")
            validation['suggestions'].append("Please upload a photo of actual skin")
        
        validation['is_valid'] = len(validation['reasons']) == 0
        return validation
        
    except Exception as e:
        logger.error(f"Validation error: {str(e)}")
        validation['reasons'].append("Image processing failed")
        return validation

# Improved object detection - More accurate for skin disease images
def contains_objects(img: np.ndarray) -> bool:
    """Check if image contains obvious non-skin objects"""
    try:
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        
        # Calculate edge density
        edges = cv2.Canny(gray, 100, 200)
        edge_density = np.sum(edges > 0) / edges.size
        
        # Calculate texture complexity using variance of Laplacian
        lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        # Check for regular patterns that indicate man-made objects
        fft = np.fft.fft2(gray)
        fft_shift = np.fft.fftshift(fft)
        magnitude_spectrum = 20 * np.log(np.abs(fft_shift) + 1)
        
        # If very high edge density OR very high texture with regular patterns
        # Only reject obvious non-skin objects
        if edge_density > 0.4 or (lap_var > 1500 and np.std(magnitude_spectrum) > 80):
            return True
            
        return False
    except Exception as e:
        logger.error(f"Object detection error: {str(e)}")
        return False

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    try:
        # Check file type
        if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
            raise HTTPException(
                status_code=400,
                detail={
                    "status": "error",
                    "message": "Invalid file format. Please upload JPEG or PNG images only."
                }
            )
        
        # Load image
        contents = await file.read()
        try:
            image = Image.open(io.BytesIO(contents)).convert('RGB')
            img_np = np.array(image)
        except UnidentifiedImageError:
            raise HTTPException(
                status_code=400,
                detail={
                    "status": "error",
                    "message": "Invalid image file. Please upload a valid image."
                }
            )
        
        # First, run basic validation but don't reject immediately
        validation = validate_skin_image(img_np)
        
        # Check if image contains obvious non-skin objects
        if contains_objects(img_np):
            raise HTTPException(
                status_code=400,
                detail={
                    "status": "error",
                    "message": "Image appears to contain non-skin objects. Please upload a clear photo of skin only.",
                    "suggestion": "Crop the image to focus on the affected skin area"
                }
            )
        
        # For skin disease images, we should be more lenient
        # Only reject if it's clearly not a skin image
        if not validation['is_valid']:
            # Check if it might still be a skin disease image despite validation issues
            skin_percent = validation['skin_percentage']
            
            # If there's some skin detected, proceed with detection anyway
            if skin_percent >= 5:  # At least 5% skin
                logger.info(f"Proceeding with detection despite validation issues. Skin: {skin_percent}%")
            else:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "status": "error",
                        "message": "Invalid skin image",
                        "reasons": validation['reasons'],
                        "suggestions": validation['suggestions']
                    }
                )
        
        # Preprocess for detection
        tensor = medical_preprocess(image)
        
        # Run detection
        with torch.no_grad():
            outputs = detection_model(tensor)
        
        # Process outputs using the original function
        class_probs, bbox = process_detection_output(outputs)
        class_idx = torch.argmax(class_probs).item()
        confidence = float(class_probs[class_idx])
        
        # Check if confidence meets threshold
        if confidence < MIN_CONFIDENCE_THRESHOLD:
            return {
                "status": "success",
                "message": "No specific skin condition detected with high confidence",
                "detection": {
                    "disease": "No specific condition",
                    "confidence": confidence
                },
                "suggestion": "Please consult a dermatologist for accurate diagnosis"
            }
        
        return {
            "status": "success",
            "detection": {
                "disease": CLASS_NAMES[class_idx],
                "confidence": confidence,
                "bbox": [
                    float(bbox[0]),  # x1
                    float(bbox[1]),  # y1
                    float(bbox[2]),  # x2
                    float(bbox[3])   # y2
                ]
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Detection failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": "Internal server error during detection",
                "suggestion": "Please try again with a different image"
            }
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)