import * as game from './index.js';
import * as gameboard from './gameboard.js';
import * as sidebar from './sidebar.js';
import { BLUE_EVENT_LIST } from './blueEventList.js';
import { RED_EVENT_LIST } from './redEventList.js';
import { SPELL_LIST } from './spellList.js';

const LOWERED_NEW_STAT_COLOR = 'red';
const RAISED_NEW_STAT_COLOR = 'lightblue';
const SAME_NEW_STAT_COLOR = 'white';

export interface Event {
    message: string,
    options: EventOption[],
    chance: number,
}

export interface EventOption {
    label: string,
    description?: string,
    effect: EffectChanges,
}

export interface EffectChanges {
    hpChange?: number,
    hpChangePercentage?: number,
    maxHpChange?: number,
    maxHpChangePercentage?: number,
    livesChange?: number,
    baseDamageChange?: number,
    critChanceChange?: number,
    wpChange?: number,
    othersWpChange?: number,
    karmaChange?: number,
    othersHpChange?: number,
    othersHpChangePercentage?: number,
    getRandomSpell?: boolean,
    loseRandomSpell?: boolean,
    customEffect?: Function,
}

export interface Spell {
    spellName: string,
    description: string,
    effect: EffectChanges,
}

export async function getRandomSpell() {
    const SPELL = SPELL_LIST[Math.floor(Math.random() * SPELL_LIST.length)];
    sidebar.showSpellName(`Got 🕉️ ${SPELL.spellName}!`, 2500);
    game.log(`${game.getCurrentPlayer().playerName} gets 🕉️ ${SPELL.spellName}.`, game.getCurrentPlayer().hexColor);
    return SPELL;
}

function loseRandomSpell() {
    game.getCurrentPlayer().spells.splice(Math.floor(Math.random() * game.getCurrentPlayer().spells.length), 1)
}

export async function blueTile() {
    await createEventScreen(chooseRandomEvent(BLUE_EVENT_LIST), 'blue');
}

export async function redTile() {
    await createEventScreen(chooseRandomEvent(RED_EVENT_LIST), 'red');
}

async function createEventScreen(event: Event, eventType: 'blue' | 'red') {
    const CURRENT_PLAYER = game.getCurrentPlayer();
    const EVENT_COLOR = (() => {
        if (eventType === 'blue') {
            return window.getComputedStyle(document.querySelector(`.tile-good`)).getPropertyValue('background-color').slice(0, -1);
        } else if (eventType === 'red') {
            return window.getComputedStyle(document.querySelector(`.tile-bad`)).getPropertyValue('background-color').slice(0, -1);
        }
    })();
    console.log(EVENT_COLOR);

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
        </div>`
    }).join('');

    console.log(event.options.map(option => option.effect));

    const COLOR = `
            linear-gradient(90deg,
                ${EVENT_COLOR}, 0) 0%,
                ${EVENT_COLOR}, 0.25) 25%,
                ${EVENT_COLOR}, 0.33) 50%,
                ${EVENT_COLOR}, 0.25) 75%,
                ${EVENT_COLOR}, 0) 100%)`;

    let eventScreenHTML = `
    <div id="event-screen">
        <p id="event-screen-message" style="background: ${COLOR}"></p>
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
            (EVENT_SCREEN_OPTIONS[i] as HTMLButtonElement).disabled = true;
            (EVENT_SCREEN_OPTIONS[i] as HTMLButtonElement).style.pointerEvents = 'none';
        }
    }
    document.getElementById('event-screen').classList.add('fade-in');

    // Wait before displaying the message box
    await new Promise(resolve => setTimeout(resolve, game.getAnimationDuration('fade-in')));
    document.getElementById('event-screen-message').style.display = 'flex'
    document.getElementById('event-screen-message').classList.add('move-up');

    // Wait before displaying the message
    await new Promise(resolve => setTimeout(resolve, 500));
    await returnMessage(event.message, 'event-screen-message');

    // Stop code execution until an option is chosen
    let chosenOption = await new Promise(resolve => {
        for (let i = 0; i < EVENT_SCREEN_OPTIONS.length; i++) {
            EVENT_SCREEN_OPTIONS[i].addEventListener('click', () => {
                console.log(event.options[i])
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
        (EVENT_SCREEN_OPTIONS[i] as HTMLButtonElement).disabled = true;
        (EVENT_SCREEN_OPTIONS[i] as HTMLButtonElement).style.pointerEvents = 'none';

        if (event.options[i] !== chosenOption) {
            (EVENT_SCREEN_OPTIONS[i] as HTMLButtonElement).classList.add('fade-out');
            (EVENT_SCREEN_OPTIONS[i] as HTMLButtonElement).style.animationDuration = '0.4s';
        }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));

    //fade out the button that the player selected earlier
    for (let element in EVENT_SCREEN_OPTIONS) {
        if (event.options[element] === chosenOption) {
            (EVENT_SCREEN_OPTIONS[element] as HTMLButtonElement).classList.add('fade-out');
            (EVENT_SCREEN_OPTIONS[element] as HTMLButtonElement).style.animationDuration = '0.4s';
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

function chooseRandomEvent(events: Event[]) {
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

export async function applyEventEffects(event: EffectChanges) {
    const CURRENT_PLAYER = game.getCurrentPlayer();
    if (event.maxHpChange) changeHealth({ changeValue: event.maxHpChange, changeMaxHp: true });
    if (event.maxHpChangePercentage) changeHealth({ changeValue: event.maxHpChangePercentage, isPercentage: true, changeMaxHp: true });
    if (event.hpChange) changeHealth({ changeValue: event.hpChange });
    if (event.hpChangePercentage) changeHealth({ changeValue: event.hpChangePercentage, isPercentage: true });
    if (event.livesChange) {
        CURRENT_PLAYER.lives += event.livesChange;
    }
    if (event.baseDamageChange) {
        CURRENT_PLAYER.baseDamage += event.baseDamageChange;
    }
    if (event.critChanceChange) {
        CURRENT_PLAYER.critChance += event.critChanceChange;
    }
    if (event.wpChange) changeWp({ wpChange: event.wpChange });
    if (event.othersWpChange) changeWp({ wpChange: event.othersWpChange, applyToAllOtherPlayers: true });
    if (event.karmaChange) {
        CURRENT_PLAYER.currentKarma += event.karmaChange;
    }
    if (event.othersHpChange) changeHealth({ changeValue: event.othersHpChange, applyToAllOtherPlayers: true });
    if (event.othersHpChangePercentage) changeHealth({ changeValue: event.othersHpChangePercentage, isPercentage: true, applyToAllOtherPlayers: true });
    if (event.getRandomSpell) {
        CURRENT_PLAYER.spells.push(await getRandomSpell());
    }
    if (event.loseRandomSpell) {
        CURRENT_PLAYER.spells.splice(Math.floor(Math.random() * CURRENT_PLAYER.spells.length), 1);
    }
    if (event.customEffect) event.customEffect();
    game.checkStatBounds(true);
}

function previewEventEffects(event: EffectChanges) {
    const CURRENT_PLAYER = game.getCurrentPlayer();
    let html = '';

    console.log(event);

    if (event.hpChange) {
        let newHp = CURRENT_PLAYER.currentHp + event.hpChange;
        if (newHp > CURRENT_PLAYER.maxHp) newHp = CURRENT_PLAYER.maxHp;
        html += formatStatChange(CURRENT_PLAYER.currentHp, newHp, event.hpChange, 'Current HP', false, CURRENT_PLAYER.maxHp);
    }
    if (event.hpChangePercentage) {
        let newHp = CURRENT_PLAYER.currentHp + Math.round(CURRENT_PLAYER.maxHp * (event.hpChangePercentage / 100));
        if (newHp > CURRENT_PLAYER.maxHp) newHp = CURRENT_PLAYER.maxHp;
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
        if (newWp > CURRENT_PLAYER.maxWp) newWp = CURRENT_PLAYER.maxWp;
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

function formatStatChange(
    currentStat: number,
    newStat: number,
    statChange: number | string,
    statName: string,
    isPercentage?: boolean,
    maxStat?: number): string {

    let statColor = '';

    console.log(currentStat, maxStat, newStat, statChange, statName, isPercentage)

    if (newStat == currentStat) {
        statColor = SAME_NEW_STAT_COLOR;
    } else if (newStat > currentStat) {
        statColor = RAISED_NEW_STAT_COLOR;
    } else {
        statColor = LOWERED_NEW_STAT_COLOR;
    }

    let statChangeString = '';

    if (isPercentage == true && !statName.includes('Crit')) {
        if (statChange as number > 0) {
            statChangeString = `(+${statChange}%/${maxStat})`;
            console.log(statChangeString);
        } else if (statChange as number < 0) {
            statChangeString = `(${statChange}%/${maxStat})`;
        }
    } else if (isPercentage == true && statName.includes('Crit')) {
        if (statChange as number > 0) {
            statChangeString = `(+${statChange}%)`;
        } else if (statChange as number < 0) {
            statChangeString = `(${statChange}%)`;
        }
    } else if (statChange as number > 0) {
        statChangeString = `(+${statChange})`;
    } else if (statChange as number < 0) {
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
    `
    return HTML;
}

// By default, the function changes the current player's health using an integer value.
export function changeHealth(parameters: { changeValue: number, changeMaxHp?: boolean, isPercentage?: boolean, applyToAllOtherPlayers?: boolean }) {
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
    } else if (APPLY_TO_ALL_OTHER_PLAYERS == false && CHANGE_MAX_HP == false) {
        CURRENT_PLAYER.currentHp += IS_PERCENTAGE == true ? Math.round(CURRENT_PLAYER.maxHp * (CHANGE_VALUE / 100)) : CHANGE_VALUE;
        // Change maximum HP code snippet
    } else if (APPLY_TO_ALL_OTHER_PLAYERS == true && CHANGE_MAX_HP == true) {
        for (let i = 0; i < PLAYER_LIST.length; i++) {
            if (PLAYER_LIST[i] !== CURRENT_PLAYER) {
                PLAYER_LIST[i].maxHp += IS_PERCENTAGE == true ? Math.round(PLAYER_LIST[i].maxHp * (CHANGE_VALUE / 100)) : CHANGE_VALUE;
            }
        }
    } else if (APPLY_TO_ALL_OTHER_PLAYERS == false && CHANGE_MAX_HP == true) {
        CURRENT_PLAYER.maxHp += IS_PERCENTAGE == true ? Math.round(CURRENT_PLAYER.maxHp * (CHANGE_VALUE / 100)) : CHANGE_VALUE;
    }
}

function changeWp(parameters: { wpChange: number, applyToAllOtherPlayers?: boolean }) {
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

    } else {
        CURRENT_PLAYER.currentWp += WP_CHANGE;
        game.checkStatBounds(false);
    }

}

export async function returnMessage(message: string, id: string) {
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