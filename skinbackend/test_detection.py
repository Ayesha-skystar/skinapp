# test_detection.py - FIXED VERSION
import os
import requests
import json
import time
import argparse
from PIL import Image

class DetectionTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = []
        
    def check_image_file(self, image_path):
        """Check if file is a valid image"""
        try:
            if not os.path.exists(image_path):
                return False, "File does not exist"
            
            valid_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']
            if not any(image_path.lower().endswith(ext) for ext in valid_extensions):
                return False, "Invalid file extension"
            
            try:
                with Image.open(image_path) as img:
                    img.verify()
                return True, "Valid image"
            except:
                return False, "Corrupted or invalid image file"
                
        except Exception as e:
            return False, f"Error checking file: {str(e)}"
    
    def test_single_image(self, image_path, expected_class=None):
        """Test a single image and return results"""
        try:
            print(f"Testing: {os.path.basename(image_path)}")
            
            # Check if it's a valid image
            is_valid, message = self.check_image_file(image_path)
            if not is_valid:
                print(f"  ✗ Invalid image: {message}")
                result = {'error': message, 'file_path': image_path, 'expected_class': expected_class}
                self.results.append(result)
                return result
            
            with open(image_path, 'rb') as f:
                files = {'file': f}
                response = requests.post(f"{self.base_url}/detect", files=files, timeout=30)
                
            result = response.json()
            result['file_path'] = image_path
            result['expected_class'] = expected_class
            
            # Print results
            if result.get('status') == 'success':
                if 'detection' in result:
                    detected = result['detection'].get('disease', 'Unknown')
                    confidence = result['detection'].get('confidence', 0)
                    
                    if expected_class:
                        # Handle potential misspellings in detection
                        is_correct = (detected.lower() == expected_class.lower())
                        status = "✓" if is_correct else "✗"
                        result['correct'] = is_correct
                        print(f"  {status} Expected: {expected_class}, Got: {detected}, Confidence: {confidence:.2%}")
                    else:
                        print(f"  ? Detected: {detected}, Confidence: {confidence:.2%}")
                else:
                    print(f"  ! Success: {result.get('message')}")
            else:
                print(f"  ✗ Error: {result.get('message')}")
                if 'reasons' in result:
                    for reason in result.get('reasons', []):
                        print(f"    Reason: {reason}")
            
            self.results.append(result)
            return result
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Network error: {str(e)}"
            print(f"  ✗ {error_msg}")
            error_result = {'error': error_msg, 'file_path': image_path, 'expected_class': expected_class}
            self.results.append(error_result)
            return error_result
        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            print(f"  ✗ {error_msg}")
            error_result = {'error': error_msg, 'file_path': image_path, 'expected_class': expected_class}
            self.results.append(error_result)
            return error_result
    
    def test_directory(self, directory_path, expected_class=None):
        """Test all images in a directory"""
        if not os.path.exists(directory_path):
            print(f"Directory not found: {directory_path}")
            return []
        
        image_files = []
        for ext in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
            for f in os.listdir(directory_path):
                if f.lower().endswith(ext):
                    image_files.append(os.path.join(directory_path, f))
        
        print(f"Found {len(image_files)} images in {directory_path}")
        
        results = []
        for image_path in image_files:
            result = self.test_single_image(image_path, expected_class)
            results.append(result)
            time.sleep(0.1)  # Reduced sleep time
            
        return results
    
    def run_comprehensive_test(self, test_dir):
        """Run tests on all subdirectories in the test directory"""
        if not os.path.exists(test_dir):
            print(f"Test directory not found: {test_dir}")
            return
        
        # Test each subdirectory (each representing a class)
        for class_name in CLASS_NAMES:
            class_dir = os.path.join(test_dir, class_name.lower())
            if os.path.exists(class_dir):
                print(f"\n=== Testing {class_name} ===")
                self.test_directory(class_dir, class_name)
    
    def calculate_metrics(self):
        """Calculate accuracy and other metrics"""
        correct = 0
        total = 0
        confidence_sum = 0
        confidence_count = 0
        
        for result in self.results:
            if result.get('status') == 'success' and 'detection' in result:
                if result.get('expected_class') is not None:  # Only count if expected_class is provided
                    total += 1
                    # Handle case-insensitive comparison for misspellings
                    detected = result['detection'].get('disease', '')
                    expected = result['expected_class']
                    if detected.lower() == expected.lower():
                        correct += 1
                        result['correct'] = True
                    else:
                        result['correct'] = False
                
                if 'confidence' in result['detection']:
                    confidence_sum += result['detection']['confidence']
                    confidence_count += 1
        
        accuracy = correct / total if total > 0 else 0
        avg_confidence = confidence_sum / confidence_count if confidence_count > 0 else 0
        
        return {
            'accuracy': accuracy,
            'avg_confidence': avg_confidence,
            'total_tests': total,
            'correct_predictions': correct,
            'total_images': len(self.results)
        }
    
    def generate_report(self):
        """Generate a detailed test report"""
        metrics = self.calculate_metrics()
        
        print("\n" + "=" * 60)
        print("SKIN DISEASE DETECTION TEST REPORT")
        print("=" * 60)
        print(f"Total Images Tested: {metrics['total_images']}")
        print(f"Total Valid Tests: {metrics['total_tests']}")
        print(f"Correct Predictions: {metrics['correct_predictions']}")
        print(f"Accuracy: {metrics['accuracy']:.2%}")
        print(f"Average Confidence: {metrics['avg_confidence']:.2%}")
        print("=" * 60)
        
        # Print detailed results
        print("\nDETAILED RESULTS:")
        print("-" * 60)
        
        for i, result in enumerate(self.results):
            if result.get('status') == 'success' and 'detection' in result:
                status = "✓" if result.get('correct', False) else "✗"
                expected = result.get('expected_class', 'N/A')
                detected = result.get('detection', {}).get('disease', 'Error')
                confidence = result.get('detection', {}).get('confidence', 0)
                
                # FIXED: Handle None values in expected
                expected_str = str(expected) if expected is not None else "N/A"
                detected_str = str(detected) if detected is not None else "Unknown"
                
                print(f"{i+1:2d}. {status} Expected: {expected_str:15} Detected: {detected_str:15} Confidence: {confidence:.2%}")
            elif 'error' in result:
                print(f"{i+1:2d}. ✗ ERROR: {result['error']}")
            elif result.get('status') == 'error':
                print(f"{i+1:2d}. ✗ API ERROR: {result.get('message')}")
        
        return metrics

# Define CLASS_NAMES here to match your main.py
CLASS_NAMES = ['Acne', 'Eczema', 'Psoriasis', 'Tinea Ringworm', 'Warts Molluscum']

def main():
    parser = argparse.ArgumentParser(description='Test Skin Disease Detection API')
    parser.add_argument('--url', default='http://localhost:8000', help='API base URL')
    parser.add_argument('--test-dir', default='test_images', help='Test images directory')
    parser.add_argument('--single-image', help='Test a single image file')
    parser.add_argument('--single-class', help='Expected class for single image')
    parser.add_argument('--comprehensive', action='store_true', help='Run comprehensive test on all subdirectories')
    
    args = parser.parse_args()
    
    tester = DetectionTester(args.url)
    
    # Check if API is running
    try:
        health_response = requests.get(f"{args.url}/health", timeout=5)
        health_data = health_response.json()
        print(f"API Health: {health_data}")
        
        if not health_data.get('model_loaded', False):
            print("WARNING: Model is not loaded! Testing will fail.")
        
    except requests.exceptions.RequestException:
        print(f"Error: Could not connect to API at {args.url}")
        print("Make sure your backend server is running with: python main.py")
        return
    
    if args.single_image:
        if os.path.exists(args.single_image):
            tester.test_single_image(args.single_image, args.single_class)
        else:
            print(f"Image file not found: {args.single_image}")
    elif args.comprehensive:
        tester.run_comprehensive_test(args.test_dir)
    else:
        # Default behavior: test all images in the test directory
        if os.path.exists(args.test_dir):
            print(f"Testing all images in: {args.test_dir}")
            tester.test_directory(args.test_dir)
        else:
            print(f"Test directory not found: {args.test_dir}")
            print("Please specify either --single-image or create a test_images directory")
            return
    
    report = tester.generate_report()
    
    with open("test_report.json", "w") as f:
        json.dump({
            'metrics': report,
            'detailed_results': tester.results
        }, f, indent=2)
    
    print(f"\nTest report saved to test_report.json")

if __name__ == "__main__":
    main()