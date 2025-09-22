const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Default to index.html
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  // Get file extension
  const ext = path.extname(filePath);
  let contentType = 'text/html';
  
  switch (ext) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});