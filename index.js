import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { OpenAI } from "openai";

config(); // Đọc file .env

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Khởi tạo OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Trang chủ để kiểm tra
app.get("/", (req, res) => {
  res.send("✅ API Grammar Checker đang chạy!");
});

// API chỉnh sửa ngữ pháp
app.post("/api/check", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Thiếu nội dung văn bản." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a grammar correction assistant. Only return the corrected sentence, no explanation.",
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0,
    });

    const corrected = completion.choices[0].message.content.trim();

    res.json({ corrected });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Lỗi khi gọi OpenAI API." });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server đang chạy tại http://0.0.0.0:${port}`);
  console.log('🌐 API URL:', 'https://grammar.baominh299.repl.dev');
});
