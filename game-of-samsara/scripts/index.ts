import * as music from './music.js';
import * as gameboard from './gameboard.js';
import * as mainMenu from './main-menu.js';
import * as events from './events.js';
import * as sidebar from './sidebar.js';

interface GameState {
    numberOfPlayers: number,
    turn: number,
    currentPlayerName: string,
    currentPlayerNumber: number,
    playerList: PlayerList[],
    hasUsedSpell: boolean,
}

interface PlayerList {
    playerName: string,
    hexColor: string,
    darkenedRGBColor: [number, number, number],
    class: string,
    progenitor: string,
    level: number,
    lives: number,
    spells: events.Spell[],
    currentHp: number,
    maxHp: number,
    currentWp: number,
    maxWp: number,
    currentKarma: number,
    maxKarma: number,
    baseDamage: number,
    critChance: number,
    critDamageMultiplier: number,
    attackFollowUpChance: number,
    lifeSteal: number,
    damageResistance: number,
    evasionChance: number,
    boardPosition: number,
}

interface ProgenitorAbilities {
    name: string,
    effect: events.EffectChanges,
}
// Global variables
export let gameState: GameState = {
    numberOfPlayers: 0,
    turn: 1,
    currentPlayerName: '',
    currentPlayerNumber: 1,
    playerList: [],
    hasUsedSpell: false,
};

export const TRANSITION_SCREEN_BG_RGB_COLOR: [number, number, number] = [0, 0, 0];

window.onload = async () => {
    document.addEventListener('mouseover', function (event) {
        if ((event.target as HTMLElement).tagName === 'BUTTON') {
            music.playButtonHoverSound();
        }
    });
    document.addEventListener('click', function (event) {
        if ((event.target as HTMLElement).tagName === 'BUTTON') {
            music.playButtonSelectSound();
        }
    });

    document.getElementById('title-screen').style.display = 'flex';
    // Add event listeners
    document.getElementById('btn-crossfade').addEventListener('click', await music.crossFadeMusic);
    document.getElementById('btn-start').addEventListener('click', mainMenu.startGame);
    document.getElementById('btn-select-progenitor').addEventListener('click', mainMenu.showProgenitorSelectionMenu);
    document.getElementById('btn-begin-game').addEventListener('click', mainMenu.beginGame);
    document.getElementById('btn-add-player').addEventListener('click', mainMenu.addPlayer);

    // Progenitor selection screen

    //loop through progenitor-thumbails and add event listeners
    let progenitorThumbnails = document.getElementsByClassName('progenitor-thumbnail');
    for (let i = 0; i < progenitorThumbnails.length; i++) {
        progenitorThumbnails[i].addEventListener('mouseenter', mainMenu.showHoveredProgenitor);
        progenitorThumbnails[i].addEventListener('click', mainMenu.selectProgenitor);
    }

    document.getElementById('gameboard').addEventListener('wheel', gameboard.zoomGameboard, { passive: true });

    document.getElementById('btn-roll-dice').addEventListener('click', () => { gameboard.rollDice(0) });
    disableButton('btn-roll-dice');

    // Event listeners for the sidebar
    document.getElementById('btn-player-spells-page').addEventListener('click', () => {
        music.playPreviousPageSound();
        sidebar.showSpells();
    });

    document.getElementById('btn-player-stats-page').addEventListener('click', () => {
        music.playNextPageSound();
        sidebar.showStats();
    });

    // Debug
    document.getElementById('btn-advance-turn').addEventListener('click', () => {
        gameState.turn++;
        createTransition(`Turn ${gameState.turn.toString()}`, TRANSITION_SCREEN_BG_RGB_COLOR);
    });
    document.getElementById('btn-show-player-objects').addEventListener('click', () => {
        console.log(gameState.playerList);
    });

    document.getElementById('btn-reincarnate-player').addEventListener('click', reincarnatePlayer);

    document.getElementById('btn-subtract-health').addEventListener('click', async () => {
        getCurrentPlayer().currentHp -= 5;
        await checkStatBounds(true);
    });

    document.getElementById('btn-add-health').addEventListener('click', async () => {
        getCurrentPlayer().currentHp += 5;
        await checkStatBounds(true);
    });

    document.getElementById('btn-add-karma').addEventListener('click', async () => {
        getCurrentPlayer().currentKarma += 5;
        await checkStatBounds(true);
    });

    document.getElementById('btn-add-spell').addEventListener('click', async () => {
        getCurrentPlayer().spells.push(await events.getRandomSpell());
        updateVisualPlayerStats(false);
    });

    document.getElementById('btn-subtract-life').addEventListener('click', () => {
        getCurrentPlayer().lives--;
        updateVisualPlayerStats(false);
    });
}

export async function createTransition(message: string, color: [number, number, number], duration?: number) {
    try {
        document.getElementById('transition-screen').remove();
    } catch (e) { }

    const COLOR = `
        linear-gradient(90deg,
            rgb(${color[0]}, ${color[1]}, ${color[2]}, 0) 0%,
            rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.75) 25%,
            rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.75) 50%,
            rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.75) 75%,
            rgb(${color[0]}, ${color[1]}, ${color[2]}, 0) 100%)`;

    const TRANSITION_MESSAGE = `
    <div style='background: ${COLOR}' id="transition-screen">
        <h1 id="transition-screen-message">${message}</h1>
    </div>`
    document.body.insertAdjacentHTML('afterbegin', TRANSITION_MESSAGE);
    await new Promise(resolve => setTimeout(resolve, duration || 0));
}

// This function will probably not be used
export async function createDialogBox(message: string, color?: [number, number, number]) {
    return new Promise<void>(async (resolve) => {
        //const COLOR = `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
        const COLOR = `rgb(0, 0, 0, 0.5)`;
        const DIALOG_BOX = `
    <div id="dialog-box" class="animate-dialog-box-enter" style="background-color: ${COLOR}">
        <p>${message}</p>
        <button id='btn-dialog-box'>OK</button>
    </div>`;
        document.body.insertAdjacentHTML('afterbegin', DIALOG_BOX);

        document.getElementById('btn-dialog-box').addEventListener('click', () => {
            document.getElementById('dialog-box').classList.add('animate-dialog-box-exit');
            // remove the dialog box after the animation duration
            setTimeout(() => {
                document.getElementById('dialog-box').remove();
                resolve();
            }, getAnimationDuration('animate-dialog-box-exit'));
        });
    });


}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getCurrentPlayer() {
    return gameState.playerList[gameState.currentPlayerNumber - 1];
}

export function log(message: string, accentColor?) {
    let messageHTML = `<p style="border-left: 4px solid ${accentColor}">${message}</p>`
    document.getElementById('log').insertAdjacentHTML('afterbegin', messageHTML);
}

export function disableButton(buttonID: string) {
    $(`#${buttonID}`).addClass('btn-disabled');
    $(`#${buttonID}`).prop('disabled', true);
}

export function enableButton(buttonID: string) {
    $(`#${buttonID}`).removeClass('btn-disabled');
    $(`#${buttonID}`).prop('disabled', false);
}


export function darkenHexColor(hex: string, percent: number) {
    // Ensure percent is within the range [0, 100]
    percent = Math.min(100, Math.max(0, percent));

    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Darken the RGB values
    r = Math.round(r * (100 - percent) / 100);
    g = Math.round(g * (100 - percent) / 100);
    b = Math.round(b * (100 - percent) / 100);

    // Convert back to hex
    const darkenedHex = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
    return darkenedHex;
}

export function convertHexToRGBArray(hex: string) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    return [r, g, b];
}

export function getAnimationDuration(className: string) {
    let duration = window.getComputedStyle(document.querySelector(`.${className}`)).getPropertyValue('animation-duration');
    return parseFloat(duration) * 1000;
}

// Only used for natural reincarnations
export async function reincarnatePlayer() {
    const CURRENT_PLAYER = getCurrentPlayer();
    log(`Natural reincarnation bonus: +10% Max HP, +2 Base Damage`, CURRENT_PLAYER.hexColor);

    events.applyEventEffects({ hpChange: -CURRENT_PLAYER.currentHp }); // Set HP to 0
    await new Promise(resolve => setTimeout(resolve, 750));

    // Naturally dying players get a 10% max HP increase and +2 base damage
    events.applyEventEffects({ maxHpChangePercentage: 10, baseDamageChange: 2});

    // If there is a natural reincarnation and the stats page is opened, we need to update the page
    if (document.getElementById('player-stats-page').style.display !== 'none') {
        sidebar.showStats();
    }
    await checkAllPlayersHealthState();
}

// This function is called when a player dies, no natural reincarnation
export async function checkAllPlayersHealthState() {
    console.log('Checking all players health state');
    for (let i = 0; i < gameState.playerList.length; i++) {
        if (gameState.playerList[i].currentHp <= 0) {
            // If the player has lives left, subtract a life and reset their HP
            if (gameState.playerList[i].lives > 0) {
                gameState.playerList[i].lives--;
                gameState.playerList[i].currentHp = gameState.playerList[i].maxHp;
                updatePlayerClass(i + 1);

                // Lot of similarities with the movePlayer function in gameboard.ts
                // Move the player back to the starting position
                const CURRENT_PLAYER = getCurrentPlayer();
                const CURRENT_PLAYER_BOARD_POSITION = $(`#tile-${CURRENT_PLAYER.boardPosition}`);

                //copy a div based on its id
                let playerToken = CURRENT_PLAYER_BOARD_POSITION.find(`#player-token-${gameState.currentPlayerNumber}`).clone();
                //remove the original div
                CURRENT_PLAYER_BOARD_POSITION.find(`#player-token-${gameState.currentPlayerNumber}`).remove();

                CURRENT_PLAYER.boardPosition = 1;
                $(`#tile-1`).append(playerToken);

                await checkStatBounds(true);
            } else {
                // If the player has no lives left, remove them from the game
                // Eventually I need to implement a way for them to play in the afterlife
                gameState.playerList.splice(i, 1);
            }
        }
    }
}

export function updatePlayerClass(playerNumber: number) {
    // check karma thresholds. less than 20 karma = Pariah, 20 - 39 karma = Shudra, 40 - 59 karma = Vaishya, 60 - 79 karma = Kshatriya, 80+ karma = Brahmin
    let karma = gameState.playerList[playerNumber - 1].currentKarma;
    let playerClass = '';
    if (karma < 20) {
        playerClass = 'Pariah';
    } else if (karma >= 20 && karma < 40) {
        playerClass = 'Shudra';
    } else if (karma >= 40 && karma < 60) {
        playerClass = 'Vaishya';
    } else if (karma >= 60 && karma < 80) {
        playerClass = 'Kshatriya';
    } else {
        playerClass = 'Brahmin';
    }
    log(`${gameState.playerList[playerNumber - 1].playerName} dies and reincarnates into a ${playerClass} (${getCurrentPlayer().lives} lives remaining).`, gameState.playerList[playerNumber - 1].hexColor);
    gameState.playerList[playerNumber - 1].class = playerClass;

    // clone `player-class-${playerNumber}`, delete the original, and replace it with the clone
    let playerClassElement = document.getElementById(`player-class-${playerNumber}`);
    let playerClassElementClone = playerClassElement.cloneNode(true);
    playerClassElement.parentNode.replaceChild(playerClassElementClone, playerClassElement);
    document.getElementById(`player-class-${playerNumber}`).innerHTML = gameState.playerList[playerNumber - 1].class;
}

export async function updateVisualPlayerStats(updateAllPlayers: boolean) {
    let ID = document.getElementById.bind(document);
    if (updateAllPlayers === true) {
        let wpHasIncreased = false; // Only purpose of this is to play the WP gain sound
        let wpHasDecreased = false; // Only purpose of this is to play the WP loss sound
        for (let i = 1; i <= gameState.playerList.length; i++) {
            let player = gameState.playerList[i - 1];

            // Update the bars
            ID(`player-hp-bar-${i}`).style.width = `${Math.abs((player.currentHp / player.maxHp) - 1) * 100}%`;
            ID(`player-karma-bar-${i}`).style.width = `${Math.abs((Math.min(player.currentKarma, 100) / player.maxKarma) - 1) * 100}%`;

            numberChangeAnimation({ fromValue: +ID(`player-hp-${i}`).innerHTML, toValue: player.currentHp, elementID: `player-hp-${i}` });
            numberChangeAnimation({ fromValue: +ID(`player-maxHp-${i}`).innerHTML, toValue: player.maxHp, elementID: `player-maxHp-${i}` });
            numberChangeAnimation({ fromValue: +ID(`player-karma-${i}`).innerHTML, toValue: player.currentKarma, elementID: `player-karma-${i}` });
            numberChangeAnimation({ fromValue: +ID(`player-maxKarma-${i}`).innerHTML, toValue: player.maxKarma, elementID: `player-maxKarma-${i}` });
            ID(`player-lives-current-${i}`).innerHTML = "❤️x" + player.lives.toString();

            // Check if karma is 100 or more
            ID(`player-karma-${i}`).style.color = `${player.currentKarma >= 100 ? 'yellow' : 'white'}`;

            // Update the WP orbs
            const PLAYER_WP_CONTAINER = ID(`player-wp-current-${i}`);
            let filledOrbs = PLAYER_WP_CONTAINER.getElementsByClassName('wp-orb-filled');

            //if the number of filled orbs is less than the current WP, remove the last empty orb and add a filled orb after the last filled orb
            if (filledOrbs.length < player.currentWp) {
                wpHasIncreased = true; // Only purpose of this is to play the WP gain sound
                while (filledOrbs.length != player.currentWp) {
                    try {
                        filledOrbs[filledOrbs.length - 1].insertAdjacentHTML('afterend', '<span class="wp-orb-filled wp-orb-animate"></span>');
                    } catch (e) {
                        // If there are no filled orbs, add a filled orb at the beginning of the empty orbs
                        PLAYER_WP_CONTAINER.insertAdjacentHTML('afterbegin', '<span class="wp-orb-filled wp-orb-animate"></span>');
                    }
                    PLAYER_WP_CONTAINER.getElementsByClassName('wp-orb-empty')[0].remove();
                }
            }
            //if the number of filled orbs is greater than the current WP, remove the last filled orb and add an empty orb after the last empty orb
            if (filledOrbs.length > player.currentWp) {
                wpHasDecreased = true; // Only purpose of this is to play the WP loss sound
                while (filledOrbs.length != player.currentWp) {
                    filledOrbs[0].remove();
                    // insert <span class="wp-orb-empty wp-orb-drain"></span> after the last filled orb, or at the beginning of the empty orbs if there are no filled orbs
                    if (filledOrbs.length > 0) {
                        filledOrbs[filledOrbs.length - 1].insertAdjacentHTML('afterend', '<span class="wp-orb-empty wp-orb-drain"></span>')
                    } else {
                        PLAYER_WP_CONTAINER.insertAdjacentHTML('afterbegin', '<span class="wp-orb-empty wp-orb-drain"></span>');
                    }
                    // Update the filledOrbs variable
                    filledOrbs = PLAYER_WP_CONTAINER.getElementsByClassName('wp-orb-filled');
                }
                // clone all the filled orbs, delete the original, then replace it with the clone
                for (let i = 0; i < filledOrbs.length; i++) {
                    let filledOrbClone = filledOrbs[i].cloneNode(true);
                    filledOrbs[i].parentNode.replaceChild(filledOrbClone, filledOrbs[i]);
                }
            }
        }
        if (wpHasIncreased) music.playWillpowerGainSound();
        if (wpHasDecreased) music.playWillpowerLossSound();
    } else {
        // Will soon be deprecated
        let CURRENT_PLAYER = getCurrentPlayer();
        let CURRENT_PLAYER_NUMBER = gameState.currentPlayerNumber;
        // Update the bars
        ID(`player-hp-bar-${CURRENT_PLAYER_NUMBER}`).style.width = `${Math.abs((CURRENT_PLAYER.currentHp / CURRENT_PLAYER.maxHp) - 1) * 100}%`;
        ID(`player-karma-bar-${CURRENT_PLAYER_NUMBER}`).style.width = `${Math.abs((Math.min(CURRENT_PLAYER.currentKarma, 100) / CURRENT_PLAYER.maxKarma) - 1) * 100}%`;

        ID(`player-hp-${CURRENT_PLAYER_NUMBER}`).innerHTML = CURRENT_PLAYER.currentHp.toString();
        ID(`player-maxHp-${CURRENT_PLAYER_NUMBER}`).innerHTML = CURRENT_PLAYER.maxHp.toString();
        ID(`player-karma-${CURRENT_PLAYER_NUMBER}`).innerHTML = CURRENT_PLAYER.currentKarma.toString();
        ID(`player-maxKarma-${CURRENT_PLAYER_NUMBER}`).innerHTML = CURRENT_PLAYER.maxKarma.toString();
        ID(`player-lives-current-${CURRENT_PLAYER_NUMBER}`).innerHTML = "❤️x" + CURRENT_PLAYER.lives.toString();

        // Check if karma is 100 or more
        ID(`player-karma-${CURRENT_PLAYER_NUMBER}`).style.color = `${CURRENT_PLAYER.currentKarma >= 100 ? 'yellow' : 'white'}`;

        // Update the WP orbs
        const PLAYER_WP_CONTAINER = ID(`player-wp-current-${CURRENT_PLAYER_NUMBER}`);
        let filledOrbs = PLAYER_WP_CONTAINER.getElementsByClassName('wp-orb-filled');

        //if the number of filled orbs is less than the current WP, remove the last empty orb and add a filled orb after the last filled orb
        if (filledOrbs.length < CURRENT_PLAYER.currentWp) {
            music.playWillpowerGainSound();
            while (filledOrbs.length != CURRENT_PLAYER.currentWp) {
                try {
                    filledOrbs[filledOrbs.length - 1].insertAdjacentHTML('afterend', '<span class="wp-orb-filled wp-orb-animate"></span>');
                } catch (e) {
                    // If there are no filled orbs, add a filled orb at the beginning of the empty orbs
                    PLAYER_WP_CONTAINER.insertAdjacentHTML('afterbegin', '<span class="wp-orb-filled wp-orb-animate"></span>');
                }
                PLAYER_WP_CONTAINER.getElementsByClassName('wp-orb-empty')[0].remove();
            }
        }
        //if the number of filled orbs is greater than the current WP, remove the last filled orb and add an empty orb after the last empty orb
        if (filledOrbs.length > CURRENT_PLAYER.currentWp) {
            music.playWillpowerLossSound();
            while (filledOrbs.length != CURRENT_PLAYER.currentWp) {
                filledOrbs[0].remove();
                // insert <span class="wp-orb-empty wp-orb-drain"></span> after the last filled orb, or at the beginning of the empty orbs if there are no filled orbs
                if (filledOrbs.length > 0) {
                    filledOrbs[filledOrbs.length - 1].insertAdjacentHTML('afterend', '<span class="wp-orb-empty wp-orb-drain"></span>')
                } else {
                    PLAYER_WP_CONTAINER.insertAdjacentHTML('afterbegin', '<span class="wp-orb-empty wp-orb-drain"></span>');
                }
                // Update the filledOrbs variable
                filledOrbs = PLAYER_WP_CONTAINER.getElementsByClassName('wp-orb-filled');
            }
            // clone all the filled orbs, delete the original, then replace it with the clone
            for (let i = 0; i < filledOrbs.length; i++) {
                let filledOrbClone = filledOrbs[i].cloneNode(true);
                filledOrbs[i].parentNode.replaceChild(filledOrbClone, filledOrbs[i]);
            }
        }
    }
}

// This will also update the player's stats
export async function checkStatBounds(checkAllPlayers: boolean) {
    const PLAYER_LIST = gameState.playerList;
    if (checkAllPlayers === true) {
        for (let i = 0; i < gameState.playerList.length; i++) {
            if (PLAYER_LIST[i].currentHp > PLAYER_LIST[i].maxHp) PLAYER_LIST[i].currentHp = PLAYER_LIST[i].maxHp;
            if (PLAYER_LIST[i].currentWp > PLAYER_LIST[i].maxWp) PLAYER_LIST[i].currentWp = PLAYER_LIST[i].maxWp;
            if (PLAYER_LIST[i].currentHp <= 0) PLAYER_LIST[i].currentHp = 0;

            // if any player's hp is less than 20% of their max hp, add a hp-bar-low class to id player-hp-bar-container-i
            if (PLAYER_LIST[i].currentHp <= PLAYER_LIST[i].maxHp * 0.2) {
                document.getElementById(`player-hp-bar-${i + 1}`).classList.add('hp-bar-low');
            } else if (document.getElementById(`player-hp-bar-${i + 1}`).classList.contains('hp-bar-low')) {
                document.getElementById(`player-hp-bar-${i + 1}`).classList.remove('hp-bar-low');
            }
        }
        await updateVisualPlayerStats(true);
    } else {
        const CURRENT_PLAYER = getCurrentPlayer();

        if (CURRENT_PLAYER.currentHp > CURRENT_PLAYER.maxHp) CURRENT_PLAYER.currentHp = CURRENT_PLAYER.maxHp;
        if (CURRENT_PLAYER.currentWp > CURRENT_PLAYER.maxWp) CURRENT_PLAYER.currentWp = CURRENT_PLAYER.maxWp;
        if (CURRENT_PLAYER.currentHp <= 0) CURRENT_PLAYER.currentHp = 0;

        // if the player's hp is less than 20% of their max hp, add a hp-bar-low class to id player-hp-bar-container-i
        if (CURRENT_PLAYER.currentHp <= CURRENT_PLAYER.maxHp * 0.2) {
            document.getElementById(`player-hp-bar-${gameState.currentPlayerNumber}`).classList.add('hp-bar-low');
        } else if (document.getElementById(`player-hp-bar-${gameState.currentPlayerNumber}`).classList.contains('hp-bar-low')) {
            document.getElementById(`player-hp-bar-${gameState.currentPlayerNumber}`).classList.remove('hp-bar-low');
        }
        await updateVisualPlayerStats(false);
    }
}

async function numberChangeAnimation(parameters: { fromValue: number, toValue: number, elementID: string }) {
    const { fromValue, toValue, elementID } = parameters;
    const VALUE_DIFFERENCE = Math.abs(fromValue - toValue);
    if (VALUE_DIFFERENCE === 0) return;
    let timeStep = Math.abs(500 / VALUE_DIFFERENCE);

    //console.table(parameters);

    for (let i = 0; i <= Math.abs(VALUE_DIFFERENCE); i++) {
        let newValue = fromValue > toValue ? fromValue - i : fromValue + i;
        document.getElementById(elementID).innerHTML = newValue.toString();
        await new Promise(resolve => setTimeout(resolve, timeStep));
    }
}