from flask import Flask, render_template


app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/white-noise")
def white_noise():
    return render_template("white_noise.html")


@app.get("/pink-noise")
def pink_noise():
    return render_template("pink_noise.html")

@app.get("/brown-noise")
def brown_noise():
    return render_template("brown_noise.html")

@app.get("/blue-noise")
def blue_noise():
    return render_template("blue_noise.html")

@app.get("/violet-noise")
def violet_noise():
    return render_template("violet_noise.html")

@app.get("/green-noise")
def green_noise():
    return render_template("green_noise.html")

@app.get("/grey-noise")
def grey_noise():
    return render_template("grey_noise.html")

@app.get("/black-noise")
def black_noise():
    return render_template("black_noise.html")

@app.get("/meditation-bowls")
def meditation_bowls():
    return render_template("meditation_bowls.html")

@app.get("/night-rain")
def night_rain():
    return render_template("night_rain.html")


if __name__ == "__main__":
    app.run(debug=True)
