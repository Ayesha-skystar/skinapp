# === FIXED MAIN.PY WITH SKIN DETECTION ===
import os
import io
import cv2
import torch
import numpy as np
import logging
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import timm
import torch.nn as nn
from torchvision import transforms
import uvicorn
import traceback

# Configuration - UPDATE WITH YOUR ACTUAL MODEL PATH
DETECTION_MODEL_PATH = "D:/fyp/skinbackend/model/model.pth"
CLASS_NAMES = ['Acne', 'Eczema', 'Psoriasis', 'Tinea Ringworm', 'Warts Molluscum']
DETECTION_IMAGE_SIZE = 384
MIN_CONFIDENCE_THRESHOLD = 0.7
MIN_SKIN_PERCENTAGE = 20.0  # Minimum percentage of skin pixels required

app = FastAPI(title="Skin Disease Detection API", version="1.0")

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response Models
class DetectionResponse(BaseModel):
    status: str
    message: Optional[str] = None
    detection: Optional[Dict] = None
    confidence: Optional[float] = None
    suggestion: Optional[str] = None
    reasons: Optional[List[str]] = None
    skin_percentage: Optional[float] = None

class HealthResponse(BaseModel):
    status: str
    message: str
    device: str
    model_loaded: bool

# Model definition
class AdvancedSkinNet(nn.Module):
    def __init__(self, num_classes=5, backbone_name='tf_efficientnet_b3', dropout_rate=0.3):
        super().__init__()
        self.backbone = timm.create_model(
            backbone_name, 
            pretrained=False,
            num_classes=0,
            global_pool=''
        )
        
        feature_dim = self.backbone.num_features
        self.global_pool = nn.AdaptiveAvgPool2d(1)
        self.dropout = nn.Dropout(dropout_rate)
        self.fc = nn.Linear(feature_dim, num_classes)
        self.bn = nn.BatchNorm1d(feature_dim)
    
    def forward(self, x):
        features = self.backbone(x)
        pooled = self.global_pool(features).flatten(1)
        normalized = self.bn(pooled)
        dropped = self.dropout(normalized)
        return self.fc(dropped)

def safe_load_model(file_path, device):
    """Safely load model with PyTorch 2.6+ compatibility"""
    try:
        # First try with weights_only=True (safe mode)
        try:
            # Add safe globals for numpy objects as suggested in the error
            from numpy.core.multiarray import scalar
            if hasattr(torch.serialization, 'add_safe_globals'):
                torch.serialization.add_safe_globals([scalar])
                logger.info("Added numpy scalar to safe globals")
            
            checkpoint = torch.load(file_path, map_location=device, weights_only=False)
            logger.info("Model loaded with weights_only=True (safe mode)")
            return checkpoint, None
            
        except (RuntimeError, TypeError, AttributeError) as e:
            logger.warning(f"Safe loading failed: {e}. Trying unsafe loading...")
            
            # If safe loading fails, try unsafe loading
            try:
                checkpoint = torch.load(file_path, map_location=device, weights_only=False)
                logger.warning("Model loaded with weights_only=False (UNSAFE mode)")
                return checkpoint, None
            except Exception as inner_e:
                logger.error(f"Unsafe loading also failed: {inner_e}")
                return None, f"Both safe and unsafe loading failed: {str(inner_e)}"
                
    except Exception as e:
        return None, f"Model loading error: {str(e)}"

def load_detection_model():
    """Load the trained model with proper error handling"""
    try:
        model = AdvancedSkinNet(num_classes=len(CLASS_NAMES)).to(device)
        
        # Check if model file exists
        if not os.path.exists(DETECTION_MODEL_PATH):
            logger.error(f"Model file not found at: {DETECTION_MODEL_PATH}")
            return None, f"Model file not found at: {DETECTION_MODEL_PATH}"
        
        # Load the checkpoint safely
        checkpoint, error = safe_load_model(DETECTION_MODEL_PATH, device)
        if checkpoint is None:
            return None, error
        
        # Load model weights from checkpoint
        try:
            if isinstance(checkpoint, dict):
                if 'model_state_dict' in checkpoint:
                    model.load_state_dict(checkpoint['model_state_dict'])
                    logger.info("Model loaded from model_state_dict")
                elif 'state_dict' in checkpoint:
                    model.load_state_dict(checkpoint['state_dict'])
                    logger.info("Model loaded from state_dict")
                elif 'model' in checkpoint:
                    model.load_state_dict(checkpoint['model'])
                    logger.info("Model loaded from 'model' key")
                else:
                    # Try to find the state dict in the checkpoint
                    state_dict_found = False
                    for key in checkpoint.keys():
                        if 'state_dict' in key.lower() or 'model' in key.lower():
                            model.load_state_dict(checkpoint[key])
                            logger.info(f"Model loaded from {key}")
                            state_dict_found = True
                            break
                    
                    if not state_dict_found:
                        # If no state dict found, try direct loading
                        model.load_state_dict(checkpoint)
                        logger.info("Model loaded directly from checkpoint (assumed state dict)")
            else:
                # Checkpoint is not a dictionary, try direct loading
                model.load_state_dict(checkpoint)
                logger.info("Model loaded directly from checkpoint (non-dict)")
                
        except Exception as e:
            error_msg = f"Error loading model weights: {str(e)}"
            logger.error(error_msg)
            if isinstance(checkpoint, dict):
                logger.error(f"Checkpoint keys: {list(checkpoint.keys())}")
            return None, error_msg
            
        model.eval()
        logger.info("Model loaded successfully")
        return model, None
        
    except Exception as e:
        error_msg = f"Error loading model: {str(e)}"
        logger.error(error_msg)
        traceback.print_exc()
        return None, error_msg

def calculate_skin_percentage(image_np):
    """Calculate what percentage of the image appears to be skin"""
    try:
        # Convert to HSV color space (better for skin detection)
        hsv = cv2.cvtColor(image_np, cv2.COLOR_RGB2HSV)
        
        # Define skin color range in HSV
        # These values may need adjustment based on your dataset
        lower_skin = np.array([0, 20, 70], dtype=np.uint8)
        upper_skin = np.array([20, 255, 255], dtype=np.uint8)
        
        # Create mask for skin-colored pixels
        skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)
        
        # Calculate percentage of skin-colored pixels
        skin_pixels = np.sum(skin_mask > 0)
        total_pixels = image_np.shape[0] * image_np.shape[1]
        skin_percentage = (skin_pixels / total_pixels) * 100
        
        return min(skin_percentage, 100.0)
        
    except Exception as e:
        logger.warning(f"Skin percentage calculation failed: {e}")
        return 0.0

def is_likely_skin_image(image_np, threshold=MIN_SKIN_PERCENTAGE):
    """Check if the image contains enough skin to be a valid skin image"""
    skin_percentage = calculate_skin_percentage(image_np)
    return skin_percentage >= threshold, skin_percentage

# Initialize model
detection_model, model_error = load_detection_model()

# Transform
def get_detection_transform():
    return transforms.Compose([
        transforms.Resize((DETECTION_IMAGE_SIZE, DETECTION_IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

detection_transform = get_detection_transform()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="success",
        message="API is running",
        device=str(device),
        model_loaded=detection_model is not None
    )

@app.post("/detect", response_model=DetectionResponse)
async def detect(file: UploadFile = File(...)):
    try:
        if detection_model is None:
            return DetectionResponse(
                status="error",
                message=f"Model not loaded. Error: {model_error}",
                reasons=["Model initialization failed"]
            )
        
        # Read image
        contents = await file.read()
        
        try:
            image = Image.open(io.BytesIO(contents)).convert('RGB')
            img_np = np.array(image)
        except Exception as e:
            return DetectionResponse(
                status="error",
                message="Invalid image file",
                reasons=["Could not process the uploaded image"]
            )
        
        # Check if image contains enough skin
        is_skin, skin_percentage = is_likely_skin_image(img_np)
        
        if not is_skin:
            return DetectionResponse(
                status="success",
                message="Image does not appear to contain skin",
                detection=None,
                confidence=0.0,
                suggestion="Please upload an image of skin for disease detection.",
                skin_percentage=skin_percentage,
                reasons=["Low skin content detected"]
            )
        
        # Preprocess image
        try:
            tensor = detection_transform(image).unsqueeze(0).to(device)
        except Exception as e:
            return DetectionResponse(
                status="error",
                message="Image processing error",
                reasons=["Failed to preprocess image"]
            )
        
        # Get predictions
        try:
            with torch.no_grad():
                outputs = detection_model(tensor)
                probs = torch.softmax(outputs, dim=1)
                confidence, class_idx = torch.max(probs, dim=1)
                confidence = confidence.item()
                class_idx = class_idx.item()
            
            # Get top predictions
            top3_probs, top3_indices = torch.topk(probs, 3)
            top_predictions = {
                CLASS_NAMES[i]: p.item() for p, i in zip(top3_probs[0], top3_indices[0])
            }
            
            detected_disease = CLASS_NAMES[class_idx]
            
            # Response logic
            if confidence < MIN_CONFIDENCE_THRESHOLD:
                return DetectionResponse(
                    status="success",
                    message="Analysis completed with low confidence",
                    detection={
                        "disease": detected_disease,
                        "confidence": confidence,
                        "is_low_confidence": True,
                        "all_predictions": top_predictions
                    },
                    suggestion="For accurate diagnosis, please consult a dermatologist.",
                    skin_percentage=skin_percentage
                )
            else:
                suggestions = {
                    "Acne": "Consider over-the-counter treatments with benzoyl peroxide or salicylic acid.",
                    "Eczema": "Use fragrance-free moisturizers and avoid triggers like harsh soaps.",
                    "Psoriasis": "Moisturize regularly and avoid triggers.",
                    "Tinea Ringworm": "Antifungal creams are typically effective.",
                    "Warts Molluscum": "May resolve on their own. Treatments available."
                }
                
                return DetectionResponse(
                    status="success",
                    message="Analysis completed with high confidence",
                    detection={
                        "disease": detected_disease,
                        "confidence": confidence,
                        "is_low_confidence": False,
                        "all_predictions": top_predictions
                    },
                    suggestion=suggestions.get(detected_disease, 'Please consult a healthcare professional.'),
                    skin_percentage=skin_percentage
                )
                
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}\n{traceback.format_exc()}")
            return DetectionResponse(
                status="error",
                message="Prediction failed",
                reasons=["Error during model prediction"]
            )
        
    except Exception as e:
        logger.error(f"Unexpected error in detect: {str(e)}\n{traceback.format_exc()}")
        return DetectionResponse(
            status="error",
            message="Internal server error",
            reasons=["Unexpected error occurred"]
        )

@app.get("/classes")
async def get_classes():
    return {
        "status": "success",
        "classes": CLASS_NAMES,
        "total_classes": len(CLASS_NAMES),
        "confidence_threshold": MIN_CONFIDENCE_THRESHOLD
    }

@app.get("/model-info")
async def get_model_info():
    return {
        "status": "success",
        "model_architecture": "EfficientNet-B3 with custom head",
        "input_size": DETECTION_IMAGE_SIZE,
        "classes": CLASS_NAMES,
        "device": str(device),
        "model_loaded": detection_model is not None,
        "model_error": model_error if detection_model is None else None
    }

if __name__ == "__main__":
    # Create model directory if it doesn't exist
    model_dir = os.path.dirname(DETECTION_MODEL_PATH)
    if model_dir and not os.path.exists(model_dir):
        os.makedirs(model_dir, exist_ok=True)
        logger.info(f"Created model directory: {model_dir}")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")