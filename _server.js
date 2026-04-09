const http = require('http');
const fs = require('fs');
const path = require('path');

const s = http.createServer((req, res) => {
    let f = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const fp = path.join(__dirname, decodeURIComponent(f));
    
    if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) {
        res.writeHead(404);
        res.end('Not found: ' + f);
        return;
    }
    
    const ext = path.extname(fp);
    const ct = {
        '.html': 'text/html;charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };
    res.writeHead(200, {
        'Content-Type': ct[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    fs.createReadStream(fp).pipe(res);
});

s.listen(3456, () => console.log('Server running at http://localhost:3456'));
