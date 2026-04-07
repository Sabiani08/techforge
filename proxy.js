// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // if using Node <18, otherwise native fetch

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variable for security
const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

app.post("/ai", async (req, res) => {
  try {
    const { system, messages } = req.body;

    // Make request to OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          { role: "system", content: system },
          { role: "user", content: messages[0].content },
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: "No response", details: data });

    res.json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Dynamic port for Railway / production
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
