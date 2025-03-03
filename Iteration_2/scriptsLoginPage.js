// scriptsLoginPage.js
// Alex Johnson, Ryland Scaker, Enica King
// Scripts for loginPage.html



// checkUsername
//		takes a string as an input, 
//		returns false if string doesn't fulfil the following
//			exactly 8 characters
//			contains at least 1 character that isn't a letter or number
//			contains at least 1 number
//			contains at least 1 letter
//				will alert the user of which criteria isn't fulfilled
//		else returns true
//		
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


// checkUsername
// 		takes a string as an input, 
//		returns false if not given a valid email address, also alerts user
//		else returns true 
//		valid email address is defined as string + "@" + string + "." + string
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


