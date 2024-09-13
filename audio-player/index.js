const songs = [
    {
        name: 'Numb',
        band: 'Linkin Park',
        src: './assets/audio/Numb.mp3',
        cover: './assets/img/numb.jpg',
        background: './assets/img/numbBackground.jpg',
    },
    {
        name: 'Reality',
        band: 'Lost Frequencies',
        src: './assets/audio/Reality.mp3',
        cover: './assets/img/reality.jpg',
        background: './assets/img/realityBackground.jpg',
    },
    {
        name: 'Therapy',
        band: 'All Time Low',
        src: './assets/audio/Therapy.mp3',
        cover: './assets/img/therapy.jpg',
        background: './assets/img/therapyBackground.jpg',
    },
]

const audio = document.querySelector('audio');
const playButton = document.querySelector('.play');
const pauseButton = document.querySelector('.pause');
const progressBar = document.querySelector('.progress-bar');
const currentTimeValue = document.querySelector('.currentTime');
const durationTimeValue = document.querySelector('.durationTime');
const nextButton = document.querySelector('.player__buttons_left');
const previousButton = document.querySelector('.player__buttons_right');
const songName = document.querySelector('.player__song');
const singerName = document.querySelector('.player__singer');
const imgSong = document.querySelector('.imgSong');

let number = 0;

function playAudio() {
    audio.play();
    playButton.style.display = 'none';
    pauseButton.style.display = 'flex';
}

function pauseAudio() {
    audio.pause();
    playButton.style.display = 'flex';
    pauseButton.style.display = 'none';
}

function formateTime(time) {
    const sec = Math.floor(time % 60).toString().padStart(2, '0');
    const min = Math.floor(time / 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

function updateProgressBar() {
    const currentTime = audio.currentTime || 0;
    const duration = audio.duration || 0;

    currentTimeValue.innerHTML = formateTime(currentTime);
    durationTimeValue.innerHTML = formateTime(duration);

    const progress = (currentTime / duration) || 0;
    progressBar.value = progress * 100;
    progressBar.style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(' + progress + ', #E9DCC9), color-stop(' + progress + ', #202639));';
}

function makePlayer(song) {
    number = songs.indexOf(song);

    audio.src = song.src;
    imgSong.src = song.cover;
    document.body.style.backgroundImage = `url(${song.background})`;
    songName.innerHTML = song.name;
    singerName.innerHTML = song.band;

    updateProgressBar();
}

function playNext() {
    const nextNumber = number + 1;
    if (nextNumber === songs.length) {
        makePlayer(songs[0]);
    } else {
        makePlayer(songs[nextNumber]);
    }
    playAudio();
}

function playPrevious() {
    const previousNumber = number - 1;
    if (previousNumber < 0) {
        makePlayer(songs[songs.length - 1]);
    } else {
        makePlayer(songs[previousNumber]);
    }
    playAudio();
}

playButton.addEventListener('click', playAudio);
pauseButton.addEventListener('click', pauseAudio);

progressBar.addEventListener('input', (event) => {
    const seekTime = (audio.duration / 100) * event.target.value;
    audio.currentTime = seekTime;
});

audio.addEventListener('timeupdate', () => {
    updateProgressBar();

    if (audio.currentTime == audio.duration) {
        playNext();
    }
});

nextButton.addEventListener('click', playNext);
previousButton.addEventListener('click', playPrevious);

audio.addEventListener('loadedmetadata', () => {
    updateProgressBar();
});

makePlayer(songs[number]);
