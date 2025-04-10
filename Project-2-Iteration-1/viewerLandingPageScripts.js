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
      link.style.textDecoration = 'none';

      const container = document.createElement('div');
      container.style.display = 'inline-block';
      container.style.margin = '59px';
      container.style.textAlign = 'center';

      const img = document.createElement('img');
      img.src = video.thumbnail;
      img.alt = video.title;
      img.width = 369;
      img.height = 208;
      img.style.objectFit = 'cover';

      const title = document.createElement('p');
      title.textContent = video.title;
      title.style.marginTop = '10px';
      title.style.fontSize = '1rem';
      title.style.color = '#333';

      container.appendChild(img);
      container.appendChild(title);
      link.appendChild(container);
      gallery.appendChild(link);
    });
  })
  .catch(err => {
    console.error('Error loading video gallery:', err);
  });
