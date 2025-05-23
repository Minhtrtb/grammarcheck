import express from "express";
import cors from "cors";
import { OpenAI } from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/check", async (req, res) => {
  const { text } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a grammar corrector." },
        { role: "user", content: `Correct this: "${text}"` },
      ],
      model: "gpt-3.5-turbo",
    });

    const corrected = completion.choices[0].message.content;
    res.json({ corrected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
