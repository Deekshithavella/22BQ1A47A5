const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const shortid = require("shortid");
const fetch = require("node-fetch"); // Required to use fetch in Node.js
const UrlModel = require("./models/Url");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/urlshortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Backend logger function
const Logger = async (stack, level, pkg, message) => {
  const url = "http://20.244.56.144/evaluation-service/logs";

  const payload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMmJxYTE0NzYyQHZ2aXQubmV0IiwiZXhwIjoxNzU0MDI4NTMyLCJpYXQiOjE3NTQwMjc2MzIsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIwMjlkMjNlZi00MDI4LTQ2YWUtYmY1NC1mNGYwYjc1ODNjZTIiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJoaW1hdmFudGggbXV0dGUiLCJzdWIiOiIxYWQ5MzQ5MC1jMmFkLTQwMTMtODEwMi05NTJiYjA4ZGU1MjgifSwiZW1haWwiOiIyMmJxYTE0NzYyQHZ2aXQubmV0IiwibmFtZSI6ImhpbWF2YW50aCBtdXR0ZSIsInJvbGxObyI6IjIyYnFhMWE0NzYyIiwiYWNjZXNzQ29kZSI6IlBuVkJGViIsImNsaWVudElEIjoiMWFkOTM0OTAtYzJhZC00MDEzLTgxMDItOTUyYmIwOGRlNTI4IiwiY2xpZW50U2VjcmV0IjoieEFEdlJGcG1KQWJ4UFl0TSJ9.Tr80FaNjONc-dcYNi5sJGNa8-y641jA3geKj6vd8SyY",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Log sent:", result);
  } catch (error) {
    console.error("Logging failed:", error.message);
  }
};

// POST route to shorten URL
app.post("/api/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !originalUrl.startsWith("http")) {
    await Logger("backend", "error", "handler", "Invalid URL received");
    return res.status(400).json({ message: "Invalid URL" });
  }

  try {
    // Check if the original URL is already stored
    const existing = await UrlModel.findOne({ originalUrl });
    if (existing) {
      await Logger("backend", "info", "handler", "URL already exists");
      return res.status(200).json({ shortUrl: existing.shortUrl });
    }

    const shortUrl = `http://sho.rt/${shortid.generate()}`;
    const newUrl = new UrlModel({ originalUrl, shortUrl });
    await newUrl.save();

    await Logger("backend", "info", "handler", "Short URL created successfully");
    return res.status(201).json({ shortUrl });
  } catch (error) {
    await Logger("backend", "error", "handler", `Database error: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET route for redirection
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const fullShortUrl = `http://sho.rt/${shortId}`;

  try {
    const found = await UrlModel.findOne({ shortUrl: fullShortUrl });
    if (found) {
      await Logger("backend", "info", "handler", "Redirection successful");
      return res.redirect(found.originalUrl);
    } else {
      await Logger("backend", "warn", "handler", "Short URL not found");
      return res.status(404).send("URL not found");
    }
  } catch (error) {
    await Logger("backend", "error", "handler", `Redirection failed: ${error.message}`);
    return res.status(500).send("Server error");
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
