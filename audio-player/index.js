const songs = [
    {
        name: 'Numb',
        band: 'Linkin Park',
        src: './assets/audio/Numb.mp3',
        cover: './assets/img/numb.jpg',
    },
    {
        name: 'Reality',
        band: 'Lost Frequencies',
        src: './assets/audio/Reality.mp3',
        cover: './assets/img/reality.jpg',
    },
    {
        name: 'Therapy',
        band: 'All Time Low',
        src: './assets/audio/Therapy.mp3',
        cover: './assets/img/therapy.jpg',
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
let isPlay = false;
let number = 0;

function playAudio() {
    if (!isPlay) {
        audio.play();
        playButton.style.display = 'none';
        pauseButton.style.display = 'flex';
        isPlay = true;
    } else {
        audio.pause();
        playButton.style.display = 'flex';
        pauseButton.style.display = 'none';
        isPlay = false;
    }
}

function formateTime(time) {
    let sec = Math.floor(time % 60).toString().padStart(2, '0');
    let min = Math.floor(time / 60).toString().padStart(2, '0');
    return `${min}:${sec}`
}

playButton.addEventListener('click', playAudio);
pauseButton.addEventListener('click', playAudio);

progressBar.addEventListener('input', (event) => {
    const seekTime = (audio.duration / 100) * event.target.value;
    audio.currentTime = seekTime;
});
  
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;


    currentTimeValue.innerHTML = '';
    durationTimeValue.innerHTML = '';
   
    currentTimeValue.innerHTML = formateTime(audio.currentTime);
    durationTimeValue.innerHTML = formateTime(audio.duration);

    let valPercent = progressBar.valueAsNumber / 100;
    progressBar.style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop('+ valPercent+', #E9DCC9), color-stop('+ valPercent+', #202639));';

    if (audio.currentTime == audio.duration){
        playAudio();
    }
});


function makePlayList (numb) {
    if (number === songs.length) {
        number = 0;
    }

};

makePlayList(number);
