document.addEventListener('DOMContentLoaded', () => {

    // === CONFIGURATION ===
    const ADSTERRA_DIRECT_LINK = "https://politicsgrowinghollow.com/hxbkvsvx3q?key=57ca02e3d2bc5896bb2071c9b13a6904"; // IMPORTANT: PASTE YOUR LINK
    const COUNTDOWN_SECONDS = 10;

    // === DOM ELEMENTS ===
    const musicListContainer = document.getElementById('music-list');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const searchBar = document.getElementById('search-bar');
    const loadingIndicator = document.getElementById('loading-indicator');
    const playerContainer = document.getElementById('audio-player-container');
    const mainAudioPlayer = document.getElementById('main-audio-player');
    const playerArt = document.getElementById('player-art');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');

    // === STATE VARIABLES ===
    let currentlyPlayingCard = null;

    // === INITIALIZATION ===
    function initialize() {
        renderFilterButtons();
        renderMusicList(musicData);
        addEventListeners();
    }

    // === RENDER FUNCTIONS (Unchanged from before) ===
    function createMusicCard(track) { /* ... Same as before ... */ }
    function renderMusicList(tracks) { /* ... Same as before ... */ }
    function renderFilterButtons() { /* ... Same as before ... */ }
    function playTrack(trackId, audioSrc) { /* ... Same as before ... */ }

    // === EVENT LISTENERS & HANDLERS ===
    function addEventListeners() {
        musicListContainer.addEventListener('click', handleCardClick);
        categoryFiltersContainer.addEventListener('click', handleFilterClick);
        searchBar.addEventListener('input', handleSearch);
    }

    // ** CHANGED: This function now handles all button states **
    function handleCardClick(event) {
        const target = event.target;

        // Handle Preview Button
        const playBtn = target.closest('.btn-preview');
        if (playBtn) {
            playTrack(playBtn.dataset.trackId, playBtn.dataset.audioSrc);
            return;
        }

        // Handle the multi-state Unlock/Download button
        const actionBtn = target.closest('.btn-unlock');
        if (actionBtn) {
            // Check if it's the "Download Now" state
            if (actionBtn.classList.contains('ready-to-download')) {
                handleDownloadNow(actionBtn);
            } 
            // Check if it's the initial "Unlock Download" state
            else if (!actionBtn.disabled) { // Make sure it's not already counting down
                initiateUnlockSequence(actionBtn);
            }
        }
    }

    function handleFilterClick(event) { /* ... Same as before ... */ }
    function handleSearch(event) { /* ... Same as before ... */ }
    
    // === CORE LOGIC ===

    // ** NEW: Handles the "Unlock Download" button click **
    function initiateUnlockSequence(button) {
        // 1. IMMEDIATELY open the ad link in a new tab
        window.open(ADSTERRA_DIRECT_LINK, '_blank');

        button.disabled = true;
        let countdown = COUNTDOWN_SECONDS;

        // 2. Start the countdown on the original page
        const interval = setInterval(() => {
            button.innerHTML = `<i class="bi bi-hourglass-split"></i> Ready in ${countdown}...`;
            countdown--;

            if (countdown < 0) {
                clearInterval(interval);
                
                // 3. Change button to "Download Now" state
                button.disabled = false;
                button.classList.add('ready-to-download');
                button.innerHTML = `<i class="bi bi-download"></i> Download Now`;
            }
        }, 1000);
    }

    // ** NEW: Handles the "Download Now" button click **
    function handleDownloadNow(button) {
        const downloadLink = button.dataset.downloadLink;
        const trackTitle = button.dataset.trackTitle;

        // Trigger the file download
        triggerDownload(downloadLink, trackTitle);

        // Reset the button to its original "Unlock Download" state
        button.classList.remove('ready-to-download');
        button.innerHTML = `<i class="bi bi-unlock-fill"></i> Unlock Download`;
    }

    // Helper function to trigger the browser's download functionality
    function triggerDownload(url, filename) {
        try {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Download failed. Please try again or check your browser settings.");
        }
    }

    function filterAndRender(category, query) { /* ... Same as before ... */ }
    
    // --- Start the application ---
    initialize();

    // The rest of the functions are pasted here for completeness, no changes needed in them.
    function createMusicCard(track) {
    return `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div class="card music-card" data-track-id="${track.id}">
                <div class="card-top">
                    <img src="${track.imageSrc}" class="track-art" alt="${track.title}">
                    <div class="track-info">
                        <h5 class="card-title text-truncate" title="${track.title}">${track.title}</h5>
                        
                        <p class="card-text text-white-50">${track.artist}</p>
                        <span class="badge rounded-pill category-badge">${track.category}</span>
                    </div>
                </div>
                <div class="d-grid gap-2 mt-auto">
                    <button class="btn btn-sm btn-preview" data-audio-src="${track.audioSrc}" data-track-id="${track.id}">
                        <i class="bi bi-play-fill"></i> Preview
                    </button>
                    <button class="btn btn-sm btn-unlock" data-download-link="${track.downloadLink}" data-track-title="${track.title}">
                        <i class="bi bi-unlock-fill"></i> Unlock Download
                    </button>
                </div>
            </div>
        </div>
    `;
}
    function renderMusicList(tracks) {
        loadingIndicator.style.display = 'none';
        musicListContainer.innerHTML = '';
        if (tracks.length === 0) {
            musicListContainer.innerHTML = '<div class="col-12"><p class="text-center text-white-50 fs-5 mt-4">No tracks found matching your criteria.</p></div>';
            return;
        }
        const cardsHtml = tracks.map(track => createMusicCard(track)).join('');
        musicListContainer.innerHTML = cardsHtml;
    }
    function renderFilterButtons() {
        const categories = ['All', 'Featured', ...new Set(musicData.map(t => t.category)), 'Random'];
        categoryFiltersContainer.innerHTML = categories.map(cat => 
            `<button class="btn filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>`
        ).join('');
    }
    function playTrack(trackId, audioSrc) {
        const track = musicData.find(t => t.id == trackId);
        if (!track) return;
        playerContainer.style.display = 'flex';
        playerArt.src = track.imageSrc;
        playerTitle.textContent = track.title;
        playerArtist.textContent = track.artist;
        mainAudioPlayer.src = audioSrc;
        mainAudioPlayer.play();
        if (currentlyPlayingCard) {
            currentlyPlayingCard.classList.remove('playing');
        }
        currentlyPlayingCard = document.querySelector(`.music-card[data-track-id="${trackId}"]`);
        if (currentlyPlayingCard) {
            currentlyPlayingCard.classList.add('playing');
        }
    }
    function handleFilterClick(event) {
        if (event.target.tagName !== 'BUTTON') return;
        const category = event.target.dataset.category;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        filterAndRender(category, searchBar.value);
    }
    function handleSearch(event) {
        const query = event.target.value;
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        filterAndRender(activeCategory, query);
    }
    function filterAndRender(category, query) {
        let filteredTracks = musicData;
        if (category && category !== 'All') {
            if (category === 'Featured') filteredTracks = filteredTracks.filter(t => t.isFeatured);
            else if (category === 'Random') filteredTracks = [...filteredTracks].sort(() => 0.5 - Math.random());
            else filteredTracks = filteredTracks.filter(t => t.category === category);
        }
        if (query) {
            const lowerCaseQuery = query.toLowerCase();
            filteredTracks = filteredTracks.filter(t => 
                t.title.toLowerCase().includes(lowerCaseQuery) ||
                t.artist.toLowerCase().includes(lowerCaseQuery)
            );
        }
        renderMusicList(filteredTracks);
    }
});