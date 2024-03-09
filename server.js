const http = require("http");
const fs = require("fs");
const path = require("path");

const hostname = "127.0.0.1"; // localhost
const port = 3000; // You can use any available port number

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "index.html");

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Error loading HTML file: ${err}`);
      return;
    }

    // Serve the HTML content
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content, "utf-8");
  });
});

server.listen(port, hostname, () => console.log("port going brrr"));
