import os
import json
import logging
from datetime import datetime
from elasticsearch import Elasticsearch
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Elasticsearch settings
es_host = os.getenv('ES_HOST', 'localhost')
es_port = int(os.getenv('ES_PORT', '9200'))
es_username = os.getenv('ES_USERNAME', 'elastic')
es_password = os.getenv('ES_PASSWORD', 'L3HgosWToiwNdhnC70Fc')  # Hardcoded for testing

def create_elasticsearch_client():
    """Create and return an Elasticsearch client"""
    try:
        # Create Elasticsearch client
        es = Elasticsearch(
            [f"https://{es_host}:{es_port}"],
            basic_auth=(es_username, es_password),
            verify_certs=False,
            ssl_show_warn=False
        )
        
        # Check if connection is successful
        if es.ping():
            logger.info(f"Successfully connected to Elasticsearch at {es_host}:{es_port}")
            return es
        else:
            logger.error(f"Failed to connect to Elasticsearch at {es_host}:{es_port}")
            return None
    except Exception as e:
        logger.error(f"Error connecting to Elasticsearch: {e}")
        return None

def send_test_logs(es_client, count=5):
    """Send test logs to Elasticsearch"""
    if not es_client:
        logger.error("No Elasticsearch client provided")
        return False
    
    success_count = 0
    for i in range(count):
        try:
            # Create a test log
            log_data = {
                "timestamp": datetime.now().isoformat(),
                "message": f"Test log entry #{i+1}",
                "event_type": "test",
                "level": "INFO",
                "application": "PlantG",
                "component": "TestLogger",
                "user_id": "test_user",
                "details": {
                    "test_number": i+1,
                    "test_datetime": datetime.now().isoformat()
                }
            }
            
            # Send to Elasticsearch
            response = es_client.index(
                index="plantdisease",
                document=log_data
            )
            
            if response.get('result') == 'created':
                success_count += 1
                logger.info(f"Log #{i+1} indexed successfully with id: {response.get('_id')}")
            else:
                logger.warning(f"Log #{i+1} indexing response: {response}")
                
        except Exception as e:
            logger.error(f"Error sending log #{i+1} to Elasticsearch: {e}")
    
    logger.info(f"Successfully sent {success_count} out of {count} logs to Elasticsearch")
    return success_count == count

def test_kibana_index():
    """Test if the Kibana index pattern is set up correctly"""
    try:
        es_client = create_elasticsearch_client()
        if not es_client:
            return False
        
        # Check if index exists
        index_exists = es_client.indices.exists(index="plantdisease")
        if not index_exists:
            logger.error("plantdisease index does not exist")
            
            # Create the index
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
                            }
                        }
                    }
                }
            )
            logger.info(f"Created plantdisease index: {response}")
        else:
            logger.info("plantdisease index exists")
        
        # Send test logs
        return send_test_logs(es_client)
    except Exception as e:
        logger.error(f"Error testing Kibana index: {e}")
        return False

if __name__ == "__main__":
    logger.info("Testing direct logging to Elasticsearch...")
    result = test_kibana_index()
    if result:
        print("\n==============================================")
        print("✅ SUCCESS: Logs sent to Elasticsearch successfully")
        print("==============================================")
        print("\nTo view logs in Kibana:")
        print("1. Go to http://localhost:5601")
        print("2. Log in with username 'elastic' and password 'L3HgosWToiwNdhnC70Fc'")
        print("3. Click on 'Discover' in the left sidebar")
        print("4. Create a data view with pattern 'plantdisease*'")
        print("5. Select 'timestamp' as the time field")
        print("6. Click 'Create data view'")
        print("7. You should now see the logs")
        print("\nIf you don't see logs, try the following:")
        print("1. Make sure the time filter (top right) is set to include the current time")
        print("2. Try refreshing the page")
        print("3. Check if Elasticsearch and Kibana are running properly")
    else:
        print("\n==============================================")
        print("❌ ERROR: Failed to send logs to Elasticsearch")
        print("==============================================")
        print("\nCheck the error messages above for more details") 