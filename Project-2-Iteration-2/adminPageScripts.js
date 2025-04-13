// adminPageScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for adminPage.html



async function displayData() {
    const response = await fetch("/getUserList");
    const users = await response.json();



    usersList.innerHTML = ""; // Clear previous entries

    users.forEach(user => {
      
    });
}