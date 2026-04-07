const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_KEY =
  "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";

app.post("/ai", async (req, res) => {
  try {
    const { system, messages } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "HTTP-Referer": "http://localhost:5500",
          "X-Title": "TechForge",
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            { role: "system", content: system },
            { role: "user", content: messages[0].content },
          ],
        }),
      },
    );

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    const text = data.choices?.[0]?.message?.content;
    if (!text)
      return res.status(500).json({ error: "No response", details: data });

    res.json({ content: [{ type: "text", text }] });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () =>
  console.log("✅ Proxy running on http://localhost:3001"),
);
