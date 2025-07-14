let loopEnabled = false;
let loopButton = null;

function createLoopButton() {
  // Find the YouTube player controls
  const controls = document.querySelector('.ytp-right-controls');
  if (!controls || document.querySelector('#loop-button')) return;

  // Create the loop button
  loopButton = document.createElement('button');
  loopButton.id = 'loop-button';
  loopButton.className = 'ytp-button loop-button';
  loopButton.title = 'Loop video';
  loopButton.innerHTML = '🔁';
  
  // Add click event
  loopButton.addEventListener('click', toggleLoop);
  
  // Insert button into controls
  controls.insertBefore(loopButton, controls.firstChild);
  
  // Update button appearance
  updateButtonAppearance();
}

function toggleLoop() {
  loopEnabled = !loopEnabled;
  updateButtonAppearance();
  
  const video = document.querySelector('video');
  if (video) {
    video.loop = loopEnabled;
  }
}

function updateButtonAppearance() {
  if (loopButton) {
    loopButton.classList.toggle('active', loopEnabled);
    loopButton.title = loopEnabled ? 'Loop enabled - Click to disable' : 'Loop disabled - Click to enable';
  }
}

function setupVideoLoop() {
  const video = document.querySelector('video');
  if (video) {
    video.loop = loopEnabled;
    
    // Backup method: manually restart video when it ends
    video.addEventListener('ended', () => {
      if (loopEnabled) {
        video.currentTime = 0;
        video.play();
      }
    });
  }
}

// Initialize when page loads
function init() {
  // Wait for YouTube to load
  const observer = new MutationObserver(() => {
    if (document.querySelector('.ytp-right-controls')) {
      createLoopButton();
      setupVideoLoop();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also try immediately in case it's already loaded
  setTimeout(() => {
    createLoopButton();
    setupVideoLoop();
  }, 1000);
}

// Handle navigation in YouTube (since it's a SPA)
let currentUrl = location.href;
new MutationObserver(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    loopEnabled = false;
    setTimeout(() => {
      createLoopButton();
      setupVideoLoop();
    }, 1000);
  }
}).observe(document, { subtree: true, childList: true });

// Start the extension
init();