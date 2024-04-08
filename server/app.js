const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const request = require("request");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/auth/login", (req, res) => {
  const scope = "streaming user-read-email user-read-private user-top-read";
  const state = generateRandomString(16);

  const authQueryParameters = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state,
  });
  res.redirect(`https://accounts.spotify.com/authorize/?${authQueryParameters.toString()}`);
});

app.get("/auth/callback", (req, res) => {
  const { code } = req.query;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.cookie("accessToken", body.access_token, { httpOnly: true });
      res.redirect(process.env.CLIENT_URL);
    }
  });
});

app.get("/auth/token", extractToken, (req, res) => {
  res.json({ accessToken: req.accessToken });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "client", "build")));
  app.get(["/", "/browse", "/inspiration", "/moodify"], (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
  });

  const https = require("https");
  setInterval(() => {
    https.get("https://moodify-adp.onrender.com");
  }, 300000); // every 5 minutes (300000)
}

// Helper Spotify login function
function generateRandomString(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Helper token function
function extractToken(req, res, next) {
  let accessToken;
  if (req.headers.cookie) {
    req.headers.cookie.split(" ").some((cookie) => {
      const equalPosition = cookie.indexOf("=");
      if (cookie.substring(0, equalPosition) === "accessToken") {
        const semiColonPosition = cookie.indexOf(";");
        if (semiColonPosition > -1) {
          accessToken = cookie.substring(equalPosition + 1, cookie.length - 1);
        } else {
          accessToken = cookie.substring(equalPosition + 1);
        }
        return true;
      }
      return false;
    });

    if (accessToken) {
      req.accessToken = accessToken;
      return next();
    }
    return next({
      status: 401,
      message: "Token expired/not found. Need login",
    });
  }
  return next({
    status: 401,
    message: "Token expired/not found. Need login",
  });
}

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
