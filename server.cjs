const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const dataFile = path.join(root, 'data.json');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

function readState() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch {
    return { teams: [], fixtures: [] };
  }
}

function writeState(state) {
  fs.writeFileSync(dataFile, JSON.stringify(state, null, 2), 'utf8');
}

const server = http.createServer((request, response) => {
  if (request.url === '/api/state') {
    if (request.method === 'GET') {
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify(readState()));
      return;
    }

    if (request.method === 'PUT') {
      let body = '';
      request.on('data', chunk => { body += chunk; });
      request.on('end', () => {
        try {
          const state = JSON.parse(body);
          writeState({ teams: state.teams || [], fixtures: state.fixtures || [] });
          response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          response.end(JSON.stringify(readState()));
        } catch {
          response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          response.end(JSON.stringify({ error: 'Invalid state data' }));
        }
      });
      return;
    }
  }

  const requestedPath = request.url === '/' ? '/index.html' : request.url;
  const filePath = path.resolve(root, `.${requestedPath}`);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(response);
});

const port = Number(process.env.PORT || 5501);
server.listen(port, '0.0.0.0', () => {
  console.log(`Apex League shared server running at http://127.0.0.1:${port}`);
});
