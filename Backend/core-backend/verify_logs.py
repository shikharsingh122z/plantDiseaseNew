import requests
import json
import os
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import time
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Elasticsearch configuration
ES_HOST = os.getenv('ES_HOST', 'localhost')
ES_PORT = int(os.getenv('ES_PORT', '9200'))
ES_USERNAME = os.getenv('ES_USERNAME', 'elastic')
ES_PASSWORD = os.getenv('ES_PASSWORD', 'L3HgosWToiwNdhnC70Fc')  # Replace with your password

# Kibana configuration
KIBANA_HOST = os.getenv('KIBANA_HOST', 'localhost')
KIBANA_PORT = int(os.getenv('KIBANA_PORT', '5601'))

def create_elasticsearch_client():
    """Create and return an Elasticsearch client"""
    try:
        # Create Elasticsearch client
        es = Elasticsearch(
            [f"https://{ES_HOST}:{ES_PORT}"],
            basic_auth=(ES_USERNAME, ES_PASSWORD),
            verify_certs=False,
            ssl_show_warn=False
        )
        
        # Check if connection is successful
        if es.ping():
            print(f"✅ Successfully connected to Elasticsearch at {ES_HOST}:{ES_PORT}")
            return es
        else:
            print(f"❌ Failed to connect to Elasticsearch at {ES_HOST}:{ES_PORT}")
            return None
    except Exception as e:
        print(f"❌ Error connecting to Elasticsearch: {e}")
        return None

def check_indices(es_client):
    """Check if the plantdisease index exists"""
    if not es_client:
        return
    
    print("\n=== Checking Elasticsearch Indices ===")
    try:
        indices = es_client.cat.indices(format="json")
        
        # Print all indices
        print("\nAll available indices:")
        for index in indices:
            index_name = index.get('index')
            doc_count = index.get('docs.count', '0')
            status = index.get('status', 'unknown')
            
            if index_name == 'plantdisease':
                print(f"  📊 {index_name} (status: {status}, docs: {doc_count}) ← Plant Disease Index")
            else:
                print(f"  - {index_name} (status: {status}, docs: {doc_count})")
        
        # Check if plantdisease index exists
        index_exists = es_client.indices.exists(index="plantdisease")
        if index_exists:
            print("\n✅ plantdisease index exists")
            
            # Get index mapping
            mapping = es_client.indices.get_mapping(index="plantdisease")
            print("\nIndex mapping:")
            print(json.dumps(mapping.get('plantdisease', {}).get('mappings', {}), indent=2))
            
            # Get document count
            count = es_client.count(index="plantdisease")
            print(f"\nDocument count: {count.get('count', 0)}")
            
            # Get recent documents
            query = {
                "sort": [{"timestamp": {"order": "desc"}}],
                "size": 3
            }
            result = es_client.search(index="plantdisease", body=query)
            hits = result.get('hits', {}).get('hits', [])
            
            if hits:
                print("\nMost recent documents:")
                for hit in hits:
                    source = hit['_source']
                    print(f"  - {source.get('timestamp')}: {source.get('message', 'No message')}")
                    print(f"    Event type: {source.get('event_type', 'unknown')}")
                    print(f"    User ID: {source.get('user_id', 'unknown')}")
                    print()
            else:
                print("\n❌ No documents found in plantdisease index")
        else:
            print("\n❌ plantdisease index does not exist")
            
            # Offer to create the index
            response = input("Would you like to create the plantdisease index? (y/n): ")
            if response.lower() == 'y':
                create_plantdisease_index(es_client)
    except Exception as e:
        print(f"❌ Error checking indices: {e}")

def create_plantdisease_index(es_client):
    """Create the plantdisease index with proper mapping"""
    try:
        response = es_client.indices.create(
            index="plantdisease",
            body={
                "settings": {
                    "number_of_shards": 1,
                    "number_of_replicas": 0
                },
                "mappings": {
                    "properties": {
                        "timestamp": {
                            "type": "date"
                        },
                        "host": {
                            "type": "keyword"
                        },
                        "request_id": {
                            "type": "keyword"
                        },
                        "user_id": {
                            "type": "keyword"
                        },
                        "event_type": {
                            "type": "keyword"
                        },
                        "message": {
                            "type": "text"
                        }
                    }
                }
            }
        )
        print(f"✅ Created plantdisease index: {response}")
        
        # Add a test document
        doc = {
            "timestamp": datetime.now().isoformat(),
            "host": "localhost",
            "request_id": "test-123",
            "user_id": "test-user",
            "event_type": "test",
            "message": "Test log entry for verification"
        }
        es_client.index(index="plantdisease", document=doc)
        print("✅ Added test document to plantdisease index")
    except Exception as e:
        print(f"❌ Error creating index: {e}")

def verify_kibana_data_views():
    """Verify data views in Kibana"""
    print("\n=== Verifying Kibana Data Views ===")
    
    # Print instructions for manual verification
    print("\nTo create a data view in Kibana:")
    print("1. Go to http://localhost:5601")
    print("2. Log in with username 'elastic' and password 'L3HgosWToiwNdhnC70Fc'")
    print("3. Navigate to Stack Management > Data Views")
    print("4. Click 'Create data view'")
    print("5. Set index pattern to 'plantdisease*'")
    print("6. Select 'timestamp' as the time field")
    print("7. Click 'Save data view'")
    
    print("\nTo view logs in Discover:")
    print("1. Click on 'Discover' in the left navigation")
    print("2. Select 'plantdisease*' data view from the dropdown")
    print("3. Adjust the time range in the upper right to include recent data")
    print("4. Click 'Refresh'")
    
    # Programmatic check would require Kibana API access, which requires additional setup

def query_logs_by_type(es_client, event_type, limit=10):
    """Query logs by event type"""
    if not es_client:
        return
    
    print(f"\n=== Querying {event_type} logs ===")
    try:
        # Get time range for the last 24 hours
        time_min = (datetime.now() - timedelta(hours=24)).isoformat()
        time_max = datetime.now().isoformat()
        
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"range": {"timestamp": {"gte": time_min, "lte": time_max}}},
                        {"match": {"event_type": event_type}}
                    ]
                }
            },
            "sort": [{"timestamp": {"order": "desc"}}],
            "size": limit
        }
        
        result = es_client.search(index="plantdisease", body=query)
        hits = result.get('hits', {}).get('hits', [])
        
        if hits:
            print(f"Found {len(hits)} {event_type} logs (of {result.get('hits', {}).get('total', {}).get('value', 0)} total):")
            for hit in hits:
                source = hit['_source']
                print(f"  - {source.get('timestamp')}: {source.get('message', 'No message')}")
        else:
            print(f"No {event_type} logs found in the last 24 hours")
    except Exception as e:
        print(f"❌ Error querying logs: {e}")

def main():
    print("===== Plant Disease Logging Verification =====")
    
    # Create Elasticsearch client
    es_client = create_elasticsearch_client()
    if not es_client:
        return
    
    # Check indices
    check_indices(es_client)
    
    # Query specific log types
    query_logs_by_type(es_client, "prediction")
    query_logs_by_type(es_client, "api_request")
    query_logs_by_type(es_client, "error")
    
    # Verify Kibana data views
    verify_kibana_data_views()
    
    print("\n===== Verification complete =====")

if __name__ == "__main__":
    main() 