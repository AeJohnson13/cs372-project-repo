const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 6543;
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

app.use(express.json());
app.use(cors());

// Serve the webpage
app.get("/", (req, res) => {
    fs.readFile(path.join(__dirname, "myDemoWebpage.html"), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end("Error loading page");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

// Ensure MongoDB connection is established once and reused
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process if connection fails
    }
}
connectDB();

// API Route: Add User
app.post("/add-user", async (req, res) => {
    try {
        const mydatabase = client.db("myDemoDb");
        const mycollection = mydatabase.collection("myDemoCollection");

        const { userName } = req.body;
        if (!userName) {
            return res.status(400).json({ error: "Username is required" });
        }

        const doc = { userName };
        const result = await mycollection.insertOne(doc);

        res.json({ message: "User added", id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Route: Get Users
app.get("/get-users", async (req, res) => {
    try {
        const mydatabase = client.db("myDemoDb");
        const mycollection = mydatabase.collection("myDemoCollection");

        const users = await mycollection.find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Express Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
