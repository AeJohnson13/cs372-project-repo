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

async function showAdminTools() {
    try {
      const response = await fetch("/getUserList");
      const users = await response.json();
  
      const usersList = document.getElementById("usersList");
      usersList.innerHTML = ""; // Clear any existing items
  
      users.forEach(user => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>Username:</strong> ${user.username}<br>
          <strong>Roles:</strong> ${formatRoles(user.roles)}
        `;
        li.style.padding = "0.5em 0";
        li.style.borderBottom = "1px solid #ccc";
        usersList.appendChild(li);
      });
  
      console.log(users);
    } catch (err) {
      console.error("Error loading user list:", err);
    }
}


function formatRoles(roles) {
if (!roles) return 'None';
return Object.entries(roles)
    .filter(([_, enabled]) => enabled)
    .map(([role]) => role)
    .join(', ') || 'None';
}

