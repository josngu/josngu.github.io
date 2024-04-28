import * as game from './index.js';
import * as music from './music.js';
import * as gameboard from './gameboard.js';
import * as events from './events.js';
import * as sidebar from './sidebar.js';
export const progenitorDescriptions = {
    'Brahma': `The creator.
    - Start with 1 extra life
    - Start with 1 extra WP and 6 maxWP
    - Start with 1 random skill
    - Restore 10% HP after your turn`,
    'Vishnu': `The preserver.
    - Start with +25 maximum HP
    - Gain 10% resistance to all damage
    - You have a 15% chance to completely avoid damage
    - You gain 10% life steal on all attacks during the battle phase`,
    'Shiva': `The destroyer.
    - Start with an additional 10 base attack power
    - Start with an additional 3% crit chance
    - Start with a 1.75x crit damage multiplier (as oppose to 1.5x)
    - You have a 20% chance of doing an additional follow-up attack at 50% of your base attack power`,
};
export async function startGame() {
    document.getElementById('title-screen').style.animation = 'none';
    document.getElementById('title-screen').classList.add('animate-fullscreen-exit');
    await new Promise(resolve => setTimeout(resolve, 250));
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('player-setup').style.display = 'flex';
    addPlayer();
}
export async function showProgenitorSelectionMenu() {
    createPlayers();
    document.getElementById('player-setup').style.animation = 'none';
    document.getElementById('player-setup').classList.add('animate-fullscreen-exit');
    await new Promise(resolve => setTimeout(resolve, 250));
    document.getElementById('player-setup').style.display = 'none';
    document.getElementById('progenitor-selection-screen').style.display = 'flex';
    document.getElementById('progenitor-selection-title').innerHTML = `<span id="progenitor-player-name" style="background-color: ${game.gameState.playerList[game.gameState.currentPlayerNumber - 1].hexColor}">${game.gameState.currentPlayerName}</span>Select a Progenitor`;
    createPlayerCardsOrder();
}
// Actually begins the game lol
export async function beginGame() {
    document.getElementById('title-screen').remove();
    document.getElementById('player-setup').remove();
    document.getElementById('progenitor-selection-screen').remove();
    document.getElementById('gameboard').style.display = 'grid';
    document.getElementById('log').style.display = 'flex';
    await music.playMusic();
    // Loop through all players, look at their progenitor, and apply the effects
    await applyProjectorEffects();
    gameboard.createGameboard();
    gameboardCreatePlayerCards();
    gameboard.showPlayerCards();
    game.gameState.currentPlayerNumber = 1;
    game.gameState.currentPlayerName = game.gameState.playerList[0].playerName;
    document.getElementById('debug-menu').style.display = 'block';
}
// Adds a player to the player list on the main menu
export function addPlayer() {
    game.gameState.numberOfPlayers++;
    let playerName = `
        <div>
            <input type="text" id="player-${game.gameState.numberOfPlayers}" placeholder="Player ${game.gameState.numberOfPlayers}">
            <input type="color" id="player-color-${game.gameState.numberOfPlayers}" value="#FFFFFF">
        </div>
    `;
    document.getElementById('player-list').insertAdjacentHTML('beforeend', playerName);
}
export function createPlayers() {
    for (let i = 1; i <= game.gameState.numberOfPlayers; i++) {
        let playerName = document.getElementById(`player-${i}`).value;
        if (playerName == '') {
            playerName = `Player ${i}`;
        }
        let playerColor = document.getElementById(`player-color-${i}`).value;
        game.gameState.playerList.push({
            playerName: playerName,
            hexColor: playerColor,
            darkenedRGBColor: game.convertHexToRGBArray(game.darkenHexColor(playerColor, 80)),
            class: 'Pariah',
            progenitor: '',
            level: 1,
            lives: 9,
            spells: [],
            currentHp: 100,
            maxHp: 100,
            currentWp: 2,
            maxWp: 5,
            currentKarma: 0,
            maxKarma: 100,
            baseDamage: 10,
            critChance: 1,
            critDamageMultiplier: 1.5,
            attackFollowUpChance: 0,
            damageResistance: 0,
            evasionChance: 0,
            lifeSteal: 0,
            boardPosition: 1,
        });
        console.log(game.gameState.playerList[i - 1]);
    }
    game.gameState.playerList = game.shuffleArray(game.gameState.playerList);
    console.log(`The player order is: ${game.gameState.playerList.map(player => player.playerName).join(', ')}`);
    console.log(game.gameState.playerList);
    game.gameState.currentPlayerName = game.gameState.playerList[0].playerName;
}
// This runs after starting the game
async function applyProjectorEffects() {
    for (let i = 0; i < game.gameState.numberOfPlayers; i++) {
        let player = game.gameState.playerList[i];
        let progenitor = player.progenitor;
        switch (progenitor) {
            case 'Brahma':
                player.lives++;
                player.maxWp++;
                player.currentWp++;
                player.spells.push(await events.getRandomSpell());
                break;
            case 'Vishnu':
                player.maxHp += 25;
                player.currentHp += 25;
                player.damageResistance += 10; // Percentage
                player.evasionChance += 15;
                player.lifeSteal += 10; // Percentage
                break;
            case 'Shiva':
                player.baseDamage += 10;
                player.critChance += 3;
                player.critDamageMultiplier += 0.25;
                player.attackFollowUpChance += 20;
                break;
            default:
                player.progenitor = 'None';
                break;
        }
    }
}
function createPlayerCardsOrder() {
    //create player cards in the order of the player list
    for (let i = 1; i <= game.gameState.playerList.length; i++) {
        let playerCardHTML = `
            <div id="player-card-${i}" class="player-cards-setup" style="background-color: ${game.darkenHexColor(game.gameState.playerList[i - 1].hexColor, 80)}">
                <div>
                    <p id="order-number">${i}</p>
                    <div id="player-cards-title-${i}" class="player-cards-title">
                        <h3>${game.gameState.playerList[i - 1].playerName}</h3>
                        <p id="player-progenitor-${i}">No Progenitor</p>
                    </div>
                </div>
                <div class="player-cards-progenitor">
                    <img />
                </div>
            </div>`;
        document.getElementById('player-cards-setup-container').insertAdjacentHTML('beforeend', playerCardHTML);
    }
    // add a click event listener for each player card that calls progenitorScreenSelectPlayer()
    let playerCards = document.getElementsByClassName('player-cards-setup');
    for (let i = 0; i < playerCards.length; i++) {
        playerCards[i].addEventListener('click', progenitorScreenSelectPlayer);
    }
    progenitorScreenShowActivePlayerCard();
}
export function showHoveredProgenitor() {
    if (document.getElementById('progenitor-portrait')) {
        document.getElementById('progenitor-portrait').remove();
    }
    if (document.getElementById('progenitor-name')) {
        document.getElementById('progenitor-name').remove();
    }
    if (document.getElementById('progenitor-description')) {
        document.getElementById('progenitor-description').remove();
    }
    const PROGENITOR_THUMBNAIL = this.querySelector('img');
    const PROGENITOR_PORTRAIT_HTML = `
        <div id="progenitor-portrait">
            ${PROGENITOR_THUMBNAIL.outerHTML}
        </div>
    `;
    const PROGENITOR_NAME = PROGENITOR_THUMBNAIL.getAttribute('alt');
    const PROGENITOR_NAME_HTML = `<h3 id="progenitor-name">${PROGENITOR_NAME}</h3>`;
    const PROGENITOR_DESCRIPTION = progenitorDescriptions[PROGENITOR_NAME];
    const PROGENITOR_DESCRIPTION_HTML = `<pre id="progenitor-description">${PROGENITOR_DESCRIPTION}</pre>`;
    document.getElementById('progenitor-portrait-description-container').insertAdjacentHTML('afterbegin', PROGENITOR_NAME_HTML);
    document.getElementById('progenitor-name').insertAdjacentHTML('afterend', PROGENITOR_PORTRAIT_HTML);
    document.getElementById('progenitor-portrait').insertAdjacentHTML('afterend', PROGENITOR_DESCRIPTION_HTML);
}
export function selectProgenitor() {
    if (document.getElementById(`player-card-progenitor-${game.gameState.currentPlayerNumber}`)) {
        document.getElementById(`player-card-progenitor-${game.gameState.currentPlayerNumber}`).remove();
    }
    if (document.getElementById(`player-progenitor-${game.gameState.currentPlayerNumber}`)) {
        document.getElementById(`player-progenitor-${game.gameState.currentPlayerNumber}`).remove();
    }
    const PROGENITOR_NAME = this.querySelector('img').getAttribute('alt');
    const PROGENITOR_IMAGE_SOURCE = this.querySelector('img').getAttribute('src');
    game.getCurrentPlayer().progenitor = PROGENITOR_NAME;
    const PROGENITOR_IMAGE_HTML = `
        <div id="player-card-progenitor-${game.gameState.currentPlayerNumber}" class="player-cards-progenitor">
            <img src="${PROGENITOR_IMAGE_SOURCE}" alt="${PROGENITOR_NAME}">
        </div>
    `;
    const PROGENITOR_TEXT_HTML = `<p id="player-progenitor-${game.gameState.currentPlayerNumber}" class="player-cards-progenitor-name">${PROGENITOR_NAME}</p>`;
    document.getElementById(`player-card-${game.gameState.currentPlayerNumber}`).insertAdjacentHTML('beforeend', PROGENITOR_IMAGE_HTML);
    document.getElementById(`player-cards-title-${game.gameState.currentPlayerNumber}`).insertAdjacentHTML('beforeend', PROGENITOR_TEXT_HTML);
    // If there are still players left to select a progenitor, move on to the next player
    if (game.gameState.currentPlayerNumber < game.gameState.numberOfPlayers) {
        game.gameState.currentPlayerNumber++;
        game.gameState.currentPlayerName = game.gameState.playerList[game.gameState.currentPlayerNumber - 1].playerName;
        progenitorScreenShowActivePlayerCard();
        progenitorScreenReplaceCurrentPlayerName();
    }
}
// Used to select a player on the progenitor selection screen
function progenitorScreenSelectPlayer() {
    //Click on a player card to select it
    const playerCard = this;
    const playerCardNumber = playerCard.getAttribute('id').split('-')[2];
    game.gameState.currentPlayerNumber = parseInt(playerCardNumber);
    game.gameState.currentPlayerName = game.gameState.playerList[game.gameState.currentPlayerNumber - 1].playerName;
    //assign the class player-card-active to the selected player card
    progenitorScreenShowActivePlayerCard();
    //replace the title with the selected player's name
    progenitorScreenReplaceCurrentPlayerName();
}
function progenitorScreenShowActivePlayerCard() {
    const playerCards = document.getElementsByClassName('player-cards-setup');
    for (let i = 0; i < playerCards.length; i++) {
        playerCards[i].classList.remove('player-card-active');
    }
    document.getElementById(`player-card-${game.gameState.currentPlayerNumber}`).classList.add('player-card-active');
}
function progenitorScreenReplaceCurrentPlayerName() {
    document.getElementById('progenitor-selection-title').remove();
    document.getElementById('progenitor-selection-container')
        .insertAdjacentHTML('afterbegin', `<h1 id="progenitor-selection-title"><span id="progenitor-player-name" style="background-color: ${game.gameState.playerList[game.gameState.currentPlayerNumber - 1].hexColor}">
            ${game.gameState.currentPlayerName}
        </span>Select a Progenitor</h1>`);
}
// For the gameboard
function gameboardCreatePlayerCards() {
    for (let i = 1; i <= game.gameState.numberOfPlayers; i++) {
        drawPlayerPosition(i, game.gameState.playerList[i - 1].hexColor);
        let playerHTML = `
        <div class="player-card" id="player-card-${i}" style="background: linear-gradient(90deg, rgba(0, 0, 0, 0) 8px, ${game.darkenHexColor(game.gameState.playerList[i - 1].hexColor, 80)} 20%, rgba(0, 0, 0, 0));">
                <div class="player-title">
                    <h3 id="player-name-${i}">${game.gameState.playerList[i - 1].playerName}</h3>
                    <p id="player-lives-current-${i}">❤️x${game.gameState.playerList[i - 1].lives}</p>
                </div>
                <div class="secondary-player-info">
                    <p id="player-class-${i}" class="player-class-name">Pariah</p>
                    <div class="player-wp-container">
                        <p id="player-wp-current-${i}">
                            <span class="wp-orb-filled"></span>
                            <span class="wp-orb-filled"></span>
                            ${game.gameState.playerList[i - 1].progenitor === 'Brahma' ? '<span class="wp-orb-filled"></span>' : ''}
                            <span class="wp-orb-empty"></span>
                            <span class="wp-orb-empty"></span>
                            <span class="wp-orb-empty"></span>
                        </p>
                        <h4>WP</h4>
                    </div>
                </div>
                <div class="player-hp-container">
                    <div class="player-hp">
                        <h4>HP</h4>
                        <div>
                            <span id="player-hp-${i}">${game.gameState.playerList[i - 1].currentHp}</span>
                            <span>/</span>
                            <span id="player-maxHp-${i}">${game.gameState.playerList[i - 1].maxHp}</span>
                        </div>
                    </div>
                    <div id='player-hp-bar-container-${i}' class="player-hp-bar-container">
                        <div class="player-hp-bar" id="player-hp-bar-${i}"></div>
                    </div>
                </div>
                <!--
                <div class="player-sp-container">
                    <div class="player-sp">
                        <h4>SP</h4>
                        <p id="player-sp-${i}">50 / 50</p>
                    </div>
                    <div class="player-sp-bar-container">
                        <div class="player-sp-bar" id="player-sp-bar-${i}"></div>
                    </div>
                </div>
                -->
                <div class="player-karma-container">
                    <div class="player-karma">
                        <h4>Karma</h4>
                        <div>
                            <span id="player-karma-${i}">${game.gameState.playerList[i - 1].currentKarma}</span>
                            <span>/</span>
                            <span id="player-maxKarma-${i}">${game.gameState.playerList[i - 1].maxKarma}</span>
                        </div>
                    </div>
                    <div class="player-karma-bar-container">
                        <div class="player-karma-bar" id="player-karma-bar-${i}"></div>
                    </div>
                </div>
                <!--
                <div class="player-lives-container">
                    <h4>Lives</h4>
                    <p id="player-lives-current-${i}">❤️x${game.gameState.playerList[i - 1].lives}</p>
                </div>
                -->
            </div>
        `;
        document.getElementById('player-cards').innerHTML += playerHTML;
    }
    game.log(`The player order is: ${game.gameState.playerList.map(player => player.playerName).join(', ')}`);
    game.gameState.currentPlayerName = game.gameState.playerList[0].playerName;
    gameboard.animateGameboardTiles();
    setTimeout(() => {
        game.createTransition(`GAME START`, game.TRANSITION_SCREEN_BG_RGB_COLOR);
    }, 1200);
    setTimeout(() => {
        game.createTransition(`Turn ${game.gameState.turn.toString()}`, game.TRANSITION_SCREEN_BG_RGB_COLOR);
        game.log(`Turn ${game.gameState.turn.toString()}`);
    }, 2400);
    setTimeout(() => {
        game.createTransition(`${game.gameState.currentPlayerName}'s Turn`, game.getCurrentPlayer().darkenedRGBColor);
        game.log(`${game.gameState.currentPlayerName}'s Turn`, game.getCurrentPlayer().hexColor);
        gameboard.showActivePlayer();
        sidebar.showSidebar();
    }, 3600);
    setTimeout(() => {
        game.enableButton('btn-roll-dice');
    }, 4800);
}
function createFooterPlayerCard(i) {
    let footerPlayerCardHTML = `
        <div class='player-card-footer' id='player-card-footer-${1}'>
            <div id='player-card-footer-
        </div>
    `;
}
function drawPlayerPosition(playerIndex, playerColor) {
    document.getElementById('tile-1').innerHTML += `
        <div id="player-token-${playerIndex}" style="background: ${playerColor}" class="player-token"></div>`;
}
//# sourceMappingURL=main-menu.js.map