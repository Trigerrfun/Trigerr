document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Script Content ---
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const games = [
       { title: 'Rock Paper Scissors', icon: '✌️', rating: 4.5, url: './Rock-Paper-Scissor/', thumbnail: './images/rock-paper-scissors.png', isFavorite: false },
        { title: 'Perfect Circle', icon: '⚪', rating: 4.8, url: './CIRCLE/',thumbnail: './images/rock-paper-scissors.png', isFavorite: false },
        { title: 'Vegan Cobra', icon: '🐍', rating: 4.2, url: './Vegan-Cobra/', thumbnail: './images/rock-paper-scissors.png', isFavorite: false },
        { title: 'Mind Bender', icon: '🧩', rating: 4.6, url: '#',thumbnail: './images/rock-paper-scissors.png', isFavorite: false },
        { title: 'Project: Nexus', icon: '🔫', rating: 3.9, url: '#', thumbnail: './images/rock-paper-scissors.png', isFavorite: false },
        { title: 'Void: Construct', icon: '🧱', rating: 4.0, url: '#', thumbnail: './images/rock-paper-scissors.png', isFavorite: false },
        { title: 'Arcade Racer', icon: '🕹️', rating: 4.7, url: '#', thumbnail: './images/rock-paper-scissors.png', isFavorite: false },
        { title: 'Another Puzzle', icon: '🧠', rating: 4.3, url: '#',thumbnail: './images/rock-paper-scissors.png', isFavorite: false },
        { title: 'Tile Match', icon: '🀄', rating: 4.9, url: '#',thumbnail: './images/rock-paper-scissors.png', isFavorite: false },
        { title: 'Word Finder', icon: '✍️', rating: 4.4, url: '#',thumbnail: './images/rock-paper-scissors.png', isFavorite: false },
    ];

    const gameGrid = document.getElementById('new-game-grid');
    const searchInput = document.getElementById('searchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');

    // --- Modal Elements ---
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Function to render the star ratings
    const getStarRating = (rating) => {
        const fullStar = '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        const emptyStar = '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += i <= rating ? fullStar : emptyStar;
        }
        return starsHTML;
    };
    
    // Function to handle favoriting a game
    const toggleFavorite = (title) => {
        const game = games.find(g => g.title === title);
        if (game) {
            game.isFavorite = !game.isFavorite;
            // Re-render the games on the main page and in the modal if it's open
            renderGames(games, gameGrid);
            if (!modalOverlay.classList.contains('hidden') && modalTitle.textContent === 'Favorite Games') {
                renderFavoritesInModal();
            }
        }
    };

    // Function to render games in a specific grid
    const renderGames = (gamesToRender, gridElement) => {
        gridElement.innerHTML = '';
        if (gamesToRender.length === 0) {
            gridElement.innerHTML = `<p class="text-gray-500 col-span-full text-center">No games found.</p>`;
            return;
        }
        gamesToRender.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            const gameImage = game.thumbnail ? 
                `<img src="${game.thumbnail}" alt="${game.title} thumbnail" class="game-thumbnail">` : 
                `<div class="game-card-icon">${game.icon}</div>`;
            
            gameCard.innerHTML = `
                ${gameImage}
                <div class="game-card-content">
                    <h3 class="game-card-title">${game.title}</h3>
                    <div class="star-rating">
                        ${getStarRating(Math.round(game.rating))}
                        <span class="rating-text">${game.rating.toFixed(1)} / 5.0</span>
                    </div>
                    <button class="favorite-btn ${game.isFavorite ? 'favorite-btn-active' : ''}" data-title="${game.title}">
                        <svg class="w-6 h-6" fill="${game.isFavorite ? 'currentColor' : 'none'}" stroke="${game.isFavorite ? 'none' : 'currentColor'}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                    <a href="${game.url}" class="game-card-cta">
                        <span class="header-cta-btn text-sm">Play Now</span>
                    </a>
                </div>
            `;
            gameCard.querySelector('.favorite-btn').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(game.title);
            });
            gridElement.appendChild(gameCard);
        });
    };

    // Function to render favorites inside the modal
    const renderFavoritesInModal = () => {
        const filteredFavorites = games.filter(game => game.isFavorite);
        modalBody.innerHTML = '';
        if (filteredFavorites.length === 0) {
            modalBody.innerHTML = '<p class="text-gray-500 col-span-full text-center p-8">Your favorite games will appear here.</p>';
            return;
        }
        
        const favoritesGrid = document.createElement('div');
        favoritesGrid.className = 'new-game-grid';
        renderGames(filteredFavorites, favoritesGrid);
        modalBody.appendChild(favoritesGrid);
    };

    // Function to show the modal
    const showModal = (title, contentHTML) => {
        modalTitle.textContent = title;
        modalBody.innerHTML = contentHTML;
        modalOverlay.classList.remove('hidden');
    };

    // Event listeners for header buttons to open the modal
    document.getElementById('play-with-friends-btn').addEventListener('click', () => {
        const comingSoonHTML = `
            <div class="coming-soon-card relative overflow-hidden rounded-xl h-48 md:h-64 flex items-center justify-center m-4">
                <div class="coming-soon-overlay"></div>
                <div class="relative z-10 text-center">
                    <h3 class="text-2xl md:text-4xl font-bold text-white mb-2"></h3>
                    <p class="text-lg text-gray-400">Coming Soon</p>
                </div>
            </div>
        `;
        showModal('Play With Friends', comingSoonHTML);
    });

    document.getElementById('favorite-games-btn').addEventListener('click', () => {
        renderFavoritesInModal();
        showModal('Favorite Games', modalBody.innerHTML);
    });

    // Event listeners to close the modal
    modalCloseBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
    });

    // Event listeners for the search input
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        const filteredGames = games.filter(game =>
            game.title.toLowerCase().includes(query)
        );
        renderGames(filteredGames, gameGrid);
    };

    searchInput.addEventListener('keyup', handleSearch);
    
    // New code for mobile search functionality
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    const mobileSearchOverlay = document.getElementById('mobile-search-overlay');

    if (mobileSearchBtn && mobileSearchOverlay) {
        mobileSearchBtn.addEventListener('click', () => {
            mobileSearchOverlay.classList.toggle('hidden');
        });
    }
    
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keyup', handleSearch);
    }
    
    // Site logo click event
    const siteLogo = document.getElementById('site-logo');
    if (siteLogo) {
        siteLogo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initial render of all games on the main page
    renderGames(games, gameGrid);
});
