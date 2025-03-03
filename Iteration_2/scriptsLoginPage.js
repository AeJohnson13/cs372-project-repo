// scriptsLoginPage.js
// Alex Johnson, Ryland Scaker, Enica King
// Scripts for loginPage.html


function checkPassword(inputString){
	const numberOrCharRegEx = /[a-zA-Z0-9]+/
	const numberRegEx = /[0-9]+/
	const characterRegEx = /[a-zA-z]+/
  	if(inputString.length != 8){
		alert("password must be 8 characters");
  		return false;
  	}
	else if(inputString == numberOrCharRegEx.exec(inputString)){
		alert("no special character");
		return false;
	}
	else if(numberRegEx.exec(inputString) == null){
		alert("no number");
		return false;
	}
	else if(characterRegEx.exec(inputString) == null){
		alert("no letter");
		return false;
	}
	else{
		return true;
	} 
} 

function checkUsername(inputString){
	const emailRegEx =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  	if(inputString != emailRegEx.exec(inputString)){
		alert("username must be valid email address");
		return false;

	}
	else{
		return true;
	} 
} 



// verifyData() 
// 		reads username and password from input objects
//		sends credentials to server, if login is successful sends user 
//		to the gallery page
async function verifyData() { 
	const username = document.getElementById("usernameInput").value;
	const password = document.getElementById("passwordInput").value;
	if(checkPassword(password) && checkUsername(username))
	{
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
}

// submitData() 
//		reads username and password from input object
//		sends credentials to server, and adds them to database collection
async function submitData() {
	const username = document.getElementById("usernameInput").value;
	const password = document.getElementById("passwordInput").value;
	
	if(checkPassword(password) && checkUsername(username)){
		alert("test");
		const response = await fetch("http://localhost:6543/addUser", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();
  		alert(data.message || data.error);
	}
} 


