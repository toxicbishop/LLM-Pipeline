# LLM Pipeline - Flask API Dashboard

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

A premium, glassmorphic Flask application with high-end aesthetics and interactive data monitoring.

## Features
- **Dynamic Endpoints**: Seamlessly handles `/post`, `/comment`, and `/album`.
- **Glassmorphic UI**: Beautiful, interactive dashboard using modern CSS.
- **RESTful Architecture**: Clean JSON responses for all API calls.

## Quick Start

### 1. Set Up Virtual Environment

To isolate the dependencies, create and activate a virtual environment:

#### Windows (PowerShell)
If you encounter script execution restrictions, set the Execution Policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```
Then create and activate the environment:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

#### Windows (CMD)
```cmd
python -m venv .venv
.\.venv\Scripts\activate.bat
```

#### macOS / Linux
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install & Upgrade Dependencies

With the virtual environment active, upgrade `pip` and install the package requirements:
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Run the Application

```bash
python app.py
```

### 4. Access the Dashboard
Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your web browser.

## API Specification

| Endpoint | Method | Description |
|---|---|---|
| `/post` | `GET` | Fetches a list of premium articles and posts. |
| `/comment` | `GET` | Retrieves user discussions and feedback data. |
| `/album` | `GET` | Returns high-quality media album metadata. |

---
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
