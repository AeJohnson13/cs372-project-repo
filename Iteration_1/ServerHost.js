// Import Express
const express = require('express');
const { MongoClient } = require("mongodb");
const crypto = require('node:crypto');


const app = express();
const port = 6543;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(express.json());
app.use(express.static(__dirname, { // host the whole directory
}))

// Define a route
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/LoginWebpage.html')
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



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

async function sha256Hash(password){
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};



// API Route: Add User
app.post("/add-user", async (req, res) => {
    try {
        const mydatabase = client.db("SC-Project");
        const mycollection = mydatabase.collection("User Credentials");
		const { userName } = req.body;
		const passWord  = req.body.passWord; 

        if (!userName) {
            return res.status(400).json({ error: "Username is required" });
        }
		if (!passWord) {
			return res.status(400).json({ error: "Password is required" });
		} 
		
		
		const pwdHash = await sha256Hash(passWord);
		console.log(pwdHash);
        const doc = {userName, "pwdHash":pwdHash};
		
        const result = await mycollection.insertOne(doc);
		

        res.json({ message: "User added", id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});










/* // API Route: Get Users
app.get("/get-users", async (req, res) => {
    try {
        const mydatabase = client.db("SC-Project");
        const mycollection = mydatabase.collection("User Credentials");

        const users = await mycollection.find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

 */