// backend/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const proxyRouter = require('./proxy');
const searchRouter = require('./search');


const app = express();
const PORT = process.env.PORT || 3000;


// セキュリティヘッダ
app.use(helmet({
crossOriginResourcePolicy: false
}));


// Rate limit
const limiter = rateLimit({
windowMs: 60 * 1000, // 1 minute
max: 60 // limit each IP to 60 requests per windowMs
});
app.use(limiter);


// 静的ファイル
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));


// JSON body
app.use(express.json({ limit: '200kb' }));


// ルート: フロントの index を配信
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});


// API ルータ
app.use('/api/search', searchRouter);
app.use('/proxy', proxyRouter);


// 簡単なヘルスチェック
app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
