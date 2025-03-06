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


// connectDatabase()
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
        const projectDB = client.db("SC-Project");
	const userClct = projectDB.collection("User Credentials");
        const { username } = req.body;
	const password  = req.body.password; 

        if (!username) {
		return res.status(400).json({ error: "Username is required" }); }
	if (!password) {
		return res.status(400).json({ error: "Password is required" }); }
		
	const passwordHash = await hashPassword(password);

	const user = await userClct.findOne({ username: username });
	if(!user){
		res.json({ message: "Login Failed: Username not found"}); }
	else {
	if (user.passwordHash === passwordHash) {
		userClct.updateOne({ username: username }, { $set: { fail: 0 } });
        	return res.json({ message: "Login Successful" }); }
	else {
		userClct.updateOne({ username: username }, { $inc: { fail: 1 } });
		const failCheck = await userClct.findOne({ username: username });
		if (failCheck.fail >= 2) {
			await userClct.deleteOne({ username: username });
			return res.status(403).json({ message: "Account deleted." }); }
		return res.status(401).json({ message: "Invalid password" }); } }
	
	} catch (error) {
		res.status(500).json({ error: error.message }); }
});


// API Route: addUser
//      adds the  username and password given by a user to 
//      SC-Project > SC-Project > User Credentials
app.post("/addUser", async (req, res) => {
    try {
        const projectDB = client.db("SC-Project");
	const userClct = projectDB.collection("User Credentials");
	const { username } = req.body;
		const password  = req.body.password; 

        if (!username) {
		return res.status(400).json({ error: "Username is required" });
        }
		if (!password) {
			return res.status(400).json({ error: "Password is required" });
		} 
		
		
		const passwordHash = await hashPassword(password);
	const userDoc = {username, "passwordHash":passwordHash, fail: 0};


        const result = await userClct.insertOne(userDoc);
		if(userClct)
        res.json({ message: "User added", id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});