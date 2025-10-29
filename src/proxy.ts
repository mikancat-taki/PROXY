import fetch from "node-fetch";

export async function handleProxy(req, res) {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: "URLが必要です" });

  try {
    const response = await fetch(targetUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    let text = await response.text();

    // 最低限の書き換え（必要ならJavaでさらに強化）
    text = text.replace(/(href|src)="(\/[^"]*)"/g,
      (m, p1, p2) => `${p1}="/api/proxy?url=${encodeURIComponent(new URL(p2, targetUrl).href)}"`
    );

    res.setHeader("Content-Type", "text/html");
    res.send(text);
  } catch (err) {
    res.status(500).json({ error: "アクセス失敗", details: err.message });
  }
}
