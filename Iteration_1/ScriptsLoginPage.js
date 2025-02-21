// ScriptsLoginPage.js
// Alex Johnson, Ryland Scaker, Enica King
// Scripts for LoginWebpage.html

const crypto = require("crypto") 
        		async function submitData() {
            			const userName = document.getElementById("UserNameInput").value;

            			const response = await fetch("http://localhost:6543/add-user", {
                			method: "POST",
                			headers: { "Content-Type": "application/json" },
                			body: JSON.stringify({ userName })
            			});

            			const data = await response.json();
            			alert(data.message || data.error);
        		}

			async function displayData() {
            			const response = await fetch("http://localhost:6543/get-users");
            			const users = await response.json();

            			const usersList = document.getElementById("usersList");
            			usersList.innerHTML = ""; // Clear previous entries

            			users.forEach(user => {
                			const li = document.createElement("li");
                			li.textContent = user.userName;
                			usersList.appendChild(li);
            			});
        		}
