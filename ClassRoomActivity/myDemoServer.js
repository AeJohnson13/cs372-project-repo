const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    fs.readFile(path.join(__dirname, 'myDemoWebpage.html'), (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

server.listen(6543, () => {
    console.log('Server running at http://localhost:6543');
});
