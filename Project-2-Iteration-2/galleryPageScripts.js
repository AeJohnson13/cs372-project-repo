// viewerLandningPageScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for viewerLandingPage.html

window.onload = () => renderGallery(false); 


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
  }

  // Render the videos
  videos.forEach(video => {
    const link = document.createElement('a');
    link.href = `video.html?id=${video._id}`;
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

    container.appendChild(img);
    container.appendChild(title);
    link.appendChild(container);
    gallery.appendChild(link);
  });
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
      console.log("was empty");
      document.getElementById("results-container").classList.remove("show");
    }  
  else{
      console.log("test");
      document.getElementById("results-container").classList.add("show");
      results.forEach(video => {
        const link = document.createElement("a");
        link.href = `video.html?id=${video.id}`;
        link.textContent = video.title;
        link.className = 'video-link';
        resultList.appendChild(link);
      });
    }
  }



function showFavourites() {
  renderGallery(true);
}

function showAll(){
  renderGallery(false);
}


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const usernameRes = await fetch('/getUsername');
    const username = await usernameRes.text();

    const response = await fetch('/getRoles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const roles = await response.json(); // e.g., { viewer: 1, admin: 1, contman: 0 }

    if (roles.admin) {
      import('./adminPageScripts.js').then(mod => mod.showAdminTools());
      document.getElementById("adminTools").classList.remove("hidden");
    }
    else if(roles.contman)
    {
      document.getElementById("contmanTools").classList.remove("hidden");
    }
    // add other roles eventually
    // add to if statement what is selected in the view dropdown menu 
    // display only for one role at a time

  } catch (err) {
    console.error("Error loading roles or modules:", err);
  }
});

async function submitVideo()
{
  const videoTitle = document.getElementById("titleInput").value;
  const inputUrl = document.getElementById("urlInput").value;

  if(checkValidYoutubeUrl(inputUrl)){
    alert("must give a valid youtube url");
  }
  else{
    const urlValue = inputUrl.split("v=")[1].substring(0,11);

    const response = await fetch("/addVideo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoTitle, urlValue})
    });
    const data = await response.json();
    alert(data.message || data.error);
    location.reload();
  }
}

function checkValidYoutubeUrl(url)
{
  var youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/watch\?v=([^&]+)/m;
  if(url != youtubeUrlRegex.exec(url))
  {
    return false;
  }
  else{
    return true;
  }
}