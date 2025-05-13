import requests
import json
import os
import argparse
from PIL import Image
import io

def test_health_endpoint(base_url):
    """Test the health check endpoint"""
    url = f"{base_url}/api/health"
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing health endpoint: {e}")
        return False

def test_disease_list_endpoint(base_url):
    """Test the disease list endpoint"""
    url = f"{base_url}/api/diseases"
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Total diseases: {len(data['diseases'])}")
            print("First 5 diseases:")
            for disease in data['diseases'][:5]:
                print(f"  - {disease}")
        else:
            print(response.text)
            
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing disease list endpoint: {e}")
        return False

def test_detect_endpoint(base_url, image_path=None):
    """Test the disease detection endpoint with an image"""
    url = f"{base_url}/api/detect"
    
    # If no image provided, create a blank test image
    if not image_path:
        print("No image provided, creating a blank test image...")
        img = Image.new('RGB', (299, 299), color='white')
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)
        
        try:
            files = {'file': ('test.jpg', img_byte_arr, 'image/jpeg')}
            response = requests.post(url, files=files)
            print(f"Status Code: {response.status_code}")
            print(json.dumps(response.json(), indent=2))
            return response.status_code == 200
        except Exception as e:
            print(f"Error testing detect endpoint: {e}")
            return False
    else:
        # Use provided image
        if not os.path.exists(image_path):
            print(f"Error: Image not found at {image_path}")
            return False
            
        try:
            with open(image_path, 'rb') as img:
                files = {'file': (os.path.basename(image_path), img, 'image/jpeg')}
                response = requests.post(url, files=files)
                print(f"Status Code: {response.status_code}")
                print(json.dumps(response.json(), indent=2))
                return response.status_code == 200
        except Exception as e:
            print(f"Error testing detect endpoint: {e}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Test the Plant Disease Detection API')
    parser.add_argument('--url', default='http://localhost:5001', help='Base URL of the API')
    parser.add_argument('--image', help='Path to test image (optional)')
    parser.add_argument('--test', choices=['health', 'diseases', 'detect', 'all'], default='all', 
                        help='Test to run (default: all)')
    
    args = parser.parse_args()
    
    print(f"Testing Plant Disease Detection API at {args.url}")
    
    if args.test in ['health', 'all']:
        print("\n=== Testing Health Endpoint ===")
        test_health_endpoint(args.url)
    
    if args.test in ['diseases', 'all']:
        print("\n=== Testing Disease List Endpoint ===")
        test_disease_list_endpoint(args.url)
    
    if args.test in ['detect', 'all']:
        print("\n=== Testing Disease Detection Endpoint ===")
        test_detect_endpoint(args.url, args.image)

if __name__ == "__main__":
    main() 