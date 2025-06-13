import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors()); // Allow all origins (adjust in production)

// Proxy route
app.get("/api/quotes", async (req, res) => {
  try {
    const response = await fetch("https://zenquotes.io/api/quotes/");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching from ZenQuotes:", error);
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
});
