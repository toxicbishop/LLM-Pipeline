# LLM Pipeline - Flask API Dashboard

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?logo=docker&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-%23412991.svg?logo=openai&logoColor=white)

A premium, glassmorphic Flask application integrating LLM capabilities (streaming and summarization) with high-end aesthetics and interactive data monitoring.

## Features
- **LLM Endpoints**: Talk to OpenAI with `/generate` (streaming) and `/summarize`.
- **Redis Caching**: Faster responses for data endpoints using `flask-caching`.
- **Dynamic Endpoints**: Seamlessly handles `/posts`, `/comments`, and `/albums`.
- **Glassmorphic UI**: Beautiful, interactive dashboard using modern CSS.
- **RESTful Architecture**: Clean JSON responses for all API calls with proper error handling.

## Quick Start

### 1. Environment Variables
Create a `.env` file in the root directory (you can use `.env.example` as a template):
```env
FLASK_DEBUG=false
OPENAI_API_KEY=sk-your-openai-api-key
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379/0
```

### 2. Run with Docker (Recommended)
You can spin up the web app and a Redis container with one command:
```bash
docker-compose up --build
```
Access the dashboard at [http://localhost:5000](http://localhost:5000)

### 3. Run Locally (Manual)

#### Set Up Virtual Environment
```bash
python -m venv .venv
# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate
```

#### Install Dependencies
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### Run Redis
Make sure you have a local Redis server running on port `6379`.

#### Run the Application
```bash
python app.py
```
Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your web browser.

## API Specification

| Endpoint | Method | Description |
|---|---|---|
| `/generate` | `POST` | Takes `{"prompt": "..."}` and streams back an LLM response. |
| `/summarize` | `POST` | Takes `{"text": "..."}` and returns a concise summary. |
| `/posts` | `GET` | Fetches a list of premium articles and posts (Cached). |
| `/comments` | `GET` | Retrieves user discussions and feedback data (Cached). |
| `/albums` | `GET` | Returns high-quality media album metadata (Cached). |
| `/health` | `GET` | API health check endpoint. |

---
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
