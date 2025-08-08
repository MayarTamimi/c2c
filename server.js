import http, { IncomingMessage, ServerResponse } from "node:http";
const PORT = 3000;
const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Welcome to the server" }));
    }
    else if (req.method === "GET" && req.url === "/about") {
        res.writeHead(200);
        res.end(JSON.stringify({ message: "This is the about route" }));
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Route not found" }));
    }
});
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map