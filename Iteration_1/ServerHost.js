// serverHost.js
// Alex Johnson, Enica King, Ryland Scaker
// serverside code for cs372 Project




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
	res.sendFile(__dirname + '/loginPage.html')
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// connectDatabse()
//      Will wait until connection to database is verified, 
//      prints error message if connections fails
async function connectDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process if connection fails
    }
}
connectDatabase();



// hashPassword(password)
//      generates a SHA256 hash digest from a given password,
//      returns digest as a hexadecimal number
async function hashPassword(password){
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};



// API Route: verifyUser
//      checks to see if the username and password given by a user are 
//      present with SC-Project > SC-Project > User Credentials
app.post("/verifyUser", async (req, res) => {
    try {
        const projectDatabase = client.db("SC-Project");
        const userCollection = projectDatabase.collection("User Credentials");
        const { username } = req.body;
		const password  = req.body.password; 

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }
		if (!password) {
			return res.status(400).json({ error: "Password is required" });
		} 
		
		
		const passwordHash = await hashPassword(password);
        const userDocument = {username, "passwordHash":passwordHash};
		
        const result = await userCollection.findOne(userDocument);
        if(result){
            res.json({message: "Login Successful"});
        }
        else{
            res.json({ message: "Login Failed"});
        }
	
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// API Route: addUser
//      adds the  username and password given by a user to 
//      SC-Project > SC-Project > User Credentials
app.post("/addUser", async (req, res) => {
    try {
        const projectDatabase = client.db("SC-Project");
        const userCollection = projectDatabase.collection("User Credentials");
        const { username } = req.body;
		const password  = req.body.password; 

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }
		if (!password) {
			return res.status(400).json({ error: "Password is required" });
		} 
		
		
		const passwordHash = await hashPassword(password);
        const userDocument = {username, "passwordHash":passwordHash};


        const result = await userCollection.insertOne(userDocument);
		if(userCollection)
        res.json({ message: "User added", id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});








