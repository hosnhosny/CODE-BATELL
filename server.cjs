const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Mistral } = require("@mistralai/mistralai");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("OK"));

function getKey() {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new Error("Missing MISTRAL_API_KEY in .env");
  return key;
}

app.post("/api/ai/respond", async (req, res) => {
  try {
    const { question, contextCode } = req.body || {};
    if (!question) return res.status(400).json({ error: "Missing question" });

    const prompt = contextCode
      ? `السياق: كود C++:\n${contextCode}\n\nالسؤال: ${question}`
      : question;

    const client = new Mistral({ apiKey: getKey() });

    const chatResponse = await client.chat.complete({
      model: "mistral-medium-latest",
      messages: [{ role: "user", content: prompt }],
    });

    const text = chatResponse?.choices?.[0]?.message?.content || "";
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

app.listen(8787, () => console.log("AI proxy running on http://127.0.0.1:8787"));
