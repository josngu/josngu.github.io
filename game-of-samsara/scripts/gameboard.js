import * as game from './index.js';
import * as events from './events.js';
import * as sidebar from './sidebar.js';
import * as music from './music.js';
let gameboard = [];
let gameboardLength = 30;
let perspectiveAngle = 30;
export function createGameboard() {
    for (let i = 0; i < gameboardLength; i++) {
        // create divs which are tiles and append them as a child
        let tile = document.createElement('div');
        tile.classList.add('tile');
        // Apply the tile-start-end ID for the first tile only
        i == 0 ? tile.classList.add('tile-start-end') : '';
        tile.id = `tile-${i + 1}`;
        tile.style.gridArea = `t${(i + 1).toString()}`;
        // add the tiles to the gameboard array
        if (i == 0) {
            gameboard.push({
                type: 'start-end',
            });
        }
        else {
            gameboard.push({
                type: setTileType(),
            });
        }
        if (gameboard[i].type == "good") {
            tile.classList.add('tile-good');
        }
        else if (gameboard[i].type == "bad") {
            tile.classList.add('tile-bad');
        }
        // push the tiles to the gameboard
        //console.log(gameboard);
        document.getElementById('gameboard').appendChild(tile);
    }
}
function setTileType() {
    const randomValue = Math.random() * 100; // Generate a random value between 0 and 100
    if (randomValue < 10) { // old value is 60
        return "neutral"; // 60% chance
    }
    else if (randomValue < 20) { // old value is 80
        return "good"; // 20% chance
    }
    else {
        return "bad"; // 20% chance
    }
}
export function animateGameboardTiles() {
    let gameboardTileCount = document.getElementsByClassName('tile');
    for (let i = 0; i < gameboardTileCount.length; i++) {
        let tile = gameboardTileCount[i];
        tile.style.animationDelay = `${i * 0.033}s`;
        tile.style.animationDuration = `0.75s`;
        tile.style.animationName = 'tile-appear';
        tile.style.animationFillMode = 'forwards';
    }
}
export function remakeGameboard() {
    let gameboardTileCount = document.getElementsByClassName('tile');
    for (let i = 0; i < gameboardTileCount.length; i++) {
        let tile = gameboardTileCount[i];
        tile.style.animationDelay = `0s`;
        tile.style.animationDuration = `0.75s`;
        tile.style.animationName = 'tile-disappear';
        tile.style.animationFillMode = 'forwards';
    }
    //Delete the gameboard and make a new one
    gameboard = [];
    setTimeout(() => {
        //delete all elements with the tile class
        let tiles = document.getElementsByClassName('tile');
        while (tiles.length > 0) {
            tiles[0].parentNode.removeChild(tiles[0]);
        }
        createGameboard();
        // Get all player positions and add them to the new gameboard
        for (let i = 0; i < game.gameState.playerList.length; i++) {
            let player = game.gameState.playerList[i];
            document.getElementById(`tile-${player.boardPosition}`).innerHTML += `
                <div id="player-token-${i + 1}" style="background: ${player.hexColor}" class="player-token"></div`;
        }
        animateGameboardTiles();
    }, 750);
}
export function zoomGameboard(event) {
    perspectiveAngle += event.deltaY > 0 ? -5 : 5;
    if (perspectiveAngle < 0) {
        perspectiveAngle = 0;
    }
    if (perspectiveAngle > 75) {
        perspectiveAngle = 75;
    }
    //console.log(perspectiveAngle)
    document.getElementById('gameboard').style.transform = `perspective(20cm) rotateX(${perspectiveAngle}deg)`;
}
export function rollDice(i) {
    game.disableButton('btn-roll-dice');
    if (game.gameState.hasUsedSpell == false) {
        sidebar.disableSpells();
    }
    $('#dice-roll-result').show();
    $('#dice-roll-result').addClass('dice-roll-in');
    if (i != 12) {
        let diceRoll = Math.floor(Math.random() * 6) + 1;
        document.getElementById('dice-roll-result').innerHTML = diceRoll.toString();
        i++;
        setTimeout(() => { rollDice(i); }, 100);
    }
    else {
        let diceRoll = Math.floor(Math.random() * 6) + 1;
        document.getElementById('dice-roll-result').innerHTML = diceRoll.toString();
        $('#dice-roll-result').removeClass('dice-roll-in');
        game.log(`${game.gameState.currentPlayerName} rolled ${diceRoll}`, game.getCurrentPlayer().hexColor);
        // Show the result for 1 second, then animate it fading out
        setTimeout(async () => {
            await movePlayer(diceRoll);
        }, 1000);
    }
}
// Moves the player token and checks what tile they are on
export async function movePlayer(diceRoll) {
    for (let i = 0; i < diceRoll; i++) {
        let CURRENT_PLAYER_BOARD_POSITION = $(`#tile-${game.getCurrentPlayer().boardPosition}`);
        const CURRENT_PLAYER = game.getCurrentPlayer();
        //copy a div based on its id
        let playerToken = CURRENT_PLAYER_BOARD_POSITION.find(`#player-token-${game.gameState.currentPlayerNumber}`).clone();
        //remove the original div
        CURRENT_PLAYER_BOARD_POSITION.find(`#player-token-${game.gameState.currentPlayerNumber}`).remove();
        //update the dice roll result
        document.getElementById('dice-roll-result').innerHTML = `${diceRoll - i - 1}`;
        //check if the player has reached the end of the board, if so, loop back to the start and kill them
        if (CURRENT_PLAYER.boardPosition == gameboardLength) {
            CURRENT_PLAYER.boardPosition = 1;
            $(`#tile-1`).append(playerToken);
            game.reincarnatePlayer();
            game.createTransition(`${game.gameState.currentPlayerName} Reincarnates`, CURRENT_PLAYER.darkenedRGBColor);
            game.log(`${game.gameState.currentPlayerName} reached the end of the board and is reincarnated (${CURRENT_PLAYER.lives} lives remaining).`, CURRENT_PLAYER.hexColor);
            remakeGameboard();
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        else {
            //add the copied div to the next tile
            $(`#tile-${CURRENT_PLAYER.boardPosition + 1}`).append(playerToken);
            CURRENT_PLAYER.boardPosition++;
        }
        // Wait before moving the player again
        await new Promise(resolve => setTimeout(resolve, 500));
        // Wait for the sidebar to hide if the player lands on an empty tile or the start tile once the dice roll result hits 0
        if (document.getElementById('dice-roll-result').innerHTML == '0') {
            if (gameboard[game.getCurrentPlayer().boardPosition - 1].type == 'neutral' || game.getCurrentPlayer().boardPosition == 1) {
                sidebar.hideSidebar();
                await new Promise(resolve => setTimeout(resolve, game.getAnimationDuration('hide-sidebar')));
            }
        }
    }
    // Hide the dice roll result div
    $('#dice-roll-result').addClass('dice-roll-out');
    setTimeout(() => {
        $('#dice-roll-result').hide();
        $('#dice-roll-result').removeClass('dice-roll-out');
    }, game.getAnimationDuration('dice-roll-out'));
    // Check if the sidebar is already hidden, if not, hide it
    if (document.getElementById('sidebar').style.display == 'flex') {
        sidebar.hideSidebar();
    }
    // Movement is finished, check what tile the player is on
    // Check if the player is on a blue or red tile
    if (gameboard[game.getCurrentPlayer().boardPosition - 1].type == 'good') {
        await events.blueTile();
    }
    else if (gameboard[game.getCurrentPlayer().boardPosition - 1].type == 'bad') {
        music.crossFadeMusic();
        zoomIntoPlayerToken();
        await events.redTile();
    }
    // Do stuff here like add passive health regen to Brahma
    advanceTurn();
}
async function advanceTurn() {
    exitActivePlayer();
    // if the current player is the last player in the array, go back to the first player
    if (game.gameState.currentPlayerNumber == game.gameState.playerList.length) {
        game.gameState.turn++;
        game.gameState.currentPlayerNumber = 1;
        game.gameState.currentPlayerName = game.gameState.playerList[0].playerName;
        game.gameState.hasUsedSpell = false;
        // fill up everyone's WP by 1
        game.gameState.playerList.forEach(player => {
            player.currentWp++;
        });
        game.checkStatBounds(true);
        await game.createTransition(`Turn ${game.gameState.turn.toString()}`, game.TRANSITION_SCREEN_BG_RGB_COLOR);
        game.log(`Turn ${game.gameState.turn.toString()}`);
        setTimeout(async () => {
            await game.createTransition(`${game.gameState.currentPlayerName}'s Turn`, game.getCurrentPlayer().darkenedRGBColor);
            game.log(`${game.gameState.currentPlayerName}'s Turn`, game.getCurrentPlayer().hexColor);
            showActivePlayer();
            sidebar.showSidebar();
        }, 1200);
        setTimeout(() => {
            game.enableButton('btn-roll-dice');
        }, 2400);
    }
    else {
        game.gameState.currentPlayerNumber++;
        game.gameState.currentPlayerName = game.getCurrentPlayer().playerName;
        game.gameState.hasUsedSpell = false;
        await game.createTransition(`${game.gameState.currentPlayerName}'s Turn`, game.getCurrentPlayer().darkenedRGBColor);
        game.log(`${game.gameState.currentPlayerName}'s Turn`, game.getCurrentPlayer().hexColor);
        showActivePlayer();
        sidebar.showSidebar();
        setTimeout(() => {
            game.enableButton('btn-roll-dice');
        }, 1200);
    }
}
export function showActivePlayer() {
    let playerCard = document.getElementById(`player-card-${game.gameState.currentPlayerNumber}`);
    playerCard.style.animation = 'active-player-enter 0.5s forwards, active-player-pulse 1.5s infinite';
    playerCard.style.textShadow = `0px 0px 8px ${game.getCurrentPlayer().hexColor}`;
    let playerToken = document.getElementById(`player-token-${game.gameState.currentPlayerNumber}`);
    playerToken.style.animation = 'none';
    playerToken.style.animation = 'player-token-pulse 1.5s infinite linear';
}
export function exitActivePlayer() {
    let playerCard = document.getElementById(`player-card-${game.gameState.currentPlayerNumber}`);
    playerCard.style.animation = 'active-player-exit 0.5s forwards';
    playerCard.style.textShadow = `none`;
    let playerToken = document.getElementById(`player-token-${game.gameState.currentPlayerNumber}`);
    playerToken.style.animation = 'none';
}
export function showPlayerCards() {
    document.getElementById('player-cards').style.display = 'flex';
    document.getElementById('player-cards').classList.remove('player-cards-exit');
    document.getElementById('player-cards').classList.add('player-cards-enter');
}
function hidePlayerCards() {
    document.getElementById('player-cards').classList.remove('player-cards-enter');
    document.getElementById('player-cards').classList.add('player-cards-exit');
    setTimeout(() => {
        document.getElementById('player-cards').style.display = 'none';
    }, game.getAnimationDuration('player-cards-exit'));
}
function zoomIntoPlayerToken() {
    // Remove the scroll wheel event listener on the gameboard
    document.getElementById('gameboard').removeEventListener('wheel', zoomGameboard);
    hidePlayerCards();
    const gameboard = document.getElementById('gameboard');
    const tile = document.getElementById(`tile-${game.getCurrentPlayer().boardPosition}`);
    // Translation values based on the player's position, no idea how this works
    const scaleValue = 5;
    const scaleOffsetX = tile.offsetWidth / 2;
    const scaleOffsetY = tile.offsetHeight / 2;
    const translateX = (gameboard.offsetWidth / 2) - (tile.offsetLeft + scaleOffsetX);
    const translateY = (gameboard.offsetHeight / 2) - (tile.offsetTop + scaleOffsetY);
    let angleInDegrees = 0;
    // Adjust translation values to account for rotation
    // if the player is on the left side of the board, the angle should be -90 degrees, if on the right side, 90 degrees
    if (translateX < 0) {
        angleInDegrees = -90;
    }
    else {
        angleInDegrees = 90;
    }
    const angleInRadians = angleInDegrees * Math.PI / 180; // Convert degrees to radians
    const rotatedTranslateX = translateX * Math.cos(angleInRadians) - translateY * Math.sin(angleInRadians);
    const rotatedTranslateY = translateX * Math.sin(angleInRadians) + translateY * Math.cos(angleInRadians);
    // Apply the transformation to the gameboard
    gameboard.style.transform = `scale(${scaleValue}) translate(${rotatedTranslateX}px, ${rotatedTranslateY}px) rotateZ(${angleInDegrees}deg)`;
}
export function zoomOutPlayerToken() {
    music.crossFadeMusic();
    const gameboard = document.getElementById('gameboard');
    gameboard.style.transform = `perspective(20cm) rotateX(${perspectiveAngle}deg)`;
    gameboard.style.transformOrigin = 'center center';
    // Re-add the scroll wheel event listener on the gameboard
    document.getElementById('gameboard').addEventListener('wheel', zoomGameboard, { passive: true });
    showPlayerCards();
}
//# sourceMappingURL=gameboard.js.map