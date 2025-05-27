import datetime
import pytz
import time
import os
import platform
import socket

def get_system_info():
    """Get detailed system time information"""
    print("===== System Time Information =====")
    
    # Get current time from various sources
    print("\nCurrent Time Information:")
    print(f"Python datetime.now(): {datetime.datetime.now()}")
    print(f"Python datetime.utcnow(): {datetime.datetime.utcnow()}")
    print(f"Time module time(): {time.time()}")
    print(f"Formatted time: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())}")
    
    # Get timezone information
    print("\nTimezone Information:")
    print(f"Time module timezone: {time.timezone}")
    print(f"Time module tzname: {time.tzname}")
    print(f"TZ Environment Variable: {os.environ.get('TZ', 'Not set')}")
    
    # Get system information
    print("\nSystem Information:")
    print(f"Platform: {platform.platform()}")
    print(f"Python Version: {platform.python_version()}")
    print(f"System: {platform.system()}")
    print(f"Hostname: {socket.gethostname()}")

    # Get available timezones
    print("\nSample Timezones:")
    for tz in ['UTC', 'US/Pacific', 'US/Eastern', 'Europe/London', 'Asia/Kolkata']:
        try:
            tz_now = datetime.datetime.now(pytz.timezone(tz))
            print(f"{tz}: {tz_now}")
        except:
            print(f"{tz}: Unable to determine")

def date_converter():
    """Convert between different date formats to verify correct timestamp handling"""
    print("\n===== Date Conversion Test =====")
    
    # Current timestamp
    ts = time.time()
    print(f"Current timestamp (seconds since epoch): {ts}")
    
    # Convert to different formats
    dt = datetime.datetime.fromtimestamp(ts)
    print(f"Local time from timestamp: {dt}")
    
    dt_utc = datetime.datetime.utcfromtimestamp(ts)
    print(f"UTC time from timestamp: {dt_utc}")
    
    # Format as ISO
    iso_format = dt.isoformat()
    print(f"ISO format: {iso_format}")
    
    # Convert to elasticsearch compatible format
    es_format = dt.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
    print(f"Elasticsearch compatible format: {es_format}")

def suggest_fix_for_year_2025():
    """Suggest how to fix the year 2025 issue in logs"""
    print("\n===== Year 2025 Issue Fix =====")
    print("The system date on this computer appears to be set to 2025 instead of 2024.")
    print("This is why all logs in Elasticsearch have timestamps from 2025.")
    
    print("\nPossible fixes:")
    print("1. Correct the system date (requires admin privileges):")
    print("   On macOS/Linux: sudo date -u MMDDHHMMYYYY.SS")
    print("   For example, to set to May 15, 2024 13:45:00: sudo date -u 051513452024.00")
    
    print("\n2. For testing, you can modify the date in your Python code:")
    print("   Instead of using datetime.now(), override it to use the current year:")
    
    print("\n   Example fix in logger.py:")
    print("   ```python")
    print("   def get_corrected_timestamp():")
    print("       now = datetime.now()")
    print("       # Fix year to 2024 if it's incorrectly set to 2025")
    print("       if now.year == 2025:")
    print("           now = now.replace(year=2024)")
    print("       return now.isoformat()")
    print("   ```")
    
    print("\n   Then use get_corrected_timestamp() instead of datetime.now().isoformat()")
    
    print("\nNote about Elasticsearch:")
    print("- This won't affect existing logs that have already been stored with 2025 dates")
    print("- To search for both old and new logs, use date ranges that include both years")
    print("- For Kibana, make sure your time filter includes both 2024 and 2025")

if __name__ == "__main__":
    get_system_info()
    date_converter()
    suggest_fix_for_year_2025() 