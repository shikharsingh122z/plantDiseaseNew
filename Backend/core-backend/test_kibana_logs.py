import time
import random
from datetime import datetime
import pytz
from logger import log_prediction, log_api_request, log_error, get_ist_timestamp

def test_logs_with_fixed_date():
    """Test function to generate sample logs with fixed 2024 timestamp for Kibana testing"""
    print("Testing logging with fixed 2024 date for Kibana...")
    
    # Display current timestamp information
    now_native = datetime.now()
    now_ist = datetime.now(pytz.timezone('Asia/Kolkata'))
    fixed_timestamp = get_ist_timestamp()
    
    print(f"System time without timezone: {now_native.isoformat()}")
    print(f"IST time with timezone: {now_ist.isoformat()}")
    print(f"Fixed timestamp with 2024 year: {fixed_timestamp}")
    
    # List of sample diseases for testing
    diseases = [
        "Tomato_Late_blight", 
        "Tomato_healthy", 
        "Potato_Early_blight", 
        "Potato_healthy", 
        "Apple_scab", 
        "Apple_healthy"
    ]
    
    # List of sample user IDs
    user_ids = ["user1", "user2", "admin", "guest", "anonymous"]
    
    # Generate 10 sample prediction logs
    print("\nGenerating 10 sample prediction logs...")
    for i in range(10):
        disease = random.choice(diseases)
        user_id = random.choice(user_ids)
        confidence = random.uniform(85.0, 99.9)
        image_filename = f"test_image_{i+1}.jpg"
        
        log_prediction(
            user_id=user_id,
            disease=disease,
            confidence=confidence,
            image_filename=image_filename
        )
        
        # Small delay between logs
        time.sleep(0.5)
    
    # Generate 5 sample API request logs
    print("\nGenerating 5 sample API request logs...")
    endpoints = ["/api/detect", "/api/user/detect", "/api/user/analyses", "/api/health"]
    methods = ["GET", "POST"]
    
    for i in range(5):
        endpoint = random.choice(endpoints)
        method = random.choice(methods)
        user_id = random.choice(user_ids)
        status_code = random.choice([200, 200, 200, 400, 500])  # Mostly successful
        
        log_api_request(
            endpoint=endpoint,
            method=method,
            user_id=user_id,
            status_code=status_code
        )
        
        # Small delay between logs
        time.sleep(0.5)
    
    # Generate 3 sample error logs
    print("\nGenerating 3 sample error logs...")
    errors = [
        "Failed to connect to database", 
        "Image processing error", 
        "Invalid file format",
        "Authentication failed", 
        "Model prediction timeout"
    ]
    
    for i in range(3):
        error_message = random.choice(errors)
        user_id = random.choice(user_ids)
        context = {"attempt": i+1, "source": "test_script"}
        
        log_error(
            error_message=error_message,
            user_id=user_id,
            context=context
        )
        
        # Small delay between logs
        time.sleep(0.5)
    
    print("\nTest complete. Generated logs with corrected timestamps (2024).")
    print("Check Kibana for logs in the 'diseaselogs' index with the following settings:")
    print("1. Go to Kibana -> Stack Management -> Index Patterns")
    print("2. Create a new index pattern matching 'diseaselogs*'")
    print("3. Select 'timestamp' as the time field")
    print("4. Go to Discover view and select the 'diseaselogs*' index pattern")
    print("5. Set the time filter to 'Today' or 'Last 15 minutes'")

if __name__ == "__main__":
    test_logs_with_fixed_date() 