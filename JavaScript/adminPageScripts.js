// adminPageScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for adminPage.html

async function addButton()
{
  try {
        const response = await fetch("/getUserList");
        const users = await response.json();
    
        const usersList = document.getElementById("usersList");
        usersList.innerHTML = ""; // Clear any existing items
    
        users.forEach(user => {
          const div = document.createElement("div");
          div.className = "parent-flex";
          const header = document.createElement("h2");
          header.innerText = user.username;
          div.appendChild(header);

          const viewerButton = document.createElement("button");
          viewerButton.innerHTML = "viewer";
          if(user.roles.viewer == 0){
            viewerButton.className ="offButton";
          }
          const adminButton = document.createElement("button");
          adminButton.innerHTML = "administrator";
          if(user.roles.admin == 0){
            adminButton.className ="offButton";
          }
          const markManButton = document.createElement("button");
          markManButton.innerHTML = "marketing manager";
          if(user.roles.markman == 0){
            markManButton.className ="offButton";
          }
          const contManButton = document.createElement("button");
          contManButton.innerHTML = "content manager";
          if(user.roles.contman == 0){
            contManButton.className = "offButton";
          }

          div.appendChild(viewerButton);
          div.appendChild(adminButton);
          div.appendChild(markManButton);
          div.appendChild(contManButton);
          
          usersList.appendChild(div);
        });
  
      } catch (err) {
        console.error("Error loading user list:", err);
      }
  }


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

document.addEventListener('DOMContentLoaded', async () => {
  addButton();
});