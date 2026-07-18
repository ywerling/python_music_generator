from flask import Flask, render_template


app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/white-noise")
def white_noise():
    return render_template("white_noise.html")


if __name__ == "__main__":
    app.run(debug=True)
