import { Event } from './events';
import * as game from './index.js';

export const RED_EVENT_LIST: Event[] = [{
    message: 'You believe your neighbour is a heretic. You decide to teach them a lesson.',
    options: [
        { label: `Vandalize your neighbour's shrine`, effect: { karmaChange: -4 } },
        { label: `Destroy your neighbour's shrine`, effect: { karmaChange: -8, getRandomSpell: true } }
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
        { label: 'Escape with all your might.', description: 'You have a 99% chance of living.', effect: { wpChange: -2, customEffect: () => mudslide(-1) } }
    ],
    chance: 1
},
{
    message: `You catch your neighbour watching indecent content.`,
    options: [
        { label: 'Scold them.', description: 'Your neighbour has a 60% chance of hitting you for 30 HP.', effect: { karmaChange: 2, customEffect: () => neighbourCaughtWatchingIndecentContent() } },
        { label: 'Join them.', effect: { wpChange: 1, karmaChange: -3 } },
        { label: 'Ignore them.', effect: {} }
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

function neighbourCaughtWatchingIndecentContent() {
    // Your neighbour has a 60% chance of hitting you for 30 HP.
    if (Math.random() < 0.6) {
        game.getCurrentPlayer().currentHp -= 30;
    }
}