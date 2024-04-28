import { Event } from './events';

export const BLUE_EVENT_LIST: Event[] = [{
    message: 'You arrive at a shrine to pray. What would you like to pray for?',
    options: [
        { label: 'Your health', effect: { hpChangePercentage: 33 } },
        { label: 'Power', effect: { baseDamageChange: 6, critChanceChange: 1 } },
        { label: 'Willpower', effect: { wpChange: 2 } },
        { label: `Others' health`, effect: { karmaChange: 5, othersHpChangePercentage: 50 } }
    ],
    chance: 2
},
{
    message: 'You arrive at a shrine to pray, needing something more.',
    options: [
        { label: 'I wish for another chance at life', effect: { hpChangePercentage: 5, livesChange: 1 } },
        { label: 'I wish to be more resilient', effect: { baseDamageChange: 6, critChanceChange: 1 } },
        { label: 'I wish for nothing; I am grateful', effect: { karmaChange: 5 } }
    ],
    chance: 1
},
{
    message: 'You perform a workout.',
    options: [
        { label: 'Perform light cardio.', effect: { hpChangePercentage: 5, baseDamageChange: 4 } },
        { label: 'Challenge yourself.', effect: { wpChange: -1, baseDamageChange: 10 } },
        { label: 'Overexert yourself.', effect: { wpChange: -2, hpChange: -20, baseDamageChange: 20 } }
    ],
    chance: 1
},
];