// serverHost.js
// Alex Johnson, Enica King, Ryland Sacker
// serverside code for cs372 Project


const express = require('express');
const session = require('express-session');
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const crypto = require('node:crypto');


const app = express();
const port = 6543;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = 'SC-Project';
const dbVideoName = 'Video Library';
const dbUsersName = 'User Credentials';
const roles = {"viewer":1,"markman":0,"contman":0,"admin":0};


app.use(express.json());
app.use(express.static(__dirname, { // host the whole directory
}))

// Define a route
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/HTML/loginPage.html');
});

// Define a route for the movies
app.get('/videos', async (req, res) => {
	try {
	  	const videos = await videosCollection.find().sort({ title: 1 }).toArray(); // Alphabetical
	  	res.json(videos);
	} catch (err) {
		console.error('Error in /videos:', err);
	  	res.status(500).send('Error fetching videos');
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


let db, usersCollection, videosCollection;


// connectDatabase()
//      Will wait until connection to database is verified, 
//      prints error message if connections fails
async function connectDatabase() {
	try {
		await client.connect();
		db = client.db(dbName);
		usersCollection = db.collection(dbUsersName);
		videosCollection = db.collection(dbVideoName);
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
        const { username } = req.body;
		const password  = req.body.password; 

		if (!username) {
			return res.status(400).json({ error: "Username is required" }); }
		if (!password) {
			return res.status(400).json({ error: "Password is required" }); }	
		const passwordHash = await hashPassword(password);

		const user = await usersCollection.findOne({ username: username });
		if(!user){
			res.json({ message: "Login Failed: Username not found"}); }
		else {
			if (user.passwordHash === passwordHash) {
				usersCollection.updateOne({ username: username }, { $set: { fail: 0 } });
				req.session.username = username;
        		return res.json({ message: "Login Successful"}); }
			else {
				usersCollection.updateOne({ username: username }, { $inc: { fail: 1 } });
				const failCheck = await usersCollection.findOne({ username: username });
				if (failCheck.fail >= 2) {
					await usersCollection.deleteOne({ username: username });
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
		const { username } = req.body;
		const password  = req.body.password; 

        if (!username) {
			return res.status(400).json({ error: "Username is required" });
        }
		if (!password) {
			return res.status(400).json({ error: "Password is required" });
		} 
		
		const passwordHash = await hashPassword(password);
		const userDoc = {username, "passwordHash":passwordHash, fail: 0, roles};

        const result = await usersCollection.insertOne(userDoc);
		if(usersCollection)
        res.json({ message: "User added", id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/addVideo", async( req, res) =>
{
	try{
		const title = req.body.videoTitle;
		const url = req.body.urlValue;

		if (!title) {
			return res.status(400).json({ error:"Title is required" });
        }
		if (!url) {
			return res.status(400).json({ error: "Url is required" });
		} 

		const videoDoc = {title, url};
		const result = await videosCollection.insertOne(videoDoc);
		
		if(videosCollection){
       		res.json({ message: "Video added", id: result.insertedId });
		}
   	} catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// GET: get a video's comment
app.get('/getComment', async (req, res) => {
	const { videoId } = req.query;
	if (!videoId) return res.status(400).send('Missing videoId');

	try {
		const video = await videosCollection.findOne({ _id: new ObjectId(videoId) });
		if (!video) return res.status(404).send('Video not found');
		res.json({ comment: video.comment || '' });
	} catch (err) {
		console.error("Error getting comment:", err);
		res.status(500).send("Error fetching comment");
	}
});


// POST: add/update a video's comment
app.post('/postComment', async (req, res) => {
	const { videoId } = req.query;
	const { comment } = req.body;
	if (!videoId || typeof comment !== 'string') return res.status(400).send('Invalid request');

	try {
		await videosCollection.updateOne(
			{ _id: new ObjectId(videoId) },
			{ $set: { comment } }
		);
		res.json({ message: "Comment updated", comment });
	} catch (err) {
		console.error("Error posting comment:", err);
		res.status(500).send("Error saving comment");
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
			const videos = await videosCollection.find({"title":{$regex:search}}).toArray();
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
});


// API Route: videoPreference
//		adds or updates User Credentials with a user preference for a video
app.post("/videoPreference", async (req, res) => {
	const { username, videoId, preference, action } = req.body;
	if (!username || !videoId || !['like', 'dislike'].includes(preference)) {
	  	return res.status(400).send('Invalid request');
	}
	try {
		let update;
		if (action === 'remove') {
			update = { $pull: { [preference + 's']: videoId } }; // pull from likes/dislikes
		} else {
			// Add to one and remove from the other
			const other = preference === 'like' ? 'dislikes' : 'likes';
			update = {
			$addToSet: { [preference + 's']: videoId },
			$pull: { [other]: videoId }
			};
		}
	
		await usersCollection.updateOne(
			{ username },
			update,
			{ upsert: true }
		);
	
		res.status(200).send('Preference saved');
	} catch (err) {
		console.error('DB error:', err);
		res.status(500).send('Error saving preference');
	}
  });


// API route: getLikedVideos
//		filters the liked videos (favourites) for a certain user
app.post("/getLikedVideos", async (req, res) => {
const { username } = req.body;
try {
	const user = await usersCollection.findOne({ username });
	if (!user) return res.status(404).send("User not found");

	const likedVideos = user.likes || [];
	res.json(likedVideos);
} catch (err) {
	console.error("Error fetching liked videos:", err);
	res.status(500).send("Server error");
}
});
  

// API route: getVideoPreference 
// 		fetch a user's preference for a specific video
app.get("/getVideoPreference", async (req, res) => {
	const { username, videoId } = req.query;
	if (!username || !videoId) {
		return res.status(400).send("Missing username or videoId");
	}

	try {
		const user = await usersCollection.findOne({ username });

		if (!user) {
			return res.status(404).send("User not found");
		}

		let preference = null;
		if (user.likes?.includes(videoId)) preference = "like";
		if (user.dislikes?.includes(videoId)) preference = "dislike";

		res.status(200).json({ preference });
	} catch (err) {
		console.error("Error fetching preference:", err);
		res.status(500).send("Server error");
	}
});


app.get("/getUserList", async (req, res) => {
	try {
		const userList = await usersCollection.find().toArray();
		res.json(userList);
	} catch (err) {
		console.error("Error fetching user list:", err);
		res.status(500).send("Server error");
	}
});


// API route: getRoles
// 		fetch a user's role/s 
app.post("/getRoles", async (req, res) => {
	const { username } = req.body;
	try {
		const user = await usersCollection.findOne({ username });
		if (!user) {
			return res.status(403).json({ error: "Forbidden. You do not have access. Go log in <a href='http://localhost:6543/'>here</a>." });
		}

		const userRoles = user.roles || {};
		res.json(userRoles);
	} catch (err) {
		console.error("Error fetching user roles:", err);
		res.status(500).send("Server error");
	}
});



app.post("/getAnalytics", async (req, res) => {
	try{
		const videoId = req.body.videoId
		const likeCount = await usersCollection.count({likes: videoId});
		const dislikeCount = await usersCollection.count({dislikes:videoId});
		const analytics = {likes: likeCount, dislikes: dislikeCount};
		console.log(analytics);
		res.json(analytics);
	} catch (err) {
		console.error("failed to get analytics:", err);
	}
});

app.post("/removeVideo", async (req, res) => {
	try{
		const videoId = req.body.id;
		await videosCollection.deleteOne({ _id: new ObjectId(videoId) });
		return res.status(200).json({ message: "Video deleted." });
	}
	catch(err)
	{
		console.error("error: failed to delete video", err);
	}
});