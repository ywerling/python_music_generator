import threading
import webview
from app import app  # importiert die bestehende Flask-App

def run_flask():
    # use_reloader=False ist wichtig, sonst startet Flask den Thread doppelt
    app.run(host="127.0.0.1", port=5000, debug=False, use_reloader=False)

if __name__ == "__main__":
    t = threading.Thread(target=run_flask, daemon=True)
    t.start()

    webview.create_window(
        "Sound Master",
        "http://127.0.0.1:5000",
        width=1100,
        height=750,
        min_size=(700, 500)
    )
    webview.start()