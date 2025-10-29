import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { handleProxy } from "./proxy.js";
import { handleSearch } from "./search.js";

const app = express();
app.use(cors());
app.use(express.static("public"));

// Rate limiter for proxy
const limiter = rateLimit({ windowMs: 1000, max: 5 });
app.use("/api/proxy", limiter);

// APIなし検索
app.get("/api/search", handleSearch);

// 強化プロキシ
app.get("/api/proxy", handleProxy);

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
