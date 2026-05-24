// Find all video elements and mark them as complete
(function() {
  const videos = document.querySelectorAll('video');
  
  if (videos.length === 0) {
    console.log('No <video> elements found on this page.');
    return;
  }

  videos.forEach((video, i) => {
    // Set currentTime to end (triggers 'ended' event on some players)
    video.currentTime = video.duration || 9999;
    
    // Dispatch common completion events
    ['ended', 'timeupdate', 'pause'].forEach(eventName => {
      video.dispatchEvent(new Event(eventName, { bubbles: true }));
    });

    console.log(`Video ${i + 1}: set to end`, video);
  });

  console.log(`Done — ${videos.length} video(s) processed.`);
})();