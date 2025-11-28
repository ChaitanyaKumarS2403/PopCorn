document.addEventListener('DOMContentLoaded', () => {
    // 1. Element Definitions
    const homeContent = document.getElementById('home-content');
    const browseContent = document.getElementById('browse-content');
    const screenContent = document.getElementById('screen-content');
    // NEW: Credits Content
    const creditsContent = document.getElementById('credits-content'); 
    const mediaPlayerContainer = document.getElementById('media-player-container');
    const screenTitle = document.getElementById('screenTitle'); 
    
    // UPDATED: Include creditsContent in tabContents
    const tabContents = [homeContent, browseContent, screenContent, creditsContent]; 

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const chooseMovieButton = document.getElementById('chooseMovieButton');
    const themeToggle = document.getElementById('theme-toggle'); 
    const themeIcon = document.getElementById('theme-icon'); 
    
    // NEW: GitHub Nav Link
    const githubNavLink = document.getElementById('github-nav-link');

    // Browse Tab Elements
    const mediaFileInput = document.getElementById('mediaFileInput');
    const dropZone = document.getElementById('drop-zone');
    const browseFileBtn = document.getElementById('browseFileBtn');
    
    // Screen Tab Elements
    const closeMediaBtn = document.getElementById('closeMediaBtn'); 
    
    // Toast Elements
    const fileSelectedToast = document.getElementById('fileSelectedToast');
    const toastFileName = document.getElementById('toastFileName');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(fileSelectedToast);
    
    const warningToast = document.getElementById('warningToast'); 
    const warningToastTitle = document.getElementById('warningToastTitle');
    const warningToastBody = document.getElementById('warningToastBody');
    const warningToastBootstrap = bootstrap.Toast.getOrCreateInstance(warningToast); 

    const supportedFormats = ['.mp4', '.mp3', '.mov', '.mkv'];
    let currentSelectedFile = null; 
    
    // NEW: Variable to hold the Plyr instance
    let plyrInstance = null; 

    // Default content for the media player container
    const defaultScreenMessage = '<h3 class="text-white text-center p-5">Select a file from the Browse tab to begin.</h3>';


    // Helper function to display a warning toast
    function showWarning(title, message) {
        warningToastTitle.textContent = title;
        warningToastBody.textContent = message;
        warningToastBootstrap.show();
    }
    
    // Helper function for navigation link activation (UPDATED)
    function getNavItem(contentElement) {
        if (contentElement === homeContent) return document.querySelector('.navbar-nav a[href*="Home"]');
        if (contentElement === browseContent) return document.querySelector('.navbar-nav a[href*="Browse"]');
        if (contentElement === screenContent) return document.querySelector('.navbar-nav a[href*="Screen"]');
        // NEW: The credits content is activated by the GitHub link
        if (contentElement === creditsContent) return document.getElementById('github-nav-link'); 
        return null;
    }
    
    // 2. Tab switching function
    function showTab(targetContent) {
        tabContents.forEach(content => content.classList.remove('is-visible'));
        tabContents.forEach(content => content.classList.add('d-none'));
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        targetContent.classList.remove('d-none');
        
        setTimeout(() => {
            targetContent.classList.add('is-visible');
        }, 50);

        const activeLink = getNavItem(targetContent);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    }

    // 3. Theme Toggle Logic
    function applyTheme(isDark) {
        const body = document.body;

        if (isDark) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            // NEW: Update Toggle Switch State and Icon
            themeToggle.checked = true; 
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            // NEW: Update Toggle Switch State and Icon
            themeToggle.checked = false; 
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    }

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme === 'dark'); 

        themeToggle.addEventListener('change', () => { // Changed from 'click' to 'change'
            // The state is now read directly from the checkbox's 'checked' property
            applyTheme(themeToggle.checked);
        });
    }

    // 4. File Handling & Validation
    function validateAndSetFile(file) {
        if (file) {
            const fileName = file.name.toLowerCase();
            const isSupported = supportedFormats.some(format => fileName.endsWith(format));

            if (isSupported) {
                currentSelectedFile = file;
                
                // Show success notification (TOAST)
                toastFileName.textContent = file.name;
                toastBootstrap.show();
                
                // Immediately load and show the screen
                loadMediaAndShowScreen();

            } else {
                currentSelectedFile = null;
                
                // Show Error Toast for unsupported format
                showWarning("Unsupported Format", `File type "${file.type || 'unknown'}" is not supported. Please use .mp4, .mp3, .mov, or .mkv.`);
            }
        } else {
            currentSelectedFile = null;
        }
    }

    // Input Change
    mediaFileInput.addEventListener('change', (e) => {
        validateAndSetFile(e.target.files[0]);
    });

    // Browse Button Click
    browseFileBtn.addEventListener('click', () => {
        mediaFileInput.click();
    });
    
    // NEW CHANGE: Make the entire dropZone clickable for file selection
    dropZone.addEventListener('click', (e) => {
        // Only trigger the file input if the click did not originate from the explicit button itself
        // This prevents double-triggering when the "Browse Files" button is clicked.
        if (e.target.id !== 'browseFileBtn') {
            mediaFileInput.click();
        }
    });


    // Drag and Drop Logic
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
    });
    dropZone.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        if (files.length > 0) {
            validateAndSetFile(files[0]);
        }
    }
    
    // 5. Navigation Event Listeners (SIMPLIFIED)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // CHANGE: Use e.currentTarget to get the content of the <a> tag reliably, 
            // even if the click was on the icon (<i>) inside.
            const clickedLink = e.currentTarget;
            const linkText = clickedLink.textContent.trim().replace(/\s{2,}/g, ' '); // Use the link's text content
            const linkId = clickedLink.id;
            
            if (linkText === 'Home') showTab(homeContent);
            else if (linkText === 'Browse') showTab(browseContent);
            else if (linkText === 'Screen') {
                // When going to screen, ensure it shows the default message if no media is loaded
                if (!currentSelectedFile) {
                    mediaPlayerContainer.innerHTML = defaultScreenMessage;
                    screenTitle.textContent = "Your Movie Screen";
                    closeMediaBtn.classList.add('d-none');
                }
                showTab(screenContent);
            }
            // SIMPLIFIED: GitHub/Credits Tab Logic - Just switches to Credits tab.
            else if (linkId === 'github-nav-link') {
                showTab(creditsContent);
            }
        });
    });

    if (chooseMovieButton) {
        chooseMovieButton.addEventListener('click', (e) => {
            e.preventDefault();
            showTab(browseContent); 
        });
    }

    // 6. Close Media Button Logic
    if (closeMediaBtn) {
        closeMediaBtn.addEventListener('click', () => {
            // 1. Destroy Plyr instance and revoke object URL
            if (plyrInstance) {
                plyrInstance.destroy();
                plyrInstance = null; // Clear the instance
            }
            // Revoke object URL (important for memory)
            if (currentSelectedFile) {
                const mediaElement = mediaPlayerContainer.querySelector('video, audio');
                if (mediaElement && mediaElement.src && mediaElement.src.startsWith('blob:')) {
                    URL.revokeObjectURL(mediaElement.src);
                }
            }

            // 2. RESET ALL STATE
            currentSelectedFile = null;
            mediaFileInput.value = ''; 
            
            // 3. Reset media player container DISPLAY TO DEFAULT MESSAGE
            mediaPlayerContainer.innerHTML = defaultScreenMessage;
            screenTitle.textContent = "Your Movie Screen";
            
            // 4. HIDE CLOSE BUTTON
            closeMediaBtn.classList.add('d-none');
            
            // 5. Switch directly to Browse tab
            showTab(browseContent);
        });
    }

    // 7. Load Media and Switch to Screen (Updated for Plyr and Scrolling Title)
    function loadMediaAndShowScreen() {
        const file = currentSelectedFile;
        if (!file) {
            showWarning("No Media Selected", "Please select a media file to begin streaming.");
            return;
        } 
        
        // Destroy any existing Plyr instance before creating a new one
        if (plyrInstance) {
            plyrInstance.destroy();
            plyrInstance = null;
        }

        const fileURL = URL.createObjectURL(file);
        const fileType = file.type.startsWith('video/') ? 'video' : 'audio';

        // Show loading spinner
        mediaPlayerContainer.innerHTML = '<div class="spinner-border text-info" role="status"><span class="visually-hidden">Loading...</span></div>'; 

        const mediaElement = document.createElement(fileType);
        mediaElement.src = fileURL;
        
        // Append the media element to the container first
        mediaPlayerContainer.innerHTML = '';
        mediaPlayerContainer.appendChild(mediaElement);
        
        // Initialize Plyr on the new media element
        try {
            plyrInstance = new Plyr(mediaElement, {
                // Define the controls to be displayed, including advanced options
                controls: [
                    'play-large', 
                    'restart', 
                    'rewind', 
                    'play', 
                    'fast-forward', 
                    'progress', 
                    'current-time', 
                    'duration', 
                    'mute', 
                    'volume', 
                    'settings', 
                    'fullscreen',
                    // ADDED: Include the captions control button
                    'captions' 
                ],
                // Enable playback speed control, quality, and looping via the settings menu
                settings: ['speed', 'quality', 'loop'], 
                keyboard: { focused: true, global: true }, // Enable keyboard shortcuts (Space, Arrow keys, etc.)
                autoplay: true,
                loop: { active: false }
            });
            
            // Event listener for Plyr error during playback/loading
            plyrInstance.on('error', () => {
                showWarning("Media Loading Failed", "Error: Could not play media file. Check the file source or format.");
                // Clean up and reset
                if (plyrInstance) {
                    plyrInstance.destroy();
                    plyrInstance = null;
                }
                mediaPlayerContainer.innerHTML = defaultScreenMessage;
                screenTitle.textContent = "Your Movie Screen";
                closeMediaBtn.classList.add('d-none');
                showTab(screenContent);
            });
            
            // Set the screen title with scrolling logic
            const titleText = file.name;
            const maxVisibleLength = 50; // Threshold to determine if scrolling is needed

            // Reset class list
            screenTitle.classList.remove('scrolling'); 
            
            if (titleText.length > maxVisibleLength) {
                // Apply the class and wrap content in a span for scrolling
                screenTitle.classList.add('scrolling');
                screenTitle.innerHTML = `<span>${titleText}</span>`;
            } else {
                // Keep it simple if the title is short
                screenTitle.textContent = titleText;
                // Ensure no residual span element is left from a previous scrolling title
                screenTitle.innerHTML = titleText;
            }

            // SHOW CLOSE BUTTON
            closeMediaBtn.classList.remove('d-none'); 

            showTab(screenContent);
            
        } catch (error) {
             // Handle initialization error (e.g., if Plyr failed to attach)
             mediaElement.remove();
             console.error("Plyr Initialization Error:", error);
             showWarning("Player Initialization Failed", "An error occurred setting up the advanced media player.");
             mediaPlayerContainer.innerHTML = defaultScreenMessage;
             screenTitle.textContent = "Your Movie Screen";
             closeMediaBtn.classList.add('d-none');
             showTab(screenContent);
        }
    }
    
    // 8. Initial state
    showTab(homeContent); 
});