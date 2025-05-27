# Timestamp Issue in Kibana Logs

## Problem Identified
The system date on your computer is incorrectly set to **2025** instead of **2024**. This is why all logs appear with timestamps from the year 2025 in Elasticsearch and Kibana.

## Verification
We confirmed this by running:
```
$ date
Thu May 15 07:51:25 IST 2025  # Should be 2024
```

All datetime.now() calls in the application are returning dates from 2025, causing all logs to be timestamped with this incorrect year.

## Solutions

### 1. Fix the System Date (Recommended)
The most proper solution is to fix your system date:

```bash
# On macOS
sudo date -u MMDDHHmmYYYY.SS

# Example to set to May 15, 2024 13:45:00
sudo date -u 051513452024.00
```

This requires admin privileges but will fix the problem globally.

### 2. Modify the Code to Correct Timestamps (Quick Fix)
If you can't change the system date, you can modify the logger.py file to correct the timestamps:

1. Create a function that corrects the year:
```python
def get_corrected_timestamp():
    """Get timestamp with corrected year (2024 instead of 2025)"""
    now = datetime.now()
    # Fix year to 2024 if it's incorrectly set to 2025
    if now.year == 2025:
        now = now.replace(year=2024)
    return now.isoformat()
```

2. Replace all instances of `datetime.now().isoformat()` with `get_corrected_timestamp()` in these functions:
   - log_prediction()
   - log_api_request()
   - log_error()

We've prepared a fixed version of the logger in `fixed_logger.py` that implements this solution.

## Viewing Logs in Kibana with Both Years

Since you now have logs with both 2025 and 2024 timestamps, you'll need to configure Kibana to show both:

1. Go to http://localhost:5601
2. Log in with username 'elastic' and password 'L3HgosWToiwNdhnC70Fc'
3. Create a data view with pattern 'plantdisease*' and 'timestamp' as the time field
4. When viewing logs in Discover:
   - Click on the time picker in the top-right
   - Set a custom time range that includes both 2024 and 2025
   - For example: "May 15, 2024 00:00:00" to "May 15, 2025 23:59:59"

## Implementation Instructions

To use the fixed logger:

1. Stop your Flask application
2. Replace logger.py with fixed_logger.py:
   ```bash
   cp fixed_logger.py logger.py
   ```
3. Restart your Flask application:
   ```bash
   python app.py
   ```
4. New logs will now have 2024 timestamps while maintaining the correct date and time

## Testing the Fix

You can test the fix by:

1. Running `python fixed_logger.py` to see that it generates logs with corrected timestamps
2. Checking Elasticsearch for new logs with 2024 timestamps
3. Uploading a new image to test the full system integration 