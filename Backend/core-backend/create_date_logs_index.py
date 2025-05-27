import os
from dotenv import load_dotenv
from elasticsearch import Elasticsearch

# Load environment variables
load_dotenv()

# Get Elasticsearch connection details
es_host = os.getenv('ES_HOST', 'localhost')
es_port = int(os.getenv('ES_PORT', '9200'))
es_username = os.getenv('ES_USERNAME', 'elastic')
es_password = os.getenv('ES_PASSWORD', '')

def create_datelogs_index():
    """Create a proper index for plant disease logs that accepts 2025 timestamps"""
    try:
        # Connect to Elasticsearch
        es_client = Elasticsearch(
            [f"https://{es_host}:{es_port}"],
            basic_auth=(es_username, es_password),
            verify_certs=False,
            ssl_show_warn=False
        )
        
        print(f"Connected to Elasticsearch at {es_host}:{es_port}")
        
        # Create index template for datelogs
        template_body = {
            "index_patterns": ["datelogs*"],
            "template": {
                "settings": {
                    "number_of_shards": 1,
                    "number_of_replicas": 0
                },
                "mappings": {
                    "properties": {
                        "timestamp": {
                            "type": "date",
                            "format": "strict_date_optional_time||epoch_millis"
                        },
                        "host": {"type": "keyword"},
                        "request_id": {"type": "keyword"},
                        "user_id": {"type": "keyword"},
                        "disease": {"type": "keyword"},
                        "confidence": {"type": "float"},
                        "image_filename": {"type": "keyword"},
                        "event_type": {"type": "keyword"},
                        "message": {"type": "text"},
                        "endpoint": {"type": "keyword"},
                        "method": {"type": "keyword"},
                        "status_code": {"type": "integer"},
                        "request_data": {"type": "text"},
                        "error_message": {"type": "text"},
                        "context": {"type": "text"}
                    }
                }
            }
        }
        
        # Create or update the index template
        es_client.indices.put_index_template(name="datelogs_template", body=template_body)
        print("Successfully created/updated 'datelogs_template' index template.")
        
        # Create the index if it doesn't exist
        if not es_client.indices.exists(index="datelogs"):
            es_client.indices.create(index="datelogs")
            print("Created 'datelogs' index.")
        else:
            print("The 'datelogs' index already exists.")
            
            # Option to delete the existing index
            response = input("Do you want to delete the existing index and recreate it? (y/n): ")
            if response.lower() == 'y':
                es_client.indices.delete(index="datelogs")
                es_client.indices.create(index="datelogs")
                print("Deleted and recreated 'datelogs' index.")
        
        print("\nIndex setup complete. Will use actual system date (May 15, 2025).")
        print("\nTo use this index in Kibana:")
        print("1. Go to Kibana → Stack Management → Index Patterns")
        print("2. Create a new index pattern matching 'datelogs*'")
        print("3. Select 'timestamp' as the time field")
        print("4. Go to Discover view and select the 'datelogs*' index pattern") 
        print("5. Set the time filter to 'Today' or create a custom time range including May 2025")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    create_datelogs_index() 