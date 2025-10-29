import { decryptURL } from './encrypt.js';


export default async function proxyHandler(req, res) {
try {
const targetEnc = req.query.url;
if (!targetEnc) return res.status(400).json({ error: 'URL required' });


const target = decryptURL(targetEnc);
const response = await fetch(target);
const data = await response.text();


res.setHeader('Content-Type', 'text/html; charset=utf-8');
res.send(data);
} catch (err) {
res.status(500).json({ error: 'Proxy error', details: err.message });
}
}
