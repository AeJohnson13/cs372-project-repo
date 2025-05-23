// videoScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for video.html



// variables and constants
const urlParams = new URLSearchParams(window.location.search);
const currentRole = urlParams.get("role");
const videoId = urlParams.get('id');
let currentPreference = null;


// loadVideo()
//    loads video from Video Library using Youtube  
(async function loadVideo() {
    try {
      const res = await fetch('/videos');
      const videos = await res.json();
      const video = videos.find(v => v._id === videoId);
  
      if (!video) {
        document.body.innerHTML = '<h2>Video not found</h2>';
        return;
      }
  
      document.getElementById('video-title').textContent = video.title;
      document.getElementById('video-frame').src = `https://www.youtube.com/embed/${video.url}`;
      await loadComment(video._id.$oid || video._id);
    } catch (err) {
      console.error('Error loading video:', err);
      document.body.innerHTML = '<h2>Error loading video</h2>';
    }
})();


// submitPreference() 
//    triggered by clicking like or dislike button
//    fetches user currently logged in and video ID
// 		stores the video under likes or dislikes array for user 
async function togglePreference(preference) {
    const likeBtn = document.getElementById('likeButton');
    const dislikeBtn = document.getElementById('dislikeButton');

    try {
      const usernameRes = await fetch('/getUsername');
      const username = await usernameRes.text();
      let action;
      if (currentPreference === preference) {
        action = 'remove'; // User clicked the same radio button again — undo!
        currentPreference = null; 
        likeBtn.checked = false;
        dislikeBtn.checked = false;
      } else {
        action = 'set';
        currentPreference = preference;
        likeBtn.checked = (preference === 'like');
        dislikeBtn.checked = (preference === 'dislike');
      }

      const response = await fetch('/videoPreference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, videoId, preference, action })
      });

      const text = await response.text();
      console.log("Server response:", response.status, text);
      displayAnalytics(); // updates like dislike in real time with user input 
    } catch (err) {
      console.error('Error submitting preference:', err);
      document.body.innerHTML = '<h2>Error saving preference</h2>';
    }
}


// loadUserPreference()
//    load and mark the user's saved preference when the page loads
async function loadUserPreference() {
  try {
    const usernameRes = await fetch('/getUsername');
    const username = await usernameRes.text();
    const query = `username=${encodeURIComponent(username)}&videoId=${encodeURIComponent(videoId)}`;
    const prefRes = await fetch(`/getVideoPreference?${query}`);
    const data = await prefRes.json();

    if (data.preference === 'like') {
      const likeBtn = document.getElementById('likeButton');
      if (likeBtn) likeBtn.checked = true;
    } else if (data.preference === 'dislike') {
      const dislikeBtn = document.getElementById('dislikeButton');
      if (dislikeBtn) dislikeBtn.checked = true;
    }
  } catch (err) {
    console.error('Error loading preference:', err);
  }
}


// loadComment() 
//		show comment 
async function loadComment() {
  try {
    const res = await fetch(`/getComment?videoId=${videoId}`);
    const data = await res.json();
    document.getElementById('currentComment').textContent = data.comment || 'No comment.';
  } catch (err) {
    console.error('Failed to load comment:', err);
  }
}


// submitComment() 
//		change comment 
async function submitComment(textOverride) {
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get('id');

  // Use the override text if provided, otherwise get value from input box
  const commentText = (typeof textOverride === 'string') 
    ? textOverride 
    : document.getElementById('commentInput').value;

  try {
    const res = await fetch(`/postComment?videoId=${videoId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: commentText }),
    });

    const data = await res.json();
    alert('Comment submitted!');
    await loadComment(); // refresh displayed comment
  } catch (err) {
    console.error('Failed to submit comment:', err);
    alert('Failed to submit comment.');
  }
}


// display based on role
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserPreference();
  await loadComment();
  await loadCurrentTitle();
  await loadGenre();

  // Show title + genre video editor only to contan
  if (currentRole === "contman" ) {
    document.getElementById("contmanTools").classList.remove("hidden");
  }

  // Show the view + clear comment box to both markman and contman
  if (currentRole === "contman" || currentRole === "markman") {
    document.getElementById("managerTools").classList.remove("hidden");
  }

  // Show the comment input box only to markman
  if (currentRole === "markman") {
    document.getElementById("markmanTools").classList.remove("hidden");
    displayAnalytics();
  }
  
});


// getAnalytics() 
//		fetch total likes and dislikes 
async function getAnalytics()
{
  try{
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');
    const response = await fetch('/getAnalytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ videoId })
    });
    const analytics = await response.json();
    return analytics;
  } 
  catch (err) {
    console.error("error accessing like arrays:", err);
  }
}


// displayAnalytics() 
//		show total likes and dislikes 
async function displayAnalytics(){
  videoAnalytics = await getAnalytics();
  document.getElementById("videoLikes").innerText = "Likes" + videoAnalytics.likes;
  document.getElementById("videoDislikes").innerText = "Dislikes:" + videoAnalytics.dislikes;
}


// submitTitle() 
//		update current title 
async function submitTitle() {
  try {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');
    const newTitle = document.getElementById('titleInput').value;

    const response = await fetch('/submitTitle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, title: newTitle })
    });

    if (response.ok) {
      // Reload the current title without reloading the entire page
      await loadCurrentTitle();
      alert("Title updated successfully!");
    } else {
      console.error("Error updating title.");
    }

  } catch (err) {
    console.error("Error submitting title:", err);
  }
}


// loadCurrentTitle() 
//		fetch current title 
async function loadCurrentTitle() {
  try {
    const response = await fetch('/getTitle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('titleInput').value = data.title || "";
    } else {
      console.warn("Could not load title:", data.message);
    }

  } catch (err) {
    console.error("Error loading title:", err);
  }
}


// loadGenre() 
//		fetches video genre and displays if it exists
window.addEventListener('DOMContentLoaded', loadGenre);
async function loadGenre() {
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get('id');

  try {
    const res = await fetch(`/getGenre?videoId=${videoId}`);
    const data = await res.json();
    document.getElementById('genreInput').value = data.genre || '';
  } catch (err) {
    console.error('Failed to load genre:', err);
  }
}


// submitGenre() 
//		changes video genre to textbox input
async function submitGenre() {
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get('id');
  const genreText = document.getElementById('genreInput').value;

  try {
    const res = await fetch(`/postGenre?videoId=${videoId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ genre: genreText })
    });

    await loadGenre();
    const data = await res.json();
    alert('Genre submitted!');
  } catch (err) {
    alert('Failed to submit genre.');
    console.error(err);
  }
}


