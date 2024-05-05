import * as gameboard from './gameboard.js';
import * as game from './index.js';
import * as music from './music.js';
export const SPELL_LIST = [{
        spellName: 'Essence of Vishnu',
        description: 'Fully heals the player, increases their max HP by 10%, and gives an extra life.',
        effect: { maxHpChangePercentage: 10, hpChangePercentage: 100, livesChange: 1 },
    },
    {
        spellName: 'Essence of Shiva',
        description: 'A devastating earthquake strikes the board, reducing all players to 1 HP.',
        effect: { customEffect: essenceOfShiva },
    },
    {
        spellName: 'Essence of Brahma',
        description: 'Fully restores WP.',
        effect: { wpChange: 6 },
    },
    {
        spellName: 'Divine Healing',
        description: 'Heal 100 HP.',
        effect: { hpChange: 100 },
    },
    {
        spellName: 'Divine Blessing',
        description: 'Gain an extra life.',
        effect: { livesChange: 1 },
    },
    {
        spellName: 'Divine Delusion',
        description: 'Reset the gameboard.',
        effect: { customEffect: gameboard.remakeGameboard },
    },];
function essenceOfShiva() {
    music.playSound('earthquake', 0.5);
    for (let player in game.gameState.playerList) {
        game.gameState.playerList[player].currentHp = 1;
    }
}
//# sourceMappingURL=spellList.js.map