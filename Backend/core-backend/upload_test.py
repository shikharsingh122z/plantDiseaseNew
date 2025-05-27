import requests
import os
import time
from datetime import datetime, timedelta
from elasticsearch import Elasticsearch
from PIL import Image
import io
import shutil
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_URL = "http://localhost:5001"
ES_HOST = os.getenv('ES_HOST', 'localhost')
ES_PORT = int(os.getenv('ES_PORT', '9200'))
ES_USERNAME = os.getenv('ES_USERNAME', 'elastic')
ES_PASSWORD = os.getenv('ES_PASSWORD', 'L3HgosWToiwNdhnC70Fc')

def create_test_image():
    """Create a simple test image with timestamp"""
    # Create a color image
    width, height = 200, 200
    img = Image.new('RGB', (width, height), color=(73, 109, 137))
    
    # Add timestamp to make the image unique
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Save to a buffer
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='JPEG')
    img_buffer.seek(0)
    
    return img_buffer, current_time

def upload_image():
    """Upload a test image to the API"""
    print("Creating and uploading test image...")
    
    # Create unique test image
    img_buffer, timestamp = create_test_image()
    image_name = f"test_image_{int(time.time())}.jpg"
    
    # Upload to API
    files = {'file': (image_name, img_buffer, 'image/jpeg')}
    
    try:
        print(f"Uploading image {image_name} at {timestamp}")
        response = requests.post(f"{API_URL}/api/detect", files=files)
        
        print(f"Response status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Disease detected: {result.get('disease')}")
            print(f"Confidence: {result.get('confidence')}%")
            print(f"Image ID: {result.get('image_id')}")
            return True, result.get('image_id'), timestamp
        else:
            print(f"Error: {response.text}")
            return False, None, timestamp
    except Exception as e:
        print(f"Error uploading image: {e}")
        return False, None, timestamp

def check_elasticsearch_logs(image_id, timestamp):
    """Check Elasticsearch for logs related to the uploaded image"""
    print("\nWaiting 3 seconds for logs to be processed...")
    time.sleep(3)
    
    print("Checking Elasticsearch for new logs...")
    try:
        es = Elasticsearch(
            [f"https://{ES_HOST}:{ES_PORT}"],
            basic_auth=(ES_USERNAME, ES_PASSWORD),
            verify_certs=False,
            ssl_show_warn=False
        )
        
        if not es.ping():
            print("❌ Could not connect to Elasticsearch")
            return False
        
        # Calculate a time window
        time_min = (datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S") - timedelta(minutes=5)).isoformat()
        time_max = (datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S") + timedelta(minutes=5)).isoformat()
        
        # Query for prediction logs
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"range": {"timestamp": {"gte": time_min, "lte": time_max}}},
                        {"match": {"event_type": "prediction"}}
                    ]
                }
            },
            "sort": [{"timestamp": {"order": "desc"}}],
            "size": 5
        }
        
        result = es.search(index="plantdisease", body=query)
        hits = result.get('hits', {}).get('hits', [])
        
        if hits:
            print("\n✅ Found recent prediction logs:")
            for hit in hits:
                source = hit['_source']
                log_time = source.get('timestamp')
                message = source.get('message', 'No message')
                img_filename = source.get('image_filename', 'unknown')
                
                if image_id and image_id in img_filename:
                    print(f"  ✨ {log_time}: {message} [MATCHES YOUR UPLOAD]")
                else:
                    print(f"  - {log_time}: {message}")
            return True
        else:
            print("\n❌ No recent prediction logs found")
            
            # Check if index exists
            if not es.indices.exists(index="plantdisease"):
                print("❌ plantdisease index doesn't exist!")
            else:
                # Get total document count
                count = es.count(index="plantdisease")
                print(f"Total documents in plantdisease index: {count.get('count', 0)}")
            
            return False
            
    except Exception as e:
        print(f"❌ Error checking logs: {e}")
        return False

def check_logger_connections():
    """Verify that the logger can connect to Elasticsearch"""
    print("\nVerifying logger connections...")
    
    # Check if the logger module can connect to Elasticsearch
    try:
        from logger import es_client
        
        if es_client and es_client.ping():
            print("✅ Logger is successfully connected to Elasticsearch")
            return True
        else:
            print("❌ Logger is not connected to Elasticsearch")
            return False
    except Exception as e:
        print(f"❌ Error checking logger connection: {e}")
        return False

def inspect_backend_code():
    """Check if logger is properly imported and used in app.py"""
    print("\nInspecting backend code...")
    
    try:
        # Check app.py imports
        with open('app.py', 'r') as f:
            app_code = f.read()
            
        if 'import logger' in app_code or 'from logger import' in app_code:
            print("✅ Logger is imported in app.py")
        else:
            print("❌ Logger is not properly imported in app.py")
            
        if 'log_prediction(' in app_code:
            print("✅ log_prediction function is called in app.py")
        else:
            print("❌ log_prediction function is not called in app.py")
            
        if 'log_api_request(' in app_code:
            print("✅ log_api_request function is called in app.py")
        else:
            print("❌ log_api_request function is not called in app.py")
            
    except Exception as e:
        print(f"❌ Error inspecting code: {e}")

def main():
    print("===== PlantG Upload and Logging Test =====")
    
    # Check logger connections
    check_logger_connections()
    
    # Inspect backend code
    inspect_backend_code()
    
    # Upload test image
    success, image_id, timestamp = upload_image()
    
    if success:
        # Check for logs
        check_elasticsearch_logs(image_id, timestamp)
    
    print("\n===== Test complete =====")
    print("\nTroubleshooting tips if logs are not appearing:")
    print("1. Check that the Flask app is running (should see uploads in uploads/ directory)")
    print("2. Verify Elasticsearch is running (curl https://localhost:9200 -k -u elastic:password)")
    print("3. Ensure the app uses the logger module correctly")
    print("4. Check for errors in the console where the Flask app is running")
    print("5. Make sure your Kibana data view is correctly configured:")
    print("   - Pattern: plantdisease*")
    print("   - Time field: timestamp")
    print("   - Time range includes current time")

if __name__ == "__main__":
    main() 