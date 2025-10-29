import fetch from "node-fetch";
import cheerio from "cheerio";
import { Request, Response } from "express";

export async function handleSearch(req: Request, res: Response) {
  const q = req.query.q as string;
  if (!q) return res.status(400).json({ error: "検索クエリが必要です" });

  try {
    const response = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(q)}`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const results: any[] = [];
    $(".b_algo").each((_, el) => {
      const title = $(el).find("h2").text();
      const link = $(el).find("h2 a").attr("href");
      const snippet = $(el).find(".b_caption p").text();
      if (title && link) results.push({ title, link, snippet });
    });

    res.json({ items: results });
  } catch (err: any) {
    res.status(500).json({ error: "検索失敗", details: err.message });
  }
}
