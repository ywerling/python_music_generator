from flask import Flask, render_template


app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/white-noise")
def white_noise():
    return render_template("white_noise.html")


@app.get("/brown-noise")
def brown_noise():
    return render_template("brown_noise.html")


@app.get("/meditation-bowls")
def meditation_bowls():
    return render_template("meditation_bowls.html")


@app.get("/night-rain")
def night_rain():
    return render_template("night_rain.html")


if __name__ == "__main__":
    app.run(debug=True)
