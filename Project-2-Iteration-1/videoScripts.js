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


  // submitPreference() 
  //    fetches user currently logged in and video ID
  // 		stores the video under likes or dislikes array for user 
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


  // setInitialPreference() 
  //    fetches user preference for the video and clicks button for them 
  async function setInitialPreference() {
    try {
      const usernameRes = await fetch('/getUsername');
      const username = await usernameRes.text();
  
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get('id');
  
      const prefRes = await fetch(`/getPreference?username=${username}&videoId=${videoId}`);
      const { preference } = await prefRes.json();
  
      if (preference) {
        const radioBtn = document.querySelector(`input[name="preference"][value="${preference}"]`);
        if (radioBtn) {
          radioBtn.checked = true;
        }
      }
    } catch (err) {
      console.error('Failed to set initial preference:', err);
    }
  }
  
  window.onload = setInitialPreference;
  