import re
from flask import request, abort, jsonify

# Common Path Traversal patterns
PATH_TRAVERSAL_PATTERNS = [
    r"\.\./",
    r"\.\.\\",
    r"(?i)/etc/passwd",
    r"(?i)c:\\windows"
]

def compile_patterns(patterns):
    return [re.compile(p) for p in patterns]

compiled_path = compile_patterns(PATH_TRAVERSAL_PATTERNS)

def is_malicious(value: str) -> bool:
    """Check if the string contains malicious patterns."""
    if not isinstance(value, str):
        return False
            
    for pattern in compiled_path:
        if pattern.search(value):
            return True
            
    return False

def security_middleware():
    """
    Flask before_request hook to sanitize user inputs.
    By default, applies to the 'prompt' and 'text' fields in JSON bodies.
    """
    if request.is_json:
        data = request.get_json(silent=True)
        if data:
            # Check 'prompt' field
            if 'prompt' in data and is_malicious(data['prompt']):
                return jsonify({"error": "Forbidden: Malicious payload detected."}), 403
            
            # Check 'text' field
            if 'text' in data and is_malicious(data['text']):
                return jsonify({"error": "Forbidden: Malicious payload detected."}), 403
