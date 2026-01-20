document.addEventListener('DOMContentLoaded', () => {
    // 1. Element Definitions
    const homeContent = document.getElementById('home-content');
    const browseContent = document.getElementById('browse-content');
    const screenContent = document.getElementById('screen-content');
    const creditsContent = document.getElementById('credits-content'); 
    const mediaPlayerContainer = document.getElementById('media-player-container');
    const screenTitle = document.getElementById('screenTitle'); 
    
    const tabContents = [homeContent, browseContent, screenContent, creditsContent]; 

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const chooseMovieButton = document.getElementById('chooseMovieButton');
    const themeToggle = document.getElementById('theme-toggle'); 
    const themeIcon = document.getElementById('theme-icon'); 
    const githubNavLink = document.getElementById('.navbar-nav .nav-link');

    // Browse Tab Elements
    const mediaFileInput = document.getElementById('mediaFileInput');
    const dropZone = document.getElementById('drop-zone');
    const browseFileBtn = document.getElementById('browseFileBtn');
    
    // Screen Tab Elements
    const closeMediaBtn = document.getElementById('closeMediaBtn'); 
    const addSubtitleBtn = document.getElementById('addSubtitleBtn'); 
    const trackSettingsBtn = document.getElementById('trackSettingsBtn'); 
    const trackModal = new bootstrap.Modal(document.getElementById('trackModal')); 
    const audioTrackSelect = document.getElementById('audioTrackSelect'); 
    const subtitleTrackSelect = document.getElementById('subtitleTrackSelect'); 
    
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
    let plyrInstance = null; 

    const defaultScreenMessage = '<h3 class="text-white text-center p-5">Select a file from the Browse tab to begin.</h3>';

    // NEW: SRT to WebVTT Converter Function
    function srtToVtt(srtText) {
        return 'WEBVTT\n\n' + srtText
            .replace(/\r\n/g, '\n')
            .replace(/(\d+:\d+:\d+),(\d+)/g, '$1.$2');
    }

    function showWarning(title, message) {
        warningToastTitle.textContent = title;
        warningToastBody.textContent = message;
        warningToastBootstrap.show();
    }
    
    function getNavItem(contentElement) {
        if (contentElement === homeContent) return document.querySelector('.navbar-nav a[href*="Home"]');
        if (contentElement === browseContent) return document.querySelector('.navbar-nav a[href*="Browse"]');
        if (contentElement === screenContent) return document.querySelector('.navbar-nav a[href*="Screen"]');
        if (contentElement === creditsContent) return document.querySelector('.navbar-nav a[href*="GitHub"]'); 
        return null;
    }
    
    function showTab(targetContent) {
        tabContents.forEach(content => content.classList.remove('is-visible'));
        tabContents.forEach(content => content.classList.add('d-none'));
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });
        targetContent.classList.remove('d-none');
        setTimeout(() => { targetContent.classList.add('is-visible'); }, 50);
        const activeLink = getNavItem(targetContent);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    }

    function applyTheme(isDark) {
        const body = document.body;
        if (isDark) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeToggle.checked = true; 
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeToggle.checked = false; 
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    }

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme === 'dark'); 
        themeToggle.addEventListener('change', () => applyTheme(themeToggle.checked));
    }

    function validateAndSetFile(file) {
        if (file) {
            const fileName = file.name.toLowerCase();
            const isSupported = supportedFormats.some(format => fileName.endsWith(format));
            if (isSupported) {
                currentSelectedFile = file;
                toastFileName.textContent = file.name;
                toastBootstrap.show();
                loadMediaAndShowScreen();
            } else {
                currentSelectedFile = null;
                showWarning("Unsupported Format", `File type "${file.type || 'unknown'}" is not supported.`);
            }
        }
    }

    mediaFileInput.addEventListener('change', (e) => validateAndSetFile(e.target.files[0]));
    browseFileBtn.addEventListener('click', () => mediaFileInput.click());
    dropZone.addEventListener('click', (e) => {
        if (e.target.id !== 'browseFileBtn') mediaFileInput.click();
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); }, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
    });
    dropZone.addEventListener('drop', (e) => {
        let files = e.dataTransfer.files;
        if (files.length > 0) validateAndSetFile(files[0]);
    }, false);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const clickedLink = e.currentTarget;
            const linkText = clickedLink.textContent.trim().replace(/\s{2,}/g, ' '); 
            const linkId = clickedLink.id;
            
            if (linkText === 'Home') showTab(homeContent);
            else if (linkText === 'Browse') showTab(browseContent);
            else if (linkText === 'Screen') {
                if (!currentSelectedFile) {
                    mediaPlayerContainer.innerHTML = defaultScreenMessage;
                    screenTitle.textContent = "Your Movie Screen";
                    closeMediaBtn.classList.add('d-none');
                }
                showTab(screenContent);
            }
            else if (linkText === 'GitHub') showTab(creditsContent);
        });
    });

    if (chooseMovieButton) chooseMovieButton.addEventListener('click', (e) => { e.preventDefault(); showTab(browseContent); });

    if (closeMediaBtn) {
        closeMediaBtn.addEventListener('click', () => {
            if (plyrInstance) {
                plyrInstance.destroy();
                plyrInstance = null;
            }
            if (currentSelectedFile) {
                const mediaElement = mediaPlayerContainer.querySelector('video, audio');
                if (mediaElement && mediaElement.src && mediaElement.src.startsWith('blob:')) {
                    URL.revokeObjectURL(mediaElement.src);
                }
            }
            currentSelectedFile = null;
            mediaFileInput.value = ''; 
            mediaPlayerContainer.innerHTML = defaultScreenMessage;
            screenTitle.textContent = "Your Movie Screen";
            closeMediaBtn.classList.add('d-none');
            addSubtitleBtn.classList.add('d-none');
            trackSettingsBtn.classList.add('d-none');
            showTab(browseContent);
        });
    }

    function loadMediaAndShowScreen() {
        const file = currentSelectedFile;
        if (!file) return; 
        
        if (plyrInstance) {
            plyrInstance.destroy();
            plyrInstance = null;
        }

        const fileURL = URL.createObjectURL(file);
        const fileType = file.type.startsWith('video/') ? 'video' : 'audio';

        mediaPlayerContainer.innerHTML = '<div class="spinner-border text-info" role="status"></div>'; 

        const mediaElement = document.createElement(fileType);
        mediaElement.src = fileURL;
        mediaElement.crossOrigin = "anonymous";
        mediaElement.playsInline = true; 
        
        mediaPlayerContainer.innerHTML = '';
        mediaPlayerContainer.appendChild(mediaElement);
        
        try {
            plyrInstance = new Plyr(mediaElement, {
                controls: [
                    'play-large', 'restart', 'rewind', 'play', 'fast-forward', 
                    'progress', 'current-time', 'duration', 'mute', 'volume', 
                    'settings', 'fullscreen', 'captions' 
                ],
                settings: ['captions', 'speed', 'loop'], 
                keyboard: { focused: true, global: true },
                autoplay: true,
                captions: { active: true, update: true, language: 'en' }
            });

            // --- TRACK DETECTION LOGIC (FIXED FOR LANGUAGE LABELLING) ---
            
            function updateSubtitleSelect() {
                subtitleTrackSelect.innerHTML = '';
                const tracks = mediaElement.textTracks;
                
                const noneOpt = document.createElement('option');
                noneOpt.value = -1;
                noneOpt.textContent = "Off";
                subtitleTrackSelect.appendChild(noneOpt);

                let hasTracks = false;
                for (let i = 0; i < tracks.length; i++) {
                    // Check specifically for Subtitle Type
                    if (tracks[i].kind === 'subtitles' || tracks[i].kind === 'captions') {
                        const opt = document.createElement('option');
                        opt.value = i;
                        // Requirement: Map label to Language key, donot use description
                        opt.textContent = tracks[i].language.toUpperCase() || `Track ${i + 1}`;
                        if (tracks[i].mode === 'showing') opt.selected = true;
                        subtitleTrackSelect.appendChild(opt);
                        hasTracks = true;
                    }
                }

                if (hasTracks) trackSettingsBtn.classList.remove('d-none');
            }

            mediaElement.addEventListener('loadedmetadata', () => {
                // Audio Tracks Extraction
                audioTrackSelect.innerHTML = '';
                const audioTracks = mediaElement.audioTracks;
                
                if (audioTracks && audioTracks.length > 0) {
                    for (let i = 0; i < audioTracks.length; i++) {
                        const opt = document.createElement('option');
                        opt.value = i;
                        // Requirement: Map label to Language key, ignore description
                        opt.textContent = audioTracks[i].language.toUpperCase() || `Audio ${i + 1}`;
                        if (audioTracks[i].enabled) opt.selected = true;
                        audioTrackSelect.appendChild(opt);
                    }
                    trackSettingsBtn.classList.remove('d-none');
                } else {
                    const opt = document.createElement('option');
                    opt.textContent = "Default Audio";
                    audioTrackSelect.appendChild(opt);
                }

                updateSubtitleSelect();
            });

            // Handle track changes
            audioTrackSelect.onchange = (e) => {
                const audioTracks = mediaElement.audioTracks;
                if (audioTracks) {
                    for (let i = 0; i < audioTracks.length; i++) {
                        audioTracks[i].enabled = (i == e.target.value);
                    }
                }
            };

            subtitleTrackSelect.onchange = (e) => {
                const tracks = mediaElement.textTracks;
                const val = parseInt(e.target.value);
                for (let i = 0; i < tracks.length; i++) {
                    tracks[i].mode = (i === val) ? 'showing' : 'hidden';
                }
                if (plyrInstance) plyrInstance.toggleCaptions(val !== -1);
            };

            trackSettingsBtn.onclick = () => trackModal.show();

            // --- EXTERNAL SUBTITLE LOGIC ---
            const srtInput = document.createElement('input');
            srtInput.type = 'file';
            srtInput.accept = '.srt';
            
            srtInput.addEventListener('change', (e) => {
                const srtFile = e.target.files[0];
                if (srtFile) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        const vttContent = srtToVtt(evt.target.result);
                        const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
                        const vttUrl = URL.createObjectURL(vttBlob);

                        const track = document.createElement('track');
                        track.kind = 'captions';
                        track.label = 'EXT: ' + srtFile.name;
                        track.srclang = 'en';
                        track.src = vttUrl;
                        track.default = true;

                        mediaElement.appendChild(track);
                        
                        setTimeout(() => {
                            plyrInstance.toggleCaptions(true);
                            updateSubtitleSelect(); 
                        }, 200);
                        
                        toastFileName.textContent = "Subs Added: " + srtFile.name;
                        toastBootstrap.show();
                    };
                    reader.readAsText(srtFile);
                }
            });

            addSubtitleBtn.onclick = () => srtInput.click();

            const titleText = file.name;
            if (titleText.length > 50) {
                screenTitle.classList.add('scrolling');
                screenTitle.innerHTML = `<span>${titleText}</span>`;
            } else {
                screenTitle.textContent = titleText;
                screenTitle.innerHTML = titleText;
            }

            closeMediaBtn.classList.remove('d-none'); 
            if (fileType === 'video') {
                addSubtitleBtn.classList.remove('d-none');
            }

            showTab(screenContent);
            
        } catch (error) {
             console.error("Plyr Initialization Error:", error);
             showTab(screenContent);
        }
    }
    
    showTab(homeContent); 
});