// ScriptsLoginPage.js
// Alex Johnson, Ryland Scaker, Enica King
// Scripts for LoginWebpage.html

async function submitData() {
	const userName = document.getElementById("UserNameInput").value;
	const passWord = document.getElementById("PasswordInput").value;
	const response = await fetch("http://localhost:6543/add-user", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ userName, passWord })
	});

	const data = await response.json();
    alert(data.message || data.error);
}


