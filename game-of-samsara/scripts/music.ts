let earlyGameMusicList = [
    {name: 'indomitable-will', calmOffset: 0.4, rageOffset: 0},
    {name: 'roar-of-dominion', calmOffset: 0.4, rageOffset: 0},
    {name: 'chasing-daybreak', calmOffset: 0.4, rageOffset: 0},
    {name: 'between-heaven-and-earth', calmOffset: 0.4, rageOffset: 0},
    {name: 'at-what-cost', calmOffset: 0.4, rageOffset: 0},
    {name: 'the-long-road', calmOffset: 0.4, rageOffset: 0},
    {name: 'dwelling-of-the-ancient-gods', calmOffset: 0.4, rageOffset: 0},
    {name: 'tearing-through-heaven', calmOffset: 0.4, rageOffset: 0},
    {name: 'divine-decree', calmOffset: 0, rageOffset: 0},
    {name: 'destiny', calmOffset: 0, rageOffset: 0},
    {name: 'alight', calmOffset: 0.1, rageOffset: 0},
];

let midGameMusicList = [
    {name: 'divine-decree', calmOffset: 0, rageOffset: 0.1},
    {name: 'destiny', calmOffset: 0, rageOffset: 0},
    {name: 'alight', calmOffset: 0.1, rageOffset: 0},
    {name: 'a-dark-fall', calmOffset: 0, rageOffset: 0.15},
    {name: 'thorn-in-you', calmOffset: 0, rageOffset: 0},
    {name: 'contest-of-pride', calmOffset: 0, rageOffset: 0},
];

let lateGameMusicList = [
    'indomitable-will',
];

let musicIsPlaying = true;
let currentlyPlayingMusicType = 'calm';
let currentlyPlayingMusic = chooseMusic();
let volume = 0.2;

// Fade from music1 to music2 and vice versa using a function
export function playMusic() {
    // Create audio elements
    let musicCalmReady = new Promise(resolve => {
        let musicCalm = document.createElement('audio');
        musicCalm.id = 'music-calm';
        musicCalm.src = `./music/${currentlyPlayingMusic.name}-calm.mp3`;
        musicCalm.volume = volume;
        musicCalm.loop = false;
        musicCalm.addEventListener('canplay', resolve);
        document.body.appendChild(musicCalm);
    });

    let musicRageReady = new Promise(resolve => {
        let musicRage = document.createElement('audio');
        musicRage.id = 'music-rage';
        musicRage.src = `./music/${currentlyPlayingMusic.name}-rage.mp3`;
        musicRage.volume = 0;
        musicRage.loop = false;
        musicRage.addEventListener('canplay', resolve);
        document.body.appendChild(musicRage);
    });

    // This should sync the two audio elements
    Promise.all([musicCalmReady, musicRageReady]).then(() => {
        (document.getElementById('music-calm') as HTMLAudioElement).currentTime = currentlyPlayingMusic.calmOffset;
        (document.getElementById('music-rage') as HTMLAudioElement).currentTime = currentlyPlayingMusic.rageOffset;
        (document.getElementById('music-calm') as HTMLAudioElement).play();
        (document.getElementById('music-rage') as HTMLAudioElement).play();
    });
}

export function crossFadeMusic() {
    if (currentlyPlayingMusicType === 'calm') {
        playSound('zoom-in-fast', 0.35);
        $('#music-calm').animate({ volume: 0 }, 1000);
        $('#music-rage').animate({ volume: volume }, 1000);
        currentlyPlayingMusicType = 'rage';

    } else {
        playSound('zoom-out', 0.2);
        $('#music-calm').animate({ volume: volume }, 1000);
        $('#music-rage').animate({ volume: 0 }, 1000);
        currentlyPlayingMusicType = 'calm';
    }
}

function chooseMusic() {
    let randomIndex = Math.floor(Math.random() * midGameMusicList.length);
    return midGameMusicList[randomIndex];
}

export function playSound(name: string, volume: number) {
    let audio = new Audio(`./sound/${name}.mp3`);
    audio.volume = volume;
    audio.play();
}

export function playButtonSelectSound() {
    playSound('button-select', 0.2);
}

export function playSpellGetSound() {
    playSound('gained-something', 0.2);

    $('#music-calm').animate({ volume: 0 }, 500);
    $('#music-rage').animate({ volume: 0 }, 500);

    setTimeout(() => {
        if (currentlyPlayingMusicType === 'calm') {
            $('#music-calm').animate({ volume: volume }, 1000);
        } else {
            $('#music-rage').animate({ volume: volume }, 1000);
        }
    }, 1500);
}