import { Event } from './events';
import * as game from './index.js';

export const RED_EVENT_LIST: Event[] = [{
    message: 'You believe your neighbour is a heretic. You decide to teach them a lesson.',
    options: [
        { label: `Vandalize your neighbour's shrine`, effect: { karmaChange: -5 } },
        { label: `Destroy your neighbour's shrine`, effect: { karmaChange: -10, getRandomSpell: true } }
    ],
    chance: 1
},
{
    message: `You get into an argument with your neighbour. It's getting heated.`,
    options: [
        { label: 'Attempt to resolve', effect: {} },
        { label: 'Prepare to defend yourself', effect: {} },
        { label: 'Strike first', effect: { karmaChange: -5 } }
    ],
    chance: 1
},
{
    message: `You get caught in a lahar (mudslide). Your chances of living through this don't look good.`,
    options: [
        { label: 'Try to get out.', description: 'You have a 50% chance of dying.', effect: { customEffect: () => mudslide() } },
        { label: 'Escape with all your might.', description: 'You have a 99% chance of living.', effect: { wpChange: -3, customEffect: () => mudslide(-1) } }
    ],
    chance: 2
},
];

function mudslide(wpChange?: -1) {
    if (wpChange == -1) {
        if (Math.random() < 0.01) {
            game.getCurrentPlayer().currentHp = 0;
        }
    } else {
        //the player has a 50% chance of dying
        if (Math.random() < 0.5) {
            game.getCurrentPlayer().currentHp = 0;
            console.log(game.getCurrentPlayer());
        }
    }
}