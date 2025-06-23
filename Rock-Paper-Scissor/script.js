// --- DOM Elements ---
// Welcome Screen
const welcomeScreen = document.getElementById('welcome-screen');
const playerNameInput = document.getElementById('player-name-input');
const seriesLengthSelect = document.getElementById('series-length-select');
const startGameBtn = document.getElementById('start-game-btn');

// Game Screen
const gameContainer = document.getElementById('game-container');
const playerNameDisplayGame = document.getElementById('player-name-display-game');
const playerHandDiv = document.getElementById('player-hand');
const playerHandImg = document.getElementById('player-hand-img');
const computerHandDiv = document.getElementById('computer-hand');
const computerHandImg = document.getElementById('computer-hand-img');
const gameMessage = document.getElementById('game-message');
const choicesContainer = document.getElementById('choices-container');
const choiceButtons = document.querySelectorAll('.choice-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const playerScoreSpan = document.getElementById('player-score');
const computerScoreSpan = document.getElementById('computer-score');
const tieScoreSpan = document.getElementById('tie-score');

// Elements for series score
const playerSeriesWinsSpan = document.getElementById('player-series-wins');
const computerSeriesWinsSpan = document.getElementById('computer-series-wins');
const currentSeriesLengthSpan = document.getElementById('current-series-length');

// New elements for visual/audio enhancements and overlay buttons
const impactEffectDiv = document.getElementById('impact-effect');
const gameOverOverlay = document.getElementById('game-over-overlay');
const overlayMessage = document.getElementById('overlay-message');
const replaySeriesBtn = document.getElementById('replay-series-btn');
const mainMenuBtn = document.getElementById('main-menu-btn');


// Elements for sounds and effects
const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const errorSound = document.getElementById('error-sound');
const soundToggleButton = document.getElementById('sound-toggle-btn');
const shareButton = document.getElementById('share-btn');
const confettiContainer = document.getElementById('confetti-container');
const countdownSound = document.getElementById('countdown-sound');
const impactSound = document.getElementById('impact-sound');
const gameOverSound = document.getElementById('game-over-sound');


// Favicon
const faviconLink = document.getElementById('favicon-link');
const faviconImages = ['Rock.png', 'Paper.png', 'Scissors.png'];
let currentFaviconIndex = 0;
let faviconIntervalId;

// --- Game Variables ---
let playerName = "Player";
let playerScore = 0;
let computerScore = 0;
let tieScore = 0;

let playerSeriesWins = 0;
let computerSeriesWins = 0;
let seriesLength = 3;
let roundsPlayed = 0;

const choices = ['rock', 'paper', 'scissors'];
let isSoundEnabled = true;

// Mapping for image files
const choiceImageMap = {
    'rock': 'Rock.png',
    'paper': 'Paper.png',
    'scissors': 'Scissors.png'
};

// --- Functions ---

// Favicon animation
function changeFavicon() {
    faviconLink.href = faviconImages[currentFaviconIndex];
    currentFaviconIndex = (currentFaviconIndex + 1) % faviconImages.length;
}

// Get computer's random choice
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Determine the winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    } else {
        return 'lose';
    }
}

// --- Audio Functions ---
function playSound(audioElement) {
    if (isSoundEnabled) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.error("Audio playback failed:", e));
    }
}

function playClickSound() {
    playSound(clickSound);
}

function playWinSound() {
    playSound(winSound);
}

function playErrorSound() {
    playSound(errorSound);
}

function playCountdownSound() {
    playSound(countdownSound);
}

function playImpactSound() {
    playSound(impactSound);
}

function playGameOverSound() {
    playSound(gameOverSound);
}

// --- Sound Toggle Function ---
function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
        soundToggleButton.innerHTML = '&#128266;'; /* Speaker with sound */
        soundToggleButton.classList.add('on');
    } else {
        soundToggleButton.innerHTML = '&#128263;'; /* Speaker mute */
        soundToggleButton.classList.remove('on');
    }
}

// --- Confetti Effect ---
function triggerConfetti() {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f', '#f80', '#80f'];
    const numConfetti = 50;

    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.animationDuration = `${2 + Math.random() * 1}s`;
        confetti.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
        confetti.style.borderRadius = `${Math.random() > 0.5 ? '50%' : '0'}`;

        confettiContainer.appendChild(confetti);

        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }
}

// --- Share Function ---
function shareGame() {
    const shareData = {
        title: 'Rock Paper Scissors Game',
        text: `I just played Rock Paper Scissors! Can you beat my high score? Try it out!`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Game shared successfully'))
            .catch((error) => console.error('Error sharing game:', error));
    } else {
        // Fallback for browsers that do not support navigator.share
        const dummyElement = document.createElement('textarea');
        document.body.appendChild(dummyElement);
        dummyElement.value = shareData.url;
        dummyElement.select();
        document.execCommand('copy');
        document.body.removeChild(dummyElement);
        alert('Game link copied to clipboard! You can paste it to share.');
    }
}

// --- Core Game Round Logic after countdown ---
function executeRoundLogic(playerChoice) {
    const computerChoice = getComputerChoice();

    playerHandImg.src = choiceImageMap[playerChoice];
    computerHandImg.src = choiceImageMap[computerChoice];

    // Apply reveal animation
    playerHandDiv.style.animation = 'handReveal 0.5s ease-out forwards';
    computerHandDiv.style.animation = 'handReveal 0.5s ease-out forwards';

    // Trigger impact effect when hands clash
    impactEffectDiv.style.animation = 'none'; // Reset animation
    void impactEffectDiv.offsetWidth; // Trigger reflow
    impactEffectDiv.style.animation = 'impact-burst 0.3s ease-out forwards';
    playImpactSound(); // Play impact sound

    const result = determineWinner(playerChoice, computerChoice);
    roundsPlayed++;

    if (result === 'win') {
        playerScore++;
        gameMessage.textContent = `${playerName} Wins Round!`;
        gameMessage.classList.add('win');
        playWinSound();
    } else if (result === 'lose') {
        computerScore++;
        gameMessage.textContent = `Computer Wins Round!`;
        gameMessage.classList.add('lose');
        playErrorSound(); // Play a sound for losing
    } else {
        tieScore++;
        gameMessage.textContent = `It's a Tie!`;
        gameMessage.classList.add('tie');
    }

    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;
    tieScoreSpan.textContent = tieScore;

    setTimeout(() => {
        const targetWins = Math.ceil(seriesLength / 2);
        let seriesWinner = null;

        if (playerScore >= targetWins) {
            seriesWinner = 'player';
            playerSeriesWins++;
        } else if (computerScore >= targetWins) {
            seriesWinner = 'computer';
            computerSeriesWins++;
        }

        if (seriesWinner) {
            // Show full screen game over overlay
            gameOverOverlay.classList.add('visible');
            // Ensure overlay buttons are visible
            replaySeriesBtn.style.display = 'block';
            mainMenuBtn.style.display = 'block';

            if (seriesWinner === 'player') {
                overlayMessage.innerHTML = `${playerName} WINS THE SERIES! &#127881;`;
                overlayMessage.classList.add('win-color');
                playWinSound();
                triggerConfetti();
            } else {
                overlayMessage.innerHTML = `COMPUTER WINS THE SERIES! &#128128;`;
                overlayMessage.classList.add('lose-color');
                playGameOverSound(); // Play game over sound for loss
            }
            overlayMessage.style.animation = 'none'; // Reset animation
            void overlayMessage.offsetWidth; // Trigger reflow
            overlayMessage.style.animation = 'overlay-text-in 0.8s ease-out forwards';

            // Update series wins display
            playerSeriesWinsSpan.textContent = playerSeriesWins;
            computerSeriesWinsSpan.textContent = computerSeriesWins;

            // Reset round scores for the next series, but keep series scores
            playerScore = 0;
            computerScore = 0;
            tieScore = 0;
            roundsPlayed = 0;

        } else {
            // Continue to next round in series
            gameMessage.textContent = `Round Over. Select Next Weapon!`;
            gameMessage.classList.add(result);
            playAgainBtn.textContent = 'Play Next Round';
            playAgainBtn.style.display = 'block';
        }
    }, 500); // Duration of reveal animation
}


// --- Main Play Round function (with countdown) ---
function playRound(playerChoice) {
    choicesContainer.classList.add('hidden');
    playAgainBtn.style.display = 'none'; // Hide "Play Next Round" button

    gameMessage.classList.remove('win', 'lose', 'tie', 'series-end'); // Clear all previous stylings

    playerHandImg.src = choiceImageMap['rock'];
    computerHandImg.src = choiceImageMap['rock'];

    playerHandDiv.classList.remove('hidden');
    computerHandDiv.classList.remove('hidden');

    // Initial shake animation for countdown
    playerHandDiv.style.animation = 'handShakePlayer 0.5s infinite alternate';
    computerHandDiv.style.animation = 'handShakeComputer 0.5s infinite alternate';

    let countdown = 3;
    gameMessage.textContent = `Ready? ${countdown}...`;
    gameMessage.classList.add('countdown-animate'); // Add class for countdown animation
    playCountdownSound();

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            gameMessage.textContent = `${countdown}...`;
            gameMessage.style.animation = 'none'; // Reset animation
            void gameMessage.offsetWidth; // Trigger reflow
            gameMessage.style.animation = 'countdown-pulse 0.8s ease-out forwards, countdown-color 0.8s ease-out forwards';
            playCountdownSound();
        } else if (countdown === 0) {
            gameMessage.textContent = `GO!`;
            gameMessage.style.animation = 'none'; // Reset animation
            void gameMessage.offsetWidth; // Trigger reflow
            gameMessage.style.animation = 'countdown-pulse 0.8s ease-out forwards, countdown-color 0.8s ease-out forwards';
            playCountdownSound();
        } else {
            clearInterval(countdownInterval);
            gameMessage.classList.remove('countdown-animate'); // Remove countdown animation class
            playerHandDiv.style.animation = 'none'; // Stop shake animation
            computerHandDiv.style.animation = 'none';
            executeRoundLogic(playerChoice); // Execute actual round logic after countdown
        }
    }, 800);
}

// Reset game state for next round or new series
function resetGameArea() {
    playerHandDiv.classList.add('hidden');
    computerHandDiv.classList.add('hidden');
    playerHandDiv.style.animation = 'none';
    computerHandDiv.style.animation = 'none';

    choicesContainer.classList.remove('hidden');
    playAgainBtn.style.display = 'none';
    gameMessage.textContent = 'Select your Weapon';
    gameMessage.classList.remove('win', 'lose', 'tie', 'series-end', 'countdown-animate'); // Clear all result stylings and countdown class
    impactEffectDiv.style.animation = 'none'; // Clear any lingering impact effect

    // Ensure overlay buttons are hidden when game area is reset
    replaySeriesBtn.style.display = 'none';
    mainMenuBtn.style.display = 'none';
}

function resetAllScoresAndSeries() {
    playerScore = 0;
    computerScore = 0;
    tieScore = 0;
    playerSeriesWins = 0;
    computerSeriesWins = 0;
    roundsPlayed = 0;
    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;
    tieScoreSpan.textContent = tieScore;
    playerSeriesWinsSpan.textContent = playerSeriesWins;
    computerSeriesWinsSpan.textContent = computerSeriesWins;
    resetGameArea();
}

// --- Event Listeners ---
startGameBtn.addEventListener('click', () => {
    const inputName = playerNameInput.value.trim();
    if (inputName) {
        playerName = inputName;
    } else {
        playerName = "Challenger";
    }
    playerNameDisplayGame.textContent = playerName;

    seriesLength = parseInt(seriesLengthSelect.value);
    currentSeriesLengthSpan.textContent = seriesLength;

    welcomeScreen.style.display = 'none';
    gameContainer.style.display = 'flex';

    faviconIntervalId = setInterval(changeFavicon, 2000);
    resetAllScoresAndSeries();
});

choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Only allow choices if game over overlay is NOT visible and game is ready for input
        if (!gameOverOverlay.classList.contains('visible') && gameMessage.textContent.includes("Select your Weapon")) {
            playClickSound();
            const playerChoice = button.id;
            playRound(playerChoice);
        } else if (gameOverOverlay.classList.contains('visible')) {
            // Do nothing if game over overlay is visible, user must click replay/menu button
        } else {
            // This case means a round is in progress (e.g., during countdown or hand reveal)
            // Optionally, provide feedback: gameMessage.textContent = "Round in progress!";
        }
    });
});

playAgainBtn.addEventListener('click', () => {
    // This button is only for "Play Next Round" within an ongoing series
    resetGameArea();
});

// Event listener for the "Play Again" button on the OVERLAY (Replay Series)
replaySeriesBtn.addEventListener('click', () => {
    gameOverOverlay.classList.remove('visible'); // Hide the overlay
    // Game container remains visible, just reset the scores for a new series
    resetAllScoresAndSeries(); // Reset all scores for a brand new series, keeping current player/series length
});

// Event listener for the "Main Menu" button on the OVERLAY
mainMenuBtn.addEventListener('click', () => {
    gameOverOverlay.classList.remove('visible'); // Hide the overlay
    gameContainer.style.display = 'none'; // Hide the game screen
    welcomeScreen.style.display = 'flex'; // Show the welcome screen
    resetAllScoresAndSeries(); // Reset all scores for a brand new game
});

soundToggleButton.addEventListener('click', toggleSound);
shareButton.addEventListener('click', shareGame);

// --- Initial Setup ---
// Replace unicode icons with actual emojis for better compatibility and visual appeal
soundToggleButton.innerHTML = '&#128266;'; // Speaker with sound emoji
shareButton.innerHTML = '&#128279;'; // Link emoji

soundToggleButton.classList.add('on');

currentSeriesLengthSpan.textContent = seriesLengthSelect.value;