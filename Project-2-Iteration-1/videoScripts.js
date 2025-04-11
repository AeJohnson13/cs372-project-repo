// videoScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for video.html


// submitPreference() 
//    fetches user currently logged in and video ID
// 		stores the video with status 'like' or 'dislike' for user 
async function submitPreference(preference) {
  try {
    const usernameRes = await fetch('/getUsername');
    const username = await usernameRes.text();

    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');

    await fetch('/api/videoPreference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        videoId,
        preference
      })
    });
  } catch (err) {
    console.error('Error submitting ${preference}:', err);
    document.body.innerHTML = '<h2>Error saving preference</h2>';
  }
}

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