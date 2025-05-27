import requests
import os
import time
import json
from datetime import datetime, timedelta
from elasticsearch import Elasticsearch
from PIL import Image
import io
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_URL = "http://localhost:5001"  # Make sure this matches your Flask app port
ES_HOST = os.getenv('ES_HOST', 'localhost')
ES_PORT = int(os.getenv('ES_PORT', '9200'))
ES_USERNAME = os.getenv('ES_USERNAME', 'elastic')
ES_PASSWORD = os.getenv('ES_PASSWORD', 'L3HgosWToiwNdhnC70Fc')

def create_test_image():
    """Create a simple test image with timestamp and unique color"""
    # Create a unique timestamp ID for this test
    timestamp_id = datetime.now().strftime("%H%M%S")
    
    # Create a color image with a unique color based on the timestamp
    # This gives a different color for each test run
    r = (int(timestamp_id[0:2]) % 200) + 55  # red component (55-255)
    g = (int(timestamp_id[2:4]) % 200) + 55  # green component (55-255)
    b = (int(timestamp_id[4:6]) % 200) + 55  # blue component (55-255)
    
    width, height = 200, 200
    img = Image.new('RGB', (width, height), color=(r, g, b))
    
    # Add timestamp text to make the image unique
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Save to a buffer
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='JPEG')
    img_buffer.seek(0)
    
    print(f"Created image with RGB({r},{g},{b}) at {current_time}")
    return img_buffer, current_time, f"RGB({r},{g},{b})"

def verify_server_running():
    """Check if the server is running"""
    try:
        response = requests.get(f"{API_URL}/api/health")
        if response.status_code == 200:
            print("✅ Server is running properly")
            return True
        else:
            print(f"❌ Server returned status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Server is not running or not accessible: {e}")
        return False

def upload_image():
    """Upload a test image to the API"""
    print("\n===== Testing Image Upload =====")
    
    # Create unique test image
    img_buffer, timestamp, color_info = create_test_image()
    image_name = f"test_image_{int(time.time())}.jpg"
    
    # Upload to API
    files = {'file': (image_name, img_buffer, 'image/jpeg')}
    
    try:
        print(f"Uploading image {image_name} at {timestamp} ({color_info})")
        response = requests.post(f"{API_URL}/api/detect", files=files)
        
        print(f"Response status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Disease detected: {result.get('disease')}")
            print(f"Confidence: {result.get('confidence')}%")
            print(f"Image ID: {result.get('image_id')}")
            return True, result.get('image_id'), timestamp, color_info
        else:
            print(f"Error: {response.text if response.text else 'No response'}")
            return False, None, timestamp, color_info
    except Exception as e:
        print(f"Error uploading image: {e}")
        return False, None, timestamp, color_info

def check_elasticsearch_connection():
    """Verify Elasticsearch connection"""
    print("\n===== Checking Elasticsearch Connection =====")
    try:
        es = Elasticsearch(
            [f"https://{ES_HOST}:{ES_PORT}"],
            basic_auth=(ES_USERNAME, ES_PASSWORD),
            verify_certs=False,
            ssl_show_warn=False
        )
        
        if es.ping():
            print("✅ Successfully connected to Elasticsearch")
            
            # Check if plantdisease index exists
            if es.indices.exists(index="plantdisease"):
                count = es.count(index="plantdisease")
                print(f"✅ plantdisease index exists with {count.get('count', 0)} documents")
                return es
            else:
                print("❌ plantdisease index does not exist")
                return None
        else:
            print("❌ Failed to connect to Elasticsearch")
            return None
    except Exception as e:
        print(f"❌ Error connecting to Elasticsearch: {e}")
        return None

def check_recent_logs(es_client, image_id, timestamp, color_info):
    """Check for recent logs related to the image upload"""
    if not es_client:
        return
    
    print(f"\n===== Checking for logs of image {image_id} =====")
    print(f"Image details: {color_info} at {timestamp}")
    print("Waiting 5 seconds for logs to be processed...")
    time.sleep(5)
    
    try:
        # Get time window
        time_min = (datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S") - timedelta(minutes=2)).isoformat()
        time_max = (datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S") + timedelta(minutes=2)).isoformat()
        
        # Use a broader query to see all recent logs first
        all_query = {
            "query": {
                "range": {
                    "timestamp": {
                        "gte": time_min,
                        "lte": time_max
                    }
                }
            },
            "sort": [{"timestamp": {"order": "desc"}}],
            "size": 10
        }
        
        print("\nChecking all recent logs:")
        results = es_client.search(index="plantdisease", body=all_query)
        hits = results.get('hits', {}).get('hits', [])
        
        if hits:
            print(f"Found {len(hits)} recent logs:")
            for hit in hits:
                source = hit['_source']
                print(f"  - {source.get('timestamp')}: {source.get('message', 'No message')}")
                print(f"    Event type: {source.get('event_type', 'unknown')}")
                if source.get('image_filename'):
                    print(f"    Image: {source.get('image_filename')}")
                print()
            
            # Now check specifically for our image
            if image_id:
                print(f"\nChecking specifically for logs of image {image_id}:")
                prediction_query = {
                    "query": {
                        "bool": {
                            "must": [
                                {"range": {"timestamp": {"gte": time_min, "lte": time_max}}},
                                {"match": {"image_filename": image_id}}
                            ]
                        }
                    }
                }
                
                results = es_client.search(index="plantdisease", body=prediction_query)
                hits = results.get('hits', {}).get('hits', [])
                
                if hits:
                    print(f"✅ Found {len(hits)} logs specifically for your uploaded image:")
                    for hit in hits:
                        source = hit['_source']
                        print(f"  - {source.get('timestamp')}: {source.get('message', 'No message')}")
                else:
                    print(f"❌ No logs found specifically for your image {image_id}")
            
            return True
        else:
            print("❌ No recent logs found at all - logging is not working")
            return False
    except Exception as e:
        print(f"❌ Error checking logs: {e}")
        return False

def print_kibana_instructions():
    """Print instructions for viewing logs in Kibana"""
    print("\n===== How to View Your Logs in Kibana =====")
    print("1. Go to http://localhost:5601")
    print("2. Log in with username 'elastic' and password 'L3HgosWToiwNdhnC70Fc'")
    print("3. Create a data view:")
    print("   a. Go to Stack Management > Data Views")
    print("   b. Click 'Create data view'")
    print("   c. Set index pattern to 'plantdisease*'")
    print("   d. Select 'timestamp' as the time field")
    print("   e. Click 'Save data view'")
    print("4. Go to 'Discover' in the left sidebar")
    print("5. Select 'plantdisease*' data view from the dropdown")
    print("6. Set the time range to include recent uploads (last 15 minutes)")
    print("7. Click 'Refresh'")
    print("\nTroubleshooting:")
    print("- If no logs appear, make sure the time range is correct")
    print("- Check that the Flask app is running and can access Elasticsearch")
    print("- Verify no errors in the Flask app logs")
    print("- Make sure 'timestamp' is configured as a date field in the index mapping")

def main():
    print("===== PlantG Kibana Logging Test =====")
    
    # Step 1: Check if server is running
    if not verify_server_running():
        print("\n❌ Cannot proceed with testing: Server is not running or not accessible")
        print("Please start the Flask server first with: python app.py")
        return
    
    # Step 2: Check Elasticsearch connection
    es_client = check_elasticsearch_connection()
    if not es_client:
        print("\n❌ Cannot proceed with log checking: Elasticsearch connection failed")
    
    # Step 3: Upload test image
    success, image_id, timestamp, color_info = upload_image()
    
    # Step 4: Check logs if both upload and ES connection were successful
    if success and es_client:
        check_recent_logs(es_client, image_id, timestamp, color_info)
    
    # Step 5: Print Kibana instructions
    print_kibana_instructions()
    
    print("\n===== Test Complete =====")

if __name__ == "__main__":
    main() 