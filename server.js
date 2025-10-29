// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 現在のディレクトリを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSONとURLエンコードを有効化
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルを提供（例: publicフォルダ）
app.use(express.static(path.join(__dirname, "public")));

// 🔐 ダミー暗号化API（encrypt.jsがない場合の代替）
app.post("/api/encrypt", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text が必要です" });

  // Base64で疑似暗号化
  const encoded = Buffer.from(text, "utf-8").toString("base64");
  res.json({ encrypted: encoded });
});

// ✅ 動作確認用ルート
app.get("/api/hello", (req, res) => {
  res.json({ message: "✅ Server is running successfully on Render!" });
});

// ルート（トップページ）
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
