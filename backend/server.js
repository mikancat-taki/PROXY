import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { encryptURL, decryptURL } from './encrypt.js';
import proxyHandler from './proxyHandler.js';


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.static(path.join(process.cwd(), '../frontend')));
app.use('/assets', express.static(path.join(process.cwd(), '../assets')));


app.get('/api/proxy', proxyHandler);


app.get('/', (req, res) => {
res.sendFile(path.join(process.cwd(), '../frontend/index.html'));
});


app.listen(PORT, () => console.log(`🌐 Proxy running on http://localhost:${PORT}`));
