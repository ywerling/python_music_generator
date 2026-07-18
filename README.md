# Sound Foundry

A Flask web application for generating music and sound in the browser. The first
generator provides continuous white noise with adjustable volume.

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
flask --app app run --debug
```

Open `http://127.0.0.1:5000`.
