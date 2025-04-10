// serverHost.js
// Alex Johnson, Enica King, Ryland Sacker
// serverside code for cs372 Project


const express = require('express');
const session = require('express-session');
const { MongoClient } = require("mongodb");
const crypto = require('node:crypto');


const app = express();
const port = 6543;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = 'SC-Project';

app.use(express.json());
app.use(express.static(__dirname, { // host the whole directory
}))

// Define a route
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/loginPage.html');
});

// Define a route for the movies
app.get('/videos', async (req, res) => {
	try {
	  await client.connect();
	  const db = client.db(dbName);
	  const videos = await db.collection('Video Library').find().sort({ title: 1 }).toArray(); // Alphabetical
	  res.json(videos);
	} catch (err) {
	  console.error(err);
	  res.status(500).send('Error fetching videos');
	} finally {
	  await client.close();
	}
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use(session({
	secret: 'your-secret-key', // this is not a secure key
	resave: false,
	saveUninitialized: false,
	cookie: {
	  maxAge: 3600000 * 24 // Session duration in milliseconds 24 hours
	}
  }));




// connectDatabase()
//      Will wait until connection to database is verified, 
//      prints error message if connections fails
async function connectDatabase() {
    try {
        await client.connect();
		dbInstance = client.db('dbName');
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
        const projectDB = client.db(dbName);
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
				req.session.username = username;
        		return res.json({ message: "Login Successful"}); }
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
        const projectDB = client.db(dbName);
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
		const userDoc = {username, "passwordHash":passwordHash, fail: 0,"role":"Viewer"};


        const result = await userClct.insertOne(userDoc);
		if(userClct)
        res.json({ message: "User added", id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// API Route: getUsername
//		sends a string back to the client that contains 
// 		the session username
app.get("/getUsername", (req,res) => {
		sessionUsername = req.session.username;
		res.send(sessionUsername);
});


app.post('/search', async (req, res) => {
	try {
		const search = req.body.query;
		if(search.trim().length !== 0){
	  		await client.connect();
	 		const projectDB = client.db(dbName);
				const videos = await projectDB.collection('Video Library').find({"title":{$regex:search}}).toArray();
			res.json(videos);
		}
		else{
			res.json({})
			}
	} 
	catch (err) {
		console.error(err);
		res.status(500).send('Error fetching videos');
	} 
	finally {
		await client.close();
	}
});


// API Route: videoPreference
//		adds or updates User Credentials with a user preference for a video
app.post("/videoPreference", async (req, res) => {
	const { username, videoId, preference } = req.body;
	if (!username || !videoId || !['like', 'dislike'].includes(preference)) {
	  	return res.status(400).send('Invalid request');
	}
	try {
		await client.connect();
		const projectDB = client.db(dbName);
		const userClct = projectDB.collection("User Credentials");

		const update = {
			$addToSet: {}, // Adds videoID
			$pull: {}      // Removes videoId from other list
		};
		if (preference === 'like') {
			update.$addToSet.likes = videoId;
			update.$pull.dislikes = videoId;
		} else if (preference === 'dislike') {
			update.$addToSet.dislikes = videoId;
			update.$pull.likes = videoId;
		}

		const result = await userClct.updateOne(
			{ username: username },
			update,
			{ upsert: true }
		);
		res.status(200).send('Preference saved');
	} catch (err) {
		console.error('DB error:', err);
		res.status(500).send('Error saving preference');
	}
  });


  // getLikedVideos
  //	filters the liked videos for a certain user
  app.get("/getLikedVideos", async (req, res) => {
	const username = req.body;
	try {
	  await client.connect();
	  const db = client.db(dbName);
	  const users = db.collection("User Credentials");
  
	  const user = await users.findOne({ username });
	  if (!user) return res.status(404).send("User not found");
  
	  const likedVideos = user.likes || [];
	  res.json(likedVideos);
	} catch (err) {
	  console.error("Error fetching liked videos:", err);
	  res.status(500).send("Server error");
	}
  });
  