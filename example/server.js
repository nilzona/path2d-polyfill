const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

fs.copyFileSync('./dist/path2d-polyfill.js', './example/path2d-polyfill.js');

http.createServer((request, response) => {
  const pathName = url.parse(request.url).pathname;
  const requestPath = path.join(__dirname, pathName);
  console.log('requesting:', requestPath); // eslint-disable-line
  fs.readFile(requestPath, (err, data) => {
    if (err) {
      response.writeHead(404, { 'Content-type': 'text/plan' });
      response.write('Page Was Not Found');
      response.end();
    } else {
      response.writeHead(200, { 'Content-type': 'text/plan' });
      response.write(data);
      response.end();
    }
  });
}).listen(7000);

console.log('open example page at http://localhost:7000/index.html'); // eslint-disable-line
