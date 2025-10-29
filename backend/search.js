// backend/search.js
// Google Custom Search API を叩く簡易ラッパー
const express = require('express');
const axios = require('axios');
const router = express.Router();


const API_KEY = process.env.GOOGLE_API_KEY;
const CSE_ID = process.env.GOOGLE_CSE_ID;


if (!API_KEY || !CSE_ID) {
console.warn('Google API key or CSE ID not set. Search API will not work until configured.');
}


router.get('/', async (req, res) => {
const q = req.query.q || '';
const start = req.query.start || 1;
try {
const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(q)}&start=${start}`;
const r = await axios.get(url);
res.json(r.data);
} catch (err) {
console.error(err && err.response ? err.response.data : err.message);
res.status(500).json({ error: 'search failed', detail: err.message });
}
});


module.exports = router;
