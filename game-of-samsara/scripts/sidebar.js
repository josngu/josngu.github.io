import * as game from './index.js';
import * as events from './events.js';
import * as music from './music.js';
export function showSpells() {
    document.getElementById('btn-player-stats-page').classList.remove('btn-active');
    document.getElementById('btn-player-spells-page').classList.add('btn-active');
    document.getElementById('player-stats-page').style.display = 'none';
    document.getElementById('player-spells-page').style.display = 'flex';
    document.getElementById('player-spells-page').innerHTML = '';
    document.getElementById('player-stats-page').innerHTML = '';
    // If the player has no spells, make a <p> tag that says "You have no spells"
    if (game.getCurrentPlayer().spells.length === 0) {
        let noSpellsHTML = `<p id='no-spells-text'>You have no ॐ spells.</p>`;
        document.getElementById('player-spells-page').insertAdjacentHTML('afterbegin', noSpellsHTML);
        return;
    }
    for (let i = 0; i < game.getCurrentPlayer().spells.length; i++) {
        let spell = game.getCurrentPlayer().spells[i];
        let spellHTML = `
        <div id="spell-${game.gameState.currentPlayerNumber}-${i}" class="btn-spell">
            <h3>${spell.spellName}</h3>
            <p>${spell.description}</p>
        </div>`;
        document.getElementById('player-spells-page').insertAdjacentHTML('afterbegin', spellHTML);
        // add mouse enter event listener to play the button hover sound fx
        document.getElementById(`spell-${game.gameState.currentPlayerNumber}-${i}`).addEventListener('mouseenter', () => {
            music.playButtonHoverSound();
        });
        if (game.gameState.hasUsedSpell == false) {
            document.getElementById(`spell-${game.gameState.currentPlayerNumber}-${i}`).addEventListener('click', () => {
                if (game.gameState.hasUsedSpell)
                    return;
                disableSpells();
                // use the name of the spell in the h3 tag to find the spell in the player's spells array to delete it
                let spellName = document.getElementById(`spell-${game.gameState.currentPlayerNumber}-${i}`).querySelector('h3').textContent;
                let spellIndex = game.getCurrentPlayer().spells.findIndex(spell => spell.spellName === spellName);
                game.getCurrentPlayer().spells.splice(spellIndex, 1);
                document.getElementById(`spell-${game.gameState.currentPlayerNumber}-${i}`).classList.add('spell-leave');
                document.getElementById(`spell-${game.gameState.currentPlayerNumber}-${i}`).querySelector('h3').classList.add('spell-contents-leave');
                document.getElementById(`spell-${game.gameState.currentPlayerNumber}-${i}`).querySelector('p').classList.add('spell-contents-leave');
                // remove .spell-leave class after animation duration
                setTimeout(() => {
                    if (document.getElementById(`spell-${game.gameState.currentPlayerNumber}-${i}`)) {
                        document.getElementById(`spell-${game.gameState.currentPlayerNumber}-${i}`).remove();
                    }
                }, game.getAnimationDuration('spell-leave'));
                // Then apply the effect
                showSpellName(spell.spellName);
                game.log(`${game.getCurrentPlayer().playerName} uses "${spell.spellName}".`, game.getCurrentPlayer().hexColor);
                // wait 500ms
                setTimeout(() => {
                    // apply the effect
                    events.applyEventEffects(spell.effect);
                }, 500);
            });
        }
    }
    // If the player has used a spell, disable all spells
    if (game.gameState.hasUsedSpell === true)
        disableSpells();
}
export function disableSpells() {
    game.gameState.hasUsedSpell = true;
    for (let i = 0; i < game.getCurrentPlayer().spells.length; i++) {
        if (document.getElementById(`spell-${game.gameState.currentPlayerNumber}-${i}`)) {
            document.getElementById(`spell-${game.gameState.currentPlayerNumber}-${i}`).classList.add('btn-disabled');
        }
    }
}
export function showStats() {
    const CURRENT_PLAYER = game.getCurrentPlayer();
    document.getElementById('btn-player-spells-page').classList.remove('btn-active');
    document.getElementById('btn-player-stats-page').classList.add('btn-active');
    document.getElementById('player-spells-page').style.display = 'none';
    document.getElementById('player-stats-page').style.display = 'flex';
    document.getElementById('player-spells-page').innerHTML = '';
    document.getElementById('player-stats-page').innerHTML = '';
    let statsHTML = `
    <div id="stats">
        <div class='stats-progenitor'>
            <p>Progenitor</p>
            <h3>${CURRENT_PLAYER.progenitor}</h3>
        </div>
        <div class='stats-row'>
            <p>Base Attack</p><p>${CURRENT_PLAYER.baseDamage}</p>
        </div>
        <div class='stats-row'>
            <p>Crit Chance</p><p>${CURRENT_PLAYER.critChance}%</p>
        </div>
        <div class='stats-row'>
            <p>Crit Multiplier</p><p>${CURRENT_PLAYER.critDamageMultiplier}x</p>
        </div>
        <div class='stats-row'>
            <p>Dmg Resistance</p><p>${CURRENT_PLAYER.damageResistance}%</p>
        </div>
        <div class='stats-row'>
            <p>Evasion</p><p>${CURRENT_PLAYER.evasionChance}%</p>
        </div>
        <div class='stats-row'>
            <p>Lifesteal</p><p>${CURRENT_PLAYER.lifeSteal}%</p>
        </div>
        <div class='stats-row'>
            <p>Follow-Up Atk Chance</p><p>${CURRENT_PLAYER.attackFollowUpChance}%</p>
        </div>
    </div>`;
    document.getElementById('player-stats-page').insertAdjacentHTML('afterbegin', statsHTML);
}
export function showSidebar() {
    document.getElementById('sidebar').style.display = 'flex';
    document.getElementById('sidebar').classList.remove('hide-sidebar');
    document.getElementById('sidebar').classList.add('show-sidebar');
    let sidebarBGColor = game.getCurrentPlayer().darkenedRGBColor;
    document.getElementById('sidebar').style.backgroundColor = `rgb(${sidebarBGColor[0]}, ${sidebarBGColor[1]}, ${sidebarBGColor[2]}, 0.8)`;
    document.getElementById('player-spells-page').innerHTML = '';
    showSpells();
}
export function hideSidebar() {
    document.getElementById('sidebar').classList.remove('show-sidebar');
    document.getElementById('sidebar').classList.add('hide-sidebar');
    setTimeout(() => {
        document.getElementById('sidebar').style.display = 'none';
    }, game.getAnimationDuration('hide-sidebar'));
}
// The casting prompt shows on the screen like Octopath Traveler
export function showSpellName(spellName, duration) {
    let color = game.getCurrentPlayer().darkenedRGBColor;
    let spellNameMessageHTML = `
    <div id='spell-name-message' class='fade-in'>
        <p>${spellName}</p>
    </div>`;
    document.body.insertAdjacentHTML('afterbegin', spellNameMessageHTML);
    document.getElementById('spell-name-message').style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`;
    document.getElementById('spell-name-message').style.outline = `1px solid rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`;
    setTimeout(() => {
        //remove fade-in class and add fade-out class
        document.getElementById('spell-name-message').classList.remove('fade-in');
        document.getElementById('spell-name-message').classList.add('fade-out');
        //then remove the element after the animation duration
        setTimeout(() => {
            document.getElementById('spell-name-message').remove();
        }, game.getAnimationDuration('fade-out'));
    }, duration ? duration : 1500);
}
//# sourceMappingURL=sidebar.js.map