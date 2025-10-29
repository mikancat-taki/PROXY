// backend/proxy.js
try {
parsed = new url.URL(target);
} catch (e) {
return res.status(400).send('invalid url');
}


// ブロックリスト
if (BLOCKED_HOSTS.includes(parsed.hostname)) {
return res.status(403).send('host blocked');
}


try {
const response = await fetch(target, {
headers: {
// 必要なら常にブラウザユーザエージェントを付ける
'User-Agent': req.get('User-Agent') || 'Mozilla/5.0 (compatible)'
},
redirect: 'follow'
});


const contentType = response.headers.get('content-type') || '';


if (contentType.includes('text/html')) {
let text = await response.text();


// リンクを書き換えて、スクリプトを除去して安全に
let rewritten = rewriteLinks(text, target);


// sanitize-html で危険属性を除去
const clean = sanitizeHtml(rewritten, {
allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'h1', 'h2' ]),
allowedAttributes: {
a: [ 'href', 'name', 'target' ],
img: [ 'src', 'alt' ],
'*': [ 'class', 'id', 'title', 'alt' ]
}
});


// 追加のヘッダ安全策
res.set('X-Frame-Options', 'SAMEORIGIN');
res.set('Referrer-Policy', 'no-referrer');


res.send(clean);
} else {
// バイナリ（画像やcss等）
const buffer = await response.arrayBuffer();
const buf = Buffer.from(buffer);
if (contentType) res.type(contentType.split(';')[0]);
res.send(buf);
}


} catch (err) {
console.error('proxy error', err);
res.status(500).send('proxy error');
}
});


module.exports = router;
