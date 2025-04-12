// videoScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for video.html


// loadVideo()
//    loads video from Video Library using Youtube  
(async function loadVideo() {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');
  
    try {
      const res = await fetch('/videos');
      
      const videos = await res.json();
      const video = videos.find(v => v.id === videoId);
  
      if (!video) {
        document.body.innerHTML = '<h2>Video not found</h2>';
        return;
      }
  
      document.getElementById('video-title').textContent = video.title;
      document.getElementById('video-frame').src = `https://www.youtube.com/embed/${video.url}`;
    } catch (err) {
      console.error('Error loading video:', err);
      document.body.innerHTML = '<h2>Error loading video</h2>';
    }
})();


let currentPreference = null; // Tracks the current state

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
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get('id');
      
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
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');
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


// loads videos with current preference
document.addEventListener('DOMContentLoaded', () => {
    loadUserPreference();
});
