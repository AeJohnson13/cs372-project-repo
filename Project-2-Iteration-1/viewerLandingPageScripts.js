// viewerLandningPageScripts.js
// Alex Johnson, Ryland Sacker, Enica King
// Scripts for viewerLandingPage.html


fetch('/videos')
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
  })
  .catch(err => {
    console.error('Error loading video gallery:', err);
  });





async function libararySearch()
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
