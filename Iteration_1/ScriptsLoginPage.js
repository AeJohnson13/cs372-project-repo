// scriptsLoginPage.js
// Alex Johnson, Ryland Scaker, Enica King
// Scripts for loginPage.html



// verifyData() 
// 		reads username and password from input objects
//		sends credentials to server, if login is successful sends user 
//		to the gallery page
async function verifyData() { 
	const username = document.getElementById("usernameInput").value;
	const password = document.getElementById("passwordInput").value;
	const response = await fetch("http://localhost:6543/verifyUser", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password })
	});

	
	const data = await response.json();
	if(data.message == "Login Successful")
	{
		window.location.href = "galleryPage.html";
	}

    alert(data.message || data.error);
}



// submitDat() 
//		reads username and password from input object
//		sends credentials to server, and adds them to database collection
async function submitData() {
	const username = document.getElementById("usernameInput").value;
	const password = document.getElementById("passwordInput").value;
	const response = await fetch("http://localhost:6543/addUser", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password })
	});

	const data = await response.json();
    alert(data.message || data.error);
}


