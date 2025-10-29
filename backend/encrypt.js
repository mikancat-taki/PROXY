import crypto from 'crypto';


const ALGO = 'aes-256-cbc';
const KEY = crypto.scryptSync(process.env.SECRET_KEY, 'salt', 32);
const IV = Buffer.alloc(16, 0);


export function encryptURL(url) {
const cipher = crypto.createCipheriv(ALGO, KEY, IV);
return Buffer.concat([cipher.update(url, 'utf8'), cipher.final()]).toString('base64');
}


export function decryptURL(enc) {
const decipher = crypto.createDecipheriv(ALGO, KEY, IV);
return Buffer.concat([decipher.update(Buffer.from(enc, 'base64')), decipher.final()]).toString('utf8');
}
