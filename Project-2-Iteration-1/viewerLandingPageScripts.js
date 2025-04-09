// viewerLandningPageScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for viewerLandingPage.html


async function displayData(){
    const response = await fetch("http://localhost:6543/getUsername");
    const username = await response.text();
    

    displayUsername = document.getElementById("userName");
    displayUsername.innerText = "Welcome user: " + username;

}

