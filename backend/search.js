import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google検索APIエンドポイント
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  if (!query) return res.status(400).json({ error: "クエリが指定されていません。" });
  if (!apiKey || !cx) return res.status(500).json({ error: "APIキーまたはCXが設定されていません。" });

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "検索エラー", details: err.message });
  }
});

// Proxy機能（URLアクセス用）
app.get("/api/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "URLが指定されていません。" });

  try {
    const response = await fetch(targetUrl);
    const text = await response.text();

    res.setHeader("Content-Type", response.headers.get("content-type") || "text/html");
    res.send(text);
  } catch (err) {
    res.status(500).json({ error: "アクセスに失敗しました。", details: err.message });
  }
});

// フロントエンド配信
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 サーバー稼働中: ポート ${PORT}`);
});
