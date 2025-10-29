async function go() {
const input = document.getElementById('urlInput').value;
const viewer = document.getElementById('viewer');


const url = input.startsWith('http') ? input : `https://www.google.com/search?q=${encodeURIComponent(input)}`;


const res = await fetch(`/api/proxy?url=${btoa(url)}`);
const html = await res.text();
const blob = new Blob([html], { type: 'text/html' });
viewer.src = URL.createObjectURL(blob);
}


document.getElementById('goBtn').addEventListener('click', go);
