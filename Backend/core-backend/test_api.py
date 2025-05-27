import requests
import json
import os
import argparse
from PIL import Image
import io
import base64
import time
from io import BytesIO
from datetime import datetime, timedelta
from elasticsearch import Elasticsearch
import numpy as np

# Configuration
API_URL = "http://localhost:5000"
ES_HOST = "localhost"
ES_PORT = 9200
ES_USERNAME = "elastic"
ES_PASSWORD = "L3HgosWToiwNdhnC70Fc"  # Use your actual password

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

def create_test_image():
    """Create a simple test image"""
    # Create a simple 100x100 color image
    img = Image.new('RGB', (100, 100), color=(73, 109, 137))
    
    # Save to a BytesIO object
    img_byte_arr = BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    
    return img_byte_arr

def test_detect_endpoint():
    """Test the /api/detect endpoint and check logs"""
    print("\n====== Testing /api/detect endpoint ======")
    
    # Create a test image
    test_img = create_test_image()
    
    # Prepare for upload
    files = {'file': ('test_image.jpg', test_img, 'image/jpeg')}
    
    # Record the time before making the request
    timestamp_before = datetime.now()
    
    # Call the API
    try:
        response = requests.post(f"{API_URL}/detect", files=files)
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Disease detected: {result.get('disease')}")
            print(f"Confidence: {result.get('confidence')}%")
            print(f"Image ID: {result.get('image_id')}")
        else:
            print(f"Error: {response.text}")
            return
    except Exception as e:
        print(f"API request failed: {str(e)}")
        return
    
    # Allow some time for logs to be processed
    time.sleep(1)
    
    # Connect to Elasticsearch to verify logs
    try:
        es = Elasticsearch(
            [f"https://{ES_HOST}:{ES_PORT}"],
            basic_auth=(ES_USERNAME, ES_PASSWORD),
            verify_certs=False,
            ssl_show_warn=False
        )
        
        # Calculate a time window around the API call
        timestamp_after = datetime.now()
        time_min = (timestamp_before - timedelta(minutes=1)).isoformat()
        time_max = (timestamp_after + timedelta(minutes=1)).isoformat()
        
        # Query for logs in the time window
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
        
        # Execute the query
        result = es.search(index="plantdisease", body=query)
        
        # Check if logs exist
        hits = result.get('hits', {}).get('hits', [])
        if hits:
            print("\n✅ Found prediction logs in Elasticsearch:")
            for hit in hits:
                source = hit['_source']
                print(f"  - {source.get('timestamp')}: {source.get('message')}")
        else:
            print("\n❌ No prediction logs found in Elasticsearch for the time period")
            
        # Also check for API request logs
        query['query']['bool']['must'][1]['match']['event_type'] = 'api_request'
        result = es.search(index="plantdisease", body=query)
        
        hits = result.get('hits', {}).get('hits', [])
        if hits:
            print("\n✅ Found API request logs in Elasticsearch:")
            for hit in hits:
                source = hit['_source']
                print(f"  - {source.get('timestamp')}: {source.get('message')}")
        else:
            print("\n❌ No API request logs found in Elasticsearch for the time period")
        
    except Exception as e:
        print(f"\n❌ Error checking Elasticsearch logs: {str(e)}")

def list_es_indices():
    """List all Elasticsearch indices"""
    print("\n====== Listing Elasticsearch Indices ======")
    
    try:
        es = Elasticsearch(
            [f"https://{ES_HOST}:{ES_PORT}"],
            basic_auth=(ES_USERNAME, ES_PASSWORD),
            verify_certs=False,
            ssl_show_warn=False
        )
        
        indices = es.cat.indices(format="json")
        print("Available indices:")
        for index in indices:
            print(f"  - {index.get('index')} (docs: {index.get('docs.count')})")
    except Exception as e:
        print(f"Error listing indices: {str(e)}")

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
        test_detect_endpoint()

if __name__ == "__main__":
    print("===== Plant Disease API and Logging Test =====")
    list_es_indices()
    test_detect_endpoint()
    print("\nTest completed.") 