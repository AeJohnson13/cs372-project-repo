// viewerLandningPageScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for viewerLandingPage.html


fetch('videos.json')
  .then(res => res.json())
  .then(videos => {
    const gallery = document.getElementById('gallery');

    videos.forEach(video => {
      const link = document.createElement('a');
      link.href = `video.html?id=${video.id}`;
      link.className = 'video-link';

      const container = document.createElement('div');
      container.className = 'video-container';

      const img = document.createElement('img');
      img.src = video.thumbnail;
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
  })
  .catch(err => {
    console.error('Error loading video gallery:', err);
  });
