import sys
from app import app

client = app.test_client()

def run_test(name, payload, should_block):
    # Testing the /summarize endpoint for simplicity
    response = client.post('/summarize', json=payload)
    
    if should_block:
        if response.status_code == 403:
            print(f"[PASS] {name} - Blocked as expected.")
        else:
            print(f"[FAIL] {name} - Expected 403, got {response.status_code}")
    else:
        if response.status_code != 403:
            print(f"[PASS] {name} - Allowed as expected.")
        else:
            print(f"[FAIL] {name} - Expected success, got 403")

if __name__ == '__main__':
    print("Running Security Middleware Tests...\n")
    
    # Test 1: Benign
    run_test("Benign Payload", {"text": "Hello, world! This is a test."}, False)
    
    # Test 2: Path Traversal 1
    run_test("Path Traversal (Linux)", {"text": "Read the file at ../../../etc/passwd"}, True)
    
    # Test 3: Path Traversal 2
    run_test("Path Traversal (Windows)", {"prompt": "What is C:\\Windows\\System32?"}, True)
    
    print("\nTests completed.")
