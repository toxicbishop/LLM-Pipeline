import os
import time
import requests
from flask import Flask, jsonify, request, Response, stream_with_context
from flask_cors import CORS
from flask_caching import Cache
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Redis Cache
cache = Cache(config={
    'CACHE_TYPE': 'RedisCache',
    'CACHE_REDIS_HOST': os.getenv('REDIS_HOST', 'localhost'),
    'CACHE_REDIS_PORT': os.getenv('REDIS_PORT', 6379),
    'CACHE_REDIS_URL': os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
    'CACHE_DEFAULT_TIMEOUT': 300
})
cache.init_app(app)

# Initialize OpenAI Client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def fetch_from_placeholder(endpoint):
    url = f"https://jsonplaceholder.typicode.com/{endpoint}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.Timeout:
        return {"error": "upstream timeout"}, 504
    except requests.HTTPError as e:
        return {"error": str(e)}, 502
    except Exception:
        return {"error": "internal server error"}, 500


@app.route('/health')
def health():
    return jsonify({"status": "ok", "version": "1.0.0"})


@app.route('/posts')
@cache.cached(timeout=60)
def get_posts():
    data = fetch_from_placeholder("posts")
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    return jsonify({
        "data": data,
        "status": "success",
        "status_code": 200
    })


@app.route('/comments')
@cache.cached(timeout=60)
def get_comments():
    data = fetch_from_placeholder("comments")
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    return jsonify({
        "data": data,
        "status": "success",
        "status_code": 200
    })


@app.route('/albums')
@cache.cached(timeout=60)
def get_albums():
    data = fetch_from_placeholder("albums")
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    return jsonify({
        "data": data,
        "status": "success",
        "status_code": 200
    })


@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    if not data or 'prompt' not in data:
        return jsonify({"error": "prompt is required"}), 400

    prompt = data['prompt']

    if not os.getenv('OPENAI_API_KEY'):
        # Stub response if no API key is set
        def generate_stub():
            msg = f"Stub response for: '{prompt}'. Please set OPENAI_API_KEY for real responses."
            words = msg.split()
            for word in words:
                yield f"data: {word} \n\n"
                time.sleep(0.1)
            yield "data: [DONE]\n\n"
        return Response(stream_with_context(generate_stub()), mimetype='text/event-stream')

    try:
        def generate_stream():
            stream = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                stream=True,
            )
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield f"data: {chunk.choices[0].delta.content}\n\n"
            yield "data: [DONE]\n\n"

        return Response(stream_with_context(generate_stream()), mimetype='text/event-stream')
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "text is required"}), 400

    text = data['text']

    if not os.getenv('OPENAI_API_KEY'):
        return jsonify({"summary": f"Stub summary for: {text[:20]}..."})

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system",
                 "content": "You are a helpful assistant that summarizes text concisely."},
                {"role": "user", "content": f"Summarize the following text:\n\n{text}"}
            ]
        )
        return jsonify({"summary": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=5000, debug=debug_mode)
