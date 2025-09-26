// Password configuration
const CORRECT_PASSWORD = "2830"; // Change this to your desired password
const SESSION_KEY = "videoGalleryAccess";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// DOM elements
const passwordScreen = document.getElementById('password-screen');
const mainContent = document.getElementById('main-content');
const passwordForm = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const errorMessage = document.getElementById('error-message');
const logoutBtn = document.getElementById('logout-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already authenticated
    if (isAuthenticated()) {
        showMainContent();
    } else {
        showPasswordScreen();
    }
    
    // Add event listeners
    passwordForm.addEventListener('submit', handlePasswordSubmit);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Add keyboard shortcut for logout (Ctrl+L)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            handleLogout();
        }
    });
});

// Handle password form submission
function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const enteredPassword = passwordInput.value.trim();
    
    if (enteredPassword === CORRECT_PASSWORD) {
        // Correct password
        setAuthenticated(true);
        showMainContent();
        clearPasswordForm();
    } else {
        // Incorrect password
        showError("Incorrect password. Please try again.");
        passwordInput.value = '';
        passwordInput.focus();
        
        // Add shake animation to password box
        const passwordBox = document.querySelector('.password-box');
        passwordBox.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            passwordBox.style.animation = '';
        }, 500);
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        setAuthenticated(false);
        showPasswordScreen();
        clearPasswordForm();
        
        // Pause all videos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }
}

// Show password screen
function showPasswordScreen() {
    passwordScreen.classList.remove('hidden');
    mainContent.classList.add('hidden');
    passwordInput.focus();
}

// Show main content
function showMainContent() {
    passwordScreen.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Initialize video players
    initializeVideoPlayers();
    
    // Trigger blast animation immediately when main content is shown
    createBlastAnimation();
    
    // Add user interaction handler to unmute videos
    addUserInteractionHandler();
    
    // Add scroll-based video control
    addScrollVideoControl();
}

// Clear password form
function clearPasswordForm() {
    passwordInput.value = '';
    hideError();
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Auto-hide error after 3 seconds
    setTimeout(() => {
        hideError();
    }, 3000);
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('show');
}

// Check if user is authenticated
function isAuthenticated() {
    // Always return false to require password on every page load/refresh
    return false;
}

// Set authentication status
function setAuthenticated(status) {
    // We don't need to store anything since we want password required on every refresh
    // This function is kept for compatibility but doesn't store the authentication state
}

// Initialize video players with additional features
function initializeVideoPlayers() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach((video, index) => {
        // Ensure video is properly configured (no autoplay - controlled by scroll)
        video.preload = 'auto';
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', ''); // Start muted for better browser compatibility
        video.muted = true; // Ensure muted property is set
        
        // Add loading indicator
        video.addEventListener('loadstart', function() {
            console.log(`Video ${index + 1} loading started`);
            showVideoLoading(this);
        });
        
        video.addEventListener('loadedmetadata', function() {
            console.log(`Video ${index + 1} metadata loaded`);
        });
        
        video.addEventListener('canplay', function() {
            console.log(`Video ${index + 1} can play`);
            hideVideoLoading(this);
            // Don't autoplay immediately - wait for scroll-based trigger
            console.log(`Video ${index + 1} ready but waiting for scroll trigger`);
        });
        
        video.addEventListener('canplaythrough', function() {
            console.log(`Video ${index + 1} can play through`);
            hideVideoLoading(this);
        });
        
        // Add error handling
        video.addEventListener('error', function(e) {
            console.error(`Video ${index + 1} error:`, e);
            handleVideoError(this, index + 1);
        });
        
        // Add play/pause tracking
        video.addEventListener('play', function() {
            console.log(`Video ${index + 1} started playing`);
        });
        
        video.addEventListener('pause', function() {
            console.log(`Video ${index + 1} paused`);
        });
        
        video.addEventListener('ended', function() {
            console.log(`Video ${index + 1} ended`);
        });
        
        // Prevent right-click context menu on videos (basic protection)
        video.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        
        // Disable video download (basic protection)
        video.setAttribute('controlsList', 'nodownload');
        
        // Force load the video
        video.load();
    });
}

// Show video loading indicator
function showVideoLoading(video) {
    const container = video.closest('.video-item') || video.parentElement;
    if (container && !container.querySelector('.video-loading')) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'video-loading';
        loadingDiv.innerHTML = '<div class="loading"></div><p>Loading video...</p>';
        loadingDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #666;
            z-index: 10;
        `;
        container.style.position = 'relative';
        container.appendChild(loadingDiv);
    }
}

// Hide video loading indicator
function hideVideoLoading(video) {
    const container = video.closest('.video-item') || video.parentElement;
    if (container) {
        const loadingDiv = container.querySelector('.video-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
}

// Handle video errors
function handleVideoError(video, videoNumber) {
    const container = video.closest('.video-item') || video.parentElement;
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'video-error';
        errorDiv.innerHTML = `
            <p style="color: #e74c3c; text-align: center; padding: 20px;">
                ⚠️ Error loading Video ${videoNumber}<br>
                <small>Please check if the video file exists in the video folder</small>
            </p>
        `;
        
        // Replace video with error message
        video.style.display = 'none';
        container.appendChild(errorDiv);
    }
}

// Show play button when autoplay fails
function showPlayButton(video, videoNumber) {
    const container = video.closest('.video-item') || video.parentElement;
    if (container && !container.querySelector('.play-button-overlay')) {
        const playButton = document.createElement('div');
        playButton.className = 'play-button-overlay';
        playButton.innerHTML = `
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 15px 25px;
                border-radius: 50px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 100;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(0, 0, 0, 0.9)'" onmouseout="this.style.background='rgba(0, 0, 0, 0.7)'">
                ▶️ Click to Play Video
            </div>
        `;
        
        container.style.position = 'relative';
        container.appendChild(playButton);
        
        // Add click event to play video
        playButton.addEventListener('click', function() {
            video.muted = false; // Unmute when user clicks
            video.play().then(() => {
                playButton.remove();
            }).catch(e => {
                console.log('Manual play failed:', e);
            });
        });
    }
}

// Add user interaction handler to unmute videos
function addUserInteractionHandler() {
    let hasInteracted = false;
    
    function handleUserInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;
            const videos = document.querySelectorAll('video');
            videos.forEach((video, index) => {
                if (!video.paused) {
                    video.muted = false;
                    console.log(`Video ${index + 1} unmuted after user interaction`);
                }
            });
            
            // Remove event listeners after first interaction
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        }
    }
    
    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
}

// Add scroll-based video control
function addScrollVideoControl() {
    const videos = document.querySelectorAll('video');
    
    // Create intersection observer to detect when videos are in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            if (entry.isIntersecting) {
                // Video is in view
                if (video.paused) {
                    // Start playing the video when it comes into view
                    video.play().then(() => {
                        console.log('Video started playing due to scroll into view');
                        video.dataset.pausedByScroll = 'false';
                        
                        // Unmute after a short delay if this is the first play
                        if (video.dataset.hasPlayedBefore !== 'true') {
                            setTimeout(() => {
                                video.muted = false;
                                console.log('Video unmuted after first play');
                                video.dataset.hasPlayedBefore = 'true';
                            }, 1000);
                        }
                    }).catch(e => {
                        console.log('Failed to play video on scroll:', e);
                        // If autoplay fails, show play button
                        showPlayButton(video, Array.from(videos).indexOf(video) + 1);
                    });
                }
            } else {
                // Video is out of view - pause it
                if (!video.paused) {
                    video.pause();
                    video.dataset.pausedByScroll = 'true';
                    console.log('Video paused due to scroll out of view');
                }
            }
        });
    }, {
        threshold: 0.3, // Video needs to be at least 30% visible to start playing
        rootMargin: '0px 0px -50px 0px' // Trigger when video is getting close to view
    });
    
    // Observe all videos
    videos.forEach(video => {
        observer.observe(video);
        video.dataset.pausedByScroll = 'false';
        video.dataset.hasPlayedBefore = 'false';
    });
    
    // Store observer reference for cleanup if needed
    window.videoScrollObserver = observer;
}

// Add shake animation CSS
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Inject shake animation CSS
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Security: Clear authentication on page unload
window.addEventListener('beforeunload', function() {
    // Optional: Clear session on page close (uncomment if needed)
    // setAuthenticated(false);
});

// Security: Disable some keyboard shortcuts and developer tools access
document.addEventListener('keydown', function(e) {
    // Disable F12 (Developer Tools)
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    
    // Disable Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
    
    // Disable Ctrl+S (Save Page)
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
    }
});

// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Blast Animation Function
function createBlastAnimation() {
    const blastContainer = document.createElement('div');
    blastContainer.className = 'blast-animation';
    document.body.appendChild(blastContainer);
    
    // Expanded array of emojis and papers for the blast
    const emojis = [
        '🎉', '🎊', '🎈', '🎂', '🎁', '🌟', '✨', '💖', '🎀', '🌈', 
        '🦄', '💫', '🎵', '🎶', '💝', '🌸', '🌺', '🌻', '🦋', '🎭',
        '🎪', '🎨', '🎯', '🎲', '🎸', '🎺', '🎷', '🥳', '🤩', '😍',
        '🥰', '😘', '💕', '💞', '💓', '💗', '💘', '💝', '💖', '💌',
        '🌹', '🌷', '🌼', '🌻', '🌺', '🌸', '🏵️', '💐', '🌿', '🍀',
        '⭐', '🌟', '✨', '💫', '⚡', '🔥', '💥', '🎆', '🎇', '🌠',
        '🎊', '🎉', '🎈', '🎁', '🎀', '🎂', '🧁', '🍰', '🎪', '🎭'
    ];
    
    // Create many more blast items at once for spectacular effect
    for (let i = 0; i < 120; i++) {
        createBlastItem(blastContainer, emojis);
    }
    
    // Remove blast container after animation
    setTimeout(() => {
        if (blastContainer && blastContainer.parentNode) {
            blastContainer.parentNode.removeChild(blastContainer);
        }
    }, 3000);
}

function createBlastItem(container, emojis) {
    const item = document.createElement('div');
    item.className = 'blast-item';
    item.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Random starting position (center of screen)
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    
    // Random end position
    const endX = Math.random() * window.innerWidth;
    const endY = Math.random() * window.innerHeight;
    
    // Random size
    const size = Math.random() * 20 + 15; // 15px to 35px
    
    // Set initial styles
    item.style.cssText = `
        left: ${startX}px;
        top: ${startY}px;
        font-size: ${size}px;
        opacity: 1;
        transform: translate(-50%, -50%);
        transition: all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 15000;
    `;
    
    container.appendChild(item);
    
    // Animate to end position
    setTimeout(() => {
        item.style.cssText += `
            left: ${endX}px;
            top: ${endY}px;
            opacity: 0;
            transform: translate(-50%, -50%) rotate(${Math.random() * 720 - 360}deg) scale(0.3);
        `;
    }, 50);
    
    // Remove item after animation
    setTimeout(() => {
        if (item && item.parentNode) {
            item.parentNode.removeChild(item);
        }
    }, 2500);
}

// Add click event to trigger blast on heading click
document.addEventListener('DOMContentLoaded', function() {
    // Existing initialization code...
    
    // Add blast trigger on heading click
    setTimeout(() => {
        const heading = document.querySelector('.main-heading');
        if (heading) {
            heading.addEventListener('click', createBlastAnimation);
            heading.style.cursor = 'pointer';
            heading.title = 'Click for celebration blast!';
        }
    }, 1000);
});

console.log('Video Gallery initialized successfully!');