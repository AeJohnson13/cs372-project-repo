// videoScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for video.html


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
  