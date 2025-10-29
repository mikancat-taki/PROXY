import fetch from "node-fetch";
import { Request, Response } from "express";

export async function handleProxy(req: Request, res: Response) {
  const targetUrl = req.query.url as string;
  if (!targetUrl) return res.status(400).json({ error: "URLが必要です" });

  try {
    const response = await fetch(targetUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    let text = await response.text();

    // HTML内のリンク・画像・CSSをプロキシ経由に書き換え
    text = text.replace(/(href|src)="(.*?)"/g, (_, attr, val) => {
      try {
        const absolute = new URL(val, targetUrl).href;
        return `${attr}="/api/proxy?url=${encodeURIComponent(absolute)}"`;
      } catch {
        return `${attr}="${val}"`;
      }
    });

    res.setHeader("Content-Type", "text/html");
    res.send(text);
  } catch (err: any) {
    res.status(500).json({ error: "アクセス失敗", details: err.message });
  }
}
