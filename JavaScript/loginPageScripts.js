// scriptsLoginPage.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for loginPage.html



// checkPassword
//		takes a string as an input, 
//		returns false if string doesn't fulfil the following
//			exactly 8 characters
//			contains at least 1 character that isn't a letter or number
//			contains at least 1 number
//			contains at least 1 lower case letter
//			contains at least 1 upper case number
//				will alert the user of which criteria isn't fulfilled
//		else returns true
//		
function checkPassword(inputString){
	const numberOrCharRegEx = /[a-zA-Z0-9]+/
	const numberRegEx = /[0-9]+/
	const lowerCharacterRegEx = /[a-z]+/
	const upperCharacterRegEx = /[A-Z]+/
  	if(inputString.length != 8){
		alert("password must be 8 characters");
  		return false;
  	}
	else if(inputString == numberOrCharRegEx.exec(inputString)){
		alert("password must contain a special character");
		return false;
	}
	else if(numberRegEx.exec(inputString) == null){
		alert("password must contain a number");
		return false;
	}
	else if(lowerCharacterRegEx.exec(inputString) == null){
		alert("password must contain a lower case letter");
		return false;
	}
	else if(upperCharacterRegEx.exec(inputString) == null){
		alert("password must contain an upper case letter");
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


// verifyPassword()
//		takes two strings
//		returns false if they aren't the same
//		else returns true
function verifyPassword(inputString1, inputString2)
{
	if(inputString1 != inputString2){
		alert("passwords must be the same");
		return false;
	}
	else{
		console.log("test");
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
		const response = await fetch("/verifyUser", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();
		if(data.message == "Login Successful")
		{
			window.location.href = "/HTML/galleryPage.html";
		}

    	alert(data.message || data.error);
}

// submitData() 
//		reads username and password from input object
//		sends credentials to server, and adds them to database collection
async function submitData(){
	const username = document.getElementById("usernameInput").value;
	const password = document.getElementById("passwordInput").value;
	const password2 = document.getElementById("passwordVerification").value;
	if(checkPassword(password) && checkUsername(username) && verifyPassword(password, password2) ){
		const response = await fetch("/addUser", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();
  		alert(data.message || data.error);
	}
} 


