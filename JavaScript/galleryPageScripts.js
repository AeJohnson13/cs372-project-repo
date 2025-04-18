// viewerLandningPageScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for viewerLandingPage.html


async function submitPreference(preference) {
  console.log("submitPreference called with:", preference);
  try {
    const usernameRes = await fetch('/getUsername');
    const username = usernameRes.text();
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');

    const response = await fetch('/videoPreference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, videoId, preference })
    });

    const text = await response.text();
    console.log("Server response:", response.status, text);
    if (!response.ok) {
      throw new Error(`Server error ${response.status}: ${text}`);
    }

    alert("Preference saved!");
  } catch (err) {
    console.error('Error submitting preference:', err);
    document.body.innerHTML = '<h2>Error saving preference</h2>';
  }
}



async function renderGallery(favoritesOnly = false) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ""; // clear previous videos

  let videos = await fetch('/videos').then(res => res.json());

  // If filter is "favorites", get user's liked videos
  if (favoritesOnly) {
    const usernameRes = await fetch('/getUsername');
    const username = await usernameRes.text();

    const response = await fetch('/getLikedVideos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const likedVideos = await response.json(); // array of video IDs
    videos = videos.filter(video => likedVideos.includes(video._id));
    isFavourites = true;
  }
  else{ isFavourites = false };

  // Render the videos
  videos.forEach(video => {
    const link = document.createElement('a');
    link.href = `video.html?id=${video._id}&role=${currentRole}`;
    link.className = 'video-link';

    const container = document.createElement('div');
    container.className = 'video-container';
    container.dataset.videoId = video.id; // for future use

    const img = document.createElement('img');
    img.src = `https://img.youtube.com/vi/${video.url}/hqdefault.jpg`;
    img.alt = video.title;
    img.className = 'video-thumb';

    const title = document.createElement('p');
    title.textContent = video.title;
    title.className = 'video-title';

    const genre = document.createElement('q');
    genre.textContent = video.genre ? `Genre: ${video.genre}` : '';
    genre.className = 'video-title';

    container.appendChild(img);
    container.appendChild(title);
    container.appendChild(genre);
    link.appendChild(container);
    gallery.appendChild(link);
  });

  if (currentRole === "contman") {
    addRemoveButtons();
  } else {
    // Ensure remove buttons are gone in other views
    document.querySelectorAll('.remove-button').forEach(btn => btn.remove());
  }
  
}

function showFavourites() {
  renderGallery(true);
}
function showAll(){
  renderGallery(false);
}


function toggleRoles() {
  const container = document.getElementById("roles-container");
  container.classList.toggle("show");
  getRoles();
}


const roleDisplayNames = {
  viewer: "Viewer",
  markman: "Marketing Manager",
  contman: "Content Manager",
  admin: "Administrator"
};


async function getRoles()
{
  console.log("Button clicked");
  const usernameRes = await fetch('/getUsername');
  const username = await usernameRes.text();

  const response = await fetch('/getRoles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  const userRoles = await response.json();
  console.log(userRoles);

  const rolesList = document.getElementById("rolesList");
  rolesList.innerHTML = "";

  if (!userRoles || Object.keys(userRoles).length === 0) {
    rolesList.innerHTML = "<li>No roles found.</li>";
  } else {
    for (const [role, isActive] of Object.entries(userRoles)) {
      if (isActive) {
        found = true;
        const li = document.createElement("li");
  
        // Create a clickable item for the role
        const btn = document.createElement("button");
        btn.textContent = roleDisplayNames[role] || role;
        btn.classList.add("role-button");
        btn.onclick = () => handleRoleClick(role); // Trigger function for this role
  
        li.appendChild(btn);
        rolesList.appendChild(li);
      }
    }
  }

}


function handleRoleClick(role) {
  console.log("Selected role:", role);

  switch (role) {
    case "viewer":
      loadViewerFeatures();
      break;
    case "markman":
      loadMarkmanFeatures();
      break;
    case "contman":
      loadContmanFeatures();
      break;
    case "admin":
      loadAdminFeatures();
      break;
    default:
      console.warn("No handler for role:", role);
  }
}


function loadViewerFeatures() {
  document.getElementById("adminTools").classList.add("hidden");
  document.getElementById("markmanTools").classList.add("hidden");
  document.getElementById("contmanTools").classList.add("hidden");
  currentRole = "viewer";
  renderGallery(isFavourites);
}

function loadAdminFeatures() {
  import('./adminPageScripts.js').then(mod => mod.showAdminTools());
  document.getElementById("adminTools").classList.remove("hidden");
  document.getElementById("markmanTools").classList.add("hidden");
  document.getElementById("contmanTools").classList.add("hidden");
  currentRole = "admin";
  renderGallery(isFavourites);
}

function loadContmanFeatures() {
  document.getElementById("adminTools").classList.add("hidden");
  document.getElementById("markmanTools").classList.add("hidden");
  document.getElementById("contmanTools").classList.remove("hidden");
  currentRole = "contman";
  renderGallery(isFavourites);
}

function loadMarkmanFeatures() {
  document.getElementById("adminTools").classList.add("hidden");
  document.getElementById("markmanTools").classList.remove("hidden");
  document.getElementById("contmanTools").classList.add("hidden");
  currentRole = "markman";
  renderGallery(isFavourites);
}

async function librarySearch()
{
  const query = document.getElementById("search").value;
  const response = await fetch("http://localhost:6543/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({query})
  });
  const results = await response.json();
  
  const resultList = document.getElementById("list");
  resultList.innerHTML = ""; // Clear previous entries

  if(!results.length)
    {
      document.getElementById("results-container").classList.remove("show");
    }  
  else{
      document.getElementById("results-container").classList.add("show");
      results.forEach(video => {
        const link = document.createElement("a");
        link.href = `video.html?id=${video._id}&role=${currentRole}`;
        link.textContent = video.title;
        link.className = 'video-link';
        resultList.appendChild(link);
      });
    }
  }


let isFavourites, currentRole;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const usernameRes = await fetch('/getUsername');
    const username = await usernameRes.text();

    const response = await fetch('/getRoles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    if (!response.ok) {
      const err = await response.json();
      document.body.innerHTML = `<h1 style="color: red;">${err.error}</h1>`;
      return; 
    }

    const roles = await response.json(); // e.g., { viewer: 1, admin: 1, contman: 0 }
    console.log(roles);

    if (roles.viewer) {
      loadViewerFeatures();
    } else if (roles.admin) {
      loadAdminFeatures();
    } else if (roles.markman) {
      loadMarkmanFeatures();
    } else if(roles.contman) {
      loadContmanFeatures();
    } 

  } catch (err) {
    console.error("Error loading roles or modules:", err);
  }
});


async function submitVideo()
{
  const videoTitle = document.getElementById("titleInput").value;
  const inputUrl = document.getElementById("urlInput").value;
  const videoGenre = document.getElementById("genreInput").value;
  if(checkInvalidYoutubeUrl(inputUrl)){
    alert("must give a valid youtube url");
  }
  else{
    const urlValue = inputUrl.split("v=")[1].substring(0,11);

    const response = await fetch("/addVideo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoTitle, urlValue, videoGenre})
    });
    const data = await response.json();
    alert(data.message || data.error);
    location.reload();
  }
}


function checkInvalidYoutubeUrl(url)
{
  const youtubeRegEx = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return !(url.match(youtubeRegEx));
}

async function addRemoveButtons(){
  const elements = document.querySelectorAll('.video-link');
  elements.forEach(element => {
    const id = element.href.split("?id=")[1];
    var removeButton = document.createElement("button");
    removeButton.onclick = function() {
      removeVideo(id);
    }; 
    removeButton.className = 'remove-button';
    removeButton.innerText = "remove video";
    element.after(removeButton);
  });
} 

async function removeVideo(videoId) {
  const id = String(videoId);
  const response = await fetch("/removeVideo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id})
  })
  
  const data = await response.json();
  alert(data.message || data.error);
  location.reload();
}