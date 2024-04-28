import * as game from './index.js';
import * as gameboard from './gameboard.js';
import * as sidebar from './sidebar.js';
import { BLUE_EVENT_LIST } from './blueEventList.js';
import { RED_EVENT_LIST } from './redEventList.js';
import { SPELL_LIST } from './spellList.js';
const LOWERED_NEW_STAT_COLOR = 'red';
const RAISED_NEW_STAT_COLOR = 'lightblue';
const SAME_NEW_STAT_COLOR = 'white';
export async function getRandomSpell() {
    const SPELL = SPELL_LIST[Math.floor(Math.random() * SPELL_LIST.length)];
    sidebar.showSpellName(`Got 🕉️ ${SPELL.spellName}!`, 2500);
    game.log(`${game.getCurrentPlayer().playerName} gets 🕉️ ${SPELL.spellName}.`, game.getCurrentPlayer().hexColor);
    return SPELL;
}
function loseRandomSpell() {
    game.getCurrentPlayer().spells.splice(Math.floor(Math.random() * game.getCurrentPlayer().spells.length), 1);
}
export async function blueTile() {
    await createEventScreen(chooseRandomEvent(BLUE_EVENT_LIST));
}
export async function redTile() {
    await createEventScreen(chooseRandomEvent(RED_EVENT_LIST));
}
async function createEventScreen(event) {
    let eventScreenOptionsHTML = event.options.map(option => {
        // Check if the player has enough willpower to choose the option
        const WP_REQUIREMENT = Math.abs(option.effect.wpChange < 0 ? option.effect.wpChange : 0) ?? 0;
        console.log(WP_REQUIREMENT);
        const HAS_ENOUGH_WP = game.getCurrentPlayer().currentWp >= WP_REQUIREMENT;
        console.log(HAS_ENOUGH_WP);
        const DISABLE_OPTION = !HAS_ENOUGH_WP;
        console.log(DISABLE_OPTION);
        return `
        <div class="event-screen-option ${DISABLE_OPTION ? 'btn-disabled' : ''}">
            <h3>${option.label}</h3>
            ${option.description ? `<p>${option.description}</p>` : ''}
            ${DISABLE_OPTION ? `<p>You don't have enough willpower to choose this option.</p>` : ''}
            <div class="event-screen-option-stat-changes">
                ${previewEventEffects(option.effect)}
            </div>
        </div>`;
    }).join('');
    console.log(event.options.map(option => option.effect));
    let eventScreenHTML = `
    <div id="event-screen">
        <p id="event-screen-message"></p>
        <div id="event-screen-options">
            ${eventScreenOptionsHTML}
        </div>
    </div>`;
    document.body.insertAdjacentHTML('afterbegin', eventScreenHTML);
    // Loop through event-screen-option and check if there is a btn-disabled class. If there is, disable the button
    const EVENT_SCREEN_OPTIONS = document.getElementsByClassName('event-screen-option');
    for (let i = 0; i < EVENT_SCREEN_OPTIONS.length; i++) {
        if (EVENT_SCREEN_OPTIONS[i].classList.contains('btn-disabled')) {
            console.log(EVENT_SCREEN_OPTIONS[i]);
            EVENT_SCREEN_OPTIONS[i].disabled = true;
            EVENT_SCREEN_OPTIONS[i].style.pointerEvents = 'none';
        }
    }
    document.getElementById('event-screen').classList.add('fade-in');
    // Wait before displaying the message box
    await new Promise(resolve => setTimeout(resolve, game.getAnimationDuration('fade-in')));
    document.getElementById('event-screen-message').style.display = 'flex';
    document.getElementById('event-screen-message').classList.add('move-up');
    // Wait before displaying the message
    await new Promise(resolve => setTimeout(resolve, 500));
    await returnMessage(event.message, 'event-screen-message');
    // Stop code execution until an option is chosen
    let chosenOption = await new Promise(resolve => {
        for (let i = 0; i < EVENT_SCREEN_OPTIONS.length; i++) {
            EVENT_SCREEN_OPTIONS[i].addEventListener('click', () => {
                console.log(event.options[i]);
                applyEventEffects(event.options[i].effect);
                resolve(event.options[i]);
            });
        }
    });
    // After a choice has been made, fade out the message box and the other options except for the one chosen
    document.getElementById('event-screen-message').classList.remove('move-up');
    document.getElementById('event-screen-message').classList.add('fade-out');
    document.getElementById('event-screen-message').style.animationDuration = '0.4s';
    for (let i = 0; i < EVENT_SCREEN_OPTIONS.length; i++) {
        EVENT_SCREEN_OPTIONS[i].disabled = true;
        EVENT_SCREEN_OPTIONS[i].style.pointerEvents = 'none';
        if (event.options[i] !== chosenOption) {
            EVENT_SCREEN_OPTIONS[i].classList.add('fade-out');
            EVENT_SCREEN_OPTIONS[i].style.animationDuration = '0.4s';
        }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    //fade out the button that the player selected earlier
    for (let element in EVENT_SCREEN_OPTIONS) {
        if (event.options[element] === chosenOption) {
            EVENT_SCREEN_OPTIONS[element].classList.add('fade-out');
            EVENT_SCREEN_OPTIONS[element].style.animationDuration = '0.4s';
        }
    }
    await new Promise(resolve => setTimeout(resolve, 400));
    // After a choice has been made and the chosen choice fades out, assign the .fade-out class to the event screen
    document.getElementById('event-screen').classList.remove('fade-in');
    document.getElementById('event-screen').classList.add('fade-out');
    gameboard.zoomOutPlayerToken();
    // Wait for the fade out animation to finish and use the duration of the animation as the delay to remove the event screen
    await new Promise(resolve => setTimeout(resolve, game.getAnimationDuration('fade-out')));
    document.getElementById('event-screen').remove();
    await game.checkAllPlayersHealthState();
}
function chooseRandomEvent(events) {
    // got no idea how this works
    const totalChances = events.reduce((sum, event) => sum + event.chance, 0);
    let randomValue = Math.random() * totalChances;
    for (const event of events) {
        randomValue -= event.chance;
        if (randomValue <= 0) {
            return event;
        }
    }
    // Fallback (shouldn't reach here under normal circumstances)
    return events[0];
}
export async function applyEventEffects(event) {
    const CURRENT_PLAYER = game.getCurrentPlayer();
    if (event.maxHpChange)
        changeHealth({ changeValue: event.maxHpChange, changeMaxHp: true });
    if (event.maxHpChangePercentage)
        changeHealth({ changeValue: event.maxHpChangePercentage, isPercentage: true, changeMaxHp: true });
    if (event.hpChange)
        changeHealth({ changeValue: event.hpChange });
    if (event.hpChangePercentage)
        changeHealth({ changeValue: event.hpChangePercentage, isPercentage: true });
    if (event.livesChange) {
        CURRENT_PLAYER.lives += event.livesChange;
        game.updateVisualPlayerStats(false);
    }
    if (event.baseDamageChange) {
        CURRENT_PLAYER.baseDamage += event.baseDamageChange;
        game.updateVisualPlayerStats(false);
    }
    if (event.critChanceChange) {
        CURRENT_PLAYER.critChance += event.critChanceChange;
        game.updateVisualPlayerStats(false);
    }
    if (event.wpChange)
        changeWp({ wpChange: event.wpChange });
    if (event.othersWpChange)
        changeWp({ wpChange: event.othersWpChange, applyToAllOtherPlayers: true });
    if (event.karmaChange) {
        CURRENT_PLAYER.currentKarma += event.karmaChange;
        game.updateVisualPlayerStats(false);
    }
    if (event.othersHpChange)
        changeHealth({ changeValue: event.othersHpChange, applyToAllOtherPlayers: true });
    if (event.othersHpChangePercentage)
        changeHealth({ changeValue: event.othersHpChangePercentage, isPercentage: true, applyToAllOtherPlayers: true });
    if (event.getRandomSpell) {
        CURRENT_PLAYER.spells.push(await getRandomSpell());
        game.updateVisualPlayerStats(false);
    }
    if (event.loseRandomSpell) {
        CURRENT_PLAYER.spells.splice(Math.floor(Math.random() * CURRENT_PLAYER.spells.length), 1);
        game.updateVisualPlayerStats(false);
    }
    if (event.customEffect) {
        event.customEffect();
        game.checkStatBounds(true);
    }
}
function previewEventEffects(event) {
    const CURRENT_PLAYER = game.getCurrentPlayer();
    let html = '';
    console.log(event);
    if (event.hpChange) {
        let newHp = CURRENT_PLAYER.currentHp + event.hpChange;
        if (newHp > CURRENT_PLAYER.maxHp)
            newHp = CURRENT_PLAYER.maxHp;
        html += formatStatChange(CURRENT_PLAYER.currentHp, newHp, event.hpChange, 'Current HP', false, CURRENT_PLAYER.maxHp);
    }
    if (event.hpChangePercentage) {
        let newHp = CURRENT_PLAYER.currentHp + Math.round(CURRENT_PLAYER.maxHp * (event.hpChangePercentage / 100));
        if (newHp > CURRENT_PLAYER.maxHp)
            newHp = CURRENT_PLAYER.maxHp;
        html += formatStatChange(CURRENT_PLAYER.currentHp, newHp, event.hpChangePercentage, 'Current HP', true, CURRENT_PLAYER.maxHp);
    }
    if (event.maxHpChange) {
        let newMaxHp = CURRENT_PLAYER.maxHp + event.maxHpChange;
        html += formatStatChange(CURRENT_PLAYER.maxHp, newMaxHp, event.maxHpChange, 'Max HP');
    }
    if (event.maxHpChangePercentage) {
        let newMaxHp = CURRENT_PLAYER.maxHp + Math.round(CURRENT_PLAYER.maxHp * (event.maxHpChangePercentage / 100));
        html += formatStatChange(CURRENT_PLAYER.maxHp, newMaxHp, event.maxHpChangePercentage, 'Max HP', true);
    }
    if (event.livesChange) {
        let newLives = CURRENT_PLAYER.lives + event.livesChange;
        html += formatStatChange(CURRENT_PLAYER.lives, newLives, event.livesChange, 'Lives');
    }
    if (event.baseDamageChange) {
        let newBaseDamage = CURRENT_PLAYER.baseDamage + event.baseDamageChange;
        html += formatStatChange(CURRENT_PLAYER.baseDamage, newBaseDamage, event.baseDamageChange, 'Base Damage');
    }
    if (event.critChanceChange) {
        let newCritChance = CURRENT_PLAYER.critChance + event.critChanceChange;
        html += formatStatChange(CURRENT_PLAYER.critChance, newCritChance, event.critChanceChange, 'Crit Chance', true);
    }
    if (event.wpChange) {
        let newWp = CURRENT_PLAYER.currentWp + event.wpChange;
        if (newWp > CURRENT_PLAYER.maxWp)
            newWp = CURRENT_PLAYER.maxWp;
        html += formatStatChange(CURRENT_PLAYER.currentWp, newWp, event.wpChange, 'Willpower');
    }
    if (event.othersWpChange) {
        html += `<p>${event.othersWpChange}</p>`;
    }
    if (event.karmaChange) {
        let newKarma = CURRENT_PLAYER.currentKarma + event.karmaChange;
        html += formatStatChange(CURRENT_PLAYER.currentKarma, newKarma, event.karmaChange, 'Karma');
    }
    if (event.othersHpChange) {
        let operator = '+';
        let statColor = RAISED_NEW_STAT_COLOR;
        if (event.othersHpChange < 0) {
            operator = '';
            statColor = LOWERED_NEW_STAT_COLOR;
        }
        html += `
        <div class='stat-change-row'>
            <p>Others' HP</p>
            <p style='color: ${statColor}'>${operator}${event.othersHpChange}</p>
        </div>`;
    }
    if (event.othersHpChangePercentage) {
        let operator = '+';
        let statColor = RAISED_NEW_STAT_COLOR;
        if (event.othersHpChangePercentage < 0) {
            operator = '';
            statColor = LOWERED_NEW_STAT_COLOR;
        }
        html += `
        <div class='stat-change-row'>
            <p>Others' HP</p>
            <p style='color: ${statColor}'>${operator}${event.othersHpChangePercentage}%/Max HP</p>
        </div>`;
    }
    if (event.getRandomSpell) {
        html += `
        <div class='stat-change-row'>
            <p style='color: ${RAISED_NEW_STAT_COLOR}'>Gain a Random Spell</p>
        </div>`;
    }
    if (event.loseRandomSpell) {
        html += `
        <div class='stat-change-row'>
            <p style='color: ${LOWERED_NEW_STAT_COLOR}'>Lose a Random Spell</p>
        </div>`;
    }
    return html;
}
function formatStatChange(currentStat, newStat, statChange, statName, isPercentage, maxStat) {
    let statColor = '';
    console.log(currentStat, maxStat, newStat, statChange, statName, isPercentage);
    if (newStat == currentStat) {
        statColor = SAME_NEW_STAT_COLOR;
    }
    else if (newStat > currentStat) {
        statColor = RAISED_NEW_STAT_COLOR;
    }
    else {
        statColor = LOWERED_NEW_STAT_COLOR;
    }
    let statChangeString = '';
    if (isPercentage == true && !statName.includes('Crit')) {
        if (statChange > 0) {
            statChangeString = `(+${statChange}%/${maxStat})`;
            console.log(statChangeString);
        }
        else if (statChange < 0) {
            statChangeString = `(${statChange}%/${maxStat})`;
        }
    }
    else if (isPercentage == true && statName.includes('Crit')) {
        if (statChange > 0) {
            statChangeString = `(+${statChange}%)`;
        }
        else if (statChange < 0) {
            statChangeString = `(${statChange}%)`;
        }
    }
    else if (statChange > 0) {
        statChangeString = `(+${statChange})`;
    }
    else if (statChange < 0) {
        statChangeString = `(${statChange})`;
    }
    const HTML = `
        <div class='stat-change-row'>
            <p>${statName}</p>
            <p>${currentStat}${statName.includes('Crit') ? '%' : ''}
                <span>${statChangeString}</span>
                <span style='color: ${statColor}'>🡒 ${newStat}${statName.includes('Crit') ? '%' : ''}</span>
            </p>
        </div>
    `;
    return HTML;
}
// By default, the function changes the current player's health using an integer value.
export function changeHealth(parameters) {
    const CHANGE_VALUE = parameters.changeValue;
    const CHANGE_MAX_HP = parameters.changeMaxHp ?? false;
    const IS_PERCENTAGE = parameters.isPercentage ?? false;
    const APPLY_TO_ALL_OTHER_PLAYERS = parameters.applyToAllOtherPlayers ?? false;
    const CURRENT_PLAYER = game.getCurrentPlayer();
    const PLAYER_LIST = game.gameState.playerList;
    if (APPLY_TO_ALL_OTHER_PLAYERS == true && CHANGE_MAX_HP == false) {
        for (let i = 0; i < PLAYER_LIST.length; i++) {
            if (PLAYER_LIST[i] !== CURRENT_PLAYER) {
                PLAYER_LIST[i].currentHp += IS_PERCENTAGE == true ? Math.round(PLAYER_LIST[i].maxHp * (CHANGE_VALUE / 100)) : CHANGE_VALUE;
            }
        }
        game.checkStatBounds(true);
    }
    else if (APPLY_TO_ALL_OTHER_PLAYERS == false && CHANGE_MAX_HP == false) {
        CURRENT_PLAYER.currentHp += IS_PERCENTAGE == true ? Math.round(CURRENT_PLAYER.maxHp * (CHANGE_VALUE / 100)) : CHANGE_VALUE;
        game.checkStatBounds(false);
        // Change maximum HP code blocks
    }
    else if (APPLY_TO_ALL_OTHER_PLAYERS == true && CHANGE_MAX_HP == true) {
        for (let i = 0; i < PLAYER_LIST.length; i++) {
            if (PLAYER_LIST[i] !== CURRENT_PLAYER) {
                PLAYER_LIST[i].maxHp += IS_PERCENTAGE == true ? Math.round(PLAYER_LIST[i].maxHp * (CHANGE_VALUE / 100)) : CHANGE_VALUE;
            }
        }
        game.checkStatBounds(true);
    }
    else if (APPLY_TO_ALL_OTHER_PLAYERS == false && CHANGE_MAX_HP == true) {
        CURRENT_PLAYER.maxHp += IS_PERCENTAGE == true ? Math.round(CURRENT_PLAYER.maxHp * (CHANGE_VALUE / 100)) : CHANGE_VALUE;
        game.checkStatBounds(false);
    }
}
function changeWp(parameters) {
    const WP_CHANGE = parameters.wpChange;
    const APPLY_TO_ALL_OTHER_PLAYERS = parameters.applyToAllOtherPlayers ?? false;
    const CURRENT_PLAYER = game.getCurrentPlayer();
    const PLAYER_LIST = game.gameState.playerList;
    if (APPLY_TO_ALL_OTHER_PLAYERS == true) {
        for (let i = 0; i < PLAYER_LIST.length; i++) {
            if (PLAYER_LIST[i] !== CURRENT_PLAYER) {
                PLAYER_LIST[i].currentWp += WP_CHANGE;
            }
        }
        game.checkStatBounds(true);
    }
    else {
        CURRENT_PLAYER.currentWp += WP_CHANGE;
        game.checkStatBounds(false);
    }
}
// Too arduous to implement correctly. 
export async function healthChangeAnimation(hpChange, target) {
    let timeStep = Math.abs(500 / hpChange);
    console.log(timeStep);
    console.log(target);
    if (target === game.gameState.playerList) {
        const PLAYER_LIST = game.gameState.playerList;
        for (let i = 1; i <= target.length; i++) {
            document.getElementById(`player-hp-bar-${i}`).style.width = `${(PLAYER_LIST[i - 1].currentHp / PLAYER_LIST[i - 1].maxHp) * 100}%`;
            for (let j = 0; j < Math.abs(hpChange); j++) {
                let playerHPElement = document.getElementById(`player-hp-${i}`);
                let playerHP = playerHPElement.textContent;
                playerHPElement.textContent = (parseInt(playerHP) + (hpChange < 0 ? -1 : 1)).toString();
                // Check if the player's visual HP exceeds their max HP
                if (parseInt(playerHPElement.textContent) > PLAYER_LIST[i - 1].maxHp) {
                    playerHPElement.textContent = PLAYER_LIST[i - 1].maxHp.toString();
                    return;
                }
                // Check if the player's visual HP is less than 0
                if (parseInt(playerHPElement.textContent) < 0) {
                    playerHPElement.textContent = '0';
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, timeStep));
            }
        }
    }
    if (target === game.getCurrentPlayer()) {
        const CURRENT_PLAYER = game.getCurrentPlayer();
        document.getElementById(`player-hp-bar-${game.gameState.currentPlayerNumber}`).style.width = `${(CURRENT_PLAYER.currentHp / CURRENT_PLAYER.maxHp) * 100}%`;
        for (let j = 0; j < Math.abs(hpChange); j++) {
            let currentPlayerHPElement = document.getElementById(`player-hp-${game.gameState.currentPlayerNumber}`);
            let currentPlayerHP = currentPlayerHPElement.textContent;
            currentPlayerHPElement.textContent = (parseInt(currentPlayerHP) + (hpChange < 0 ? -1 : 1)).toString();
            // Check if the player's visual HP exceeds their max HP
            if (parseInt(currentPlayerHPElement.textContent) > CURRENT_PLAYER.maxHp) {
                currentPlayerHPElement.textContent = CURRENT_PLAYER.maxHp.toString();
                return;
            }
            // Check if the player's visual HP is less than 0
            if (parseInt(currentPlayerHPElement.textContent) < 0) {
                currentPlayerHPElement.textContent = '0';
                return;
            }
            await new Promise(resolve => setTimeout(resolve, timeStep));
        }
    }
}
export async function returnMessage(message, id) {
    //display the message one character at a time
    let messageArray = message.split('');
    for (let i = 0; i < messageArray.length; i++) {
        document.getElementById(id).innerHTML += messageArray[i];
        await new Promise(resolve => setTimeout(resolve, 20));
    }
    // start the animation for #event-screen-options
    document.getElementById('event-screen-options').classList.add('move-down');
    document.getElementById('event-screen-options').style.pointerEvents = 'auto';
}
//# sourceMappingURL=events.js.map