import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { handleProxy } from "./proxy.js";
import { handleSearch } from "./search.js";
import rateLimit from "express-rate-limit";
import { exec } from "child_process";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rate limiter for proxy
const limiter = rateLimit({ windowMs: 1000, max: 5 });
app.use("/api/proxy", limiter);

// Google検索API
app.get("/api/search", handleSearch);

// Proxy処理（HTML書き換え）
app.get("/api/proxy", async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) return res.status(400).json({ error: "URLが必要です" });

  try {
    // JavaモジュールでHTMLを書き換え
    exec(
      `java -cp java HtmlProcessor "${targetUrl}"`,
      (error, stdout, stderr) => {
        if (error) return res.status(500).send(stderr || error.message);
        res.setHeader("Content-Type", "text/html");
        res.send(stdout);
      }
    );
  } catch (err: any) {
    res.status(500).json({ error: "アクセス失敗", details: err.message });
  }
});

// セキュリティヘッダ
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src * data:;"
  );
  next();
});

// フロント
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
