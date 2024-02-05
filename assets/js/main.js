import getCountDown from './countdown.js';
import initParticles from './particle.js';
import './message.js';

// init
fetch('assets/json/main.json')
.then(response => response.json())
.then(json => {
    document.body.style.opacity = '';
    
    for(const key in json) {
        if (key.includes("cp_phone")) {
            document.querySelectorAll('a[data-phone="{'+ key +'}"]').forEach(phone => { 
                phone.href ="tel:+6" + json[key];
            });
            document.querySelectorAll('a[data-whatsapp="{'+ key +'}"]').forEach(phone => { 
                phone.href = "https://api.whatsapp.com/send?phone=6" + json[key]; 
            });
        }
        else {
            let elems = getElement(key);

            elems.forEach(elem => {
                elem.innerText = json[key];
            });
        }
    }
});

AOS.init();
feather.replace();
initParticles("#cfae85");

// countdown
let countdown = {
    date: new Date("April 20, 2024 00:00:00").getTime(),
    day: document.getElementById("ctd-day"),
    hour: document.getElementById("ctd-hour"),
    min: document.getElementById("ctd-minute"),
    sec: document.getElementById("ctd-second"),
    instance: null,
    init () {
        if (countdown.date) {
            let timer = getCountDown(countdown.date);

            if (timer) {
                countdown.day.innerText = timer.days;
                countdown.hour.innerText = timer.hours;
                countdown.min.innerText = timer.minutes;
                countdown.sec.innerText = timer.seconds;
            }
            else if (countdown.instance) { 
                clearInterval(countdown.instance); 
            }
        }
    }
};

countdown.instance = setInterval(countdown.init, 1000);

// audio
let audio_player = {
    play_btn: document.getElementById('audio-play'),
    pause_btn: document.getElementById('audio-pause'),
    sound: null,
    play (restart) {
        audio_player.play_btn.style.display = 'none';
        audio_player.pause_btn.style.display = '';

        if (audio_player.sound) { 
            // restart on finish
            audio_player.sound.play({ onfinish: () => { audio_player.play(true); } }); 
        }
    },
    pause () {
        audio_player.play_btn.style.display = '';
        audio_player.pause_btn.style.display = 'none';

        if (audio_player.sound) { audio_player.sound.pause(); }
    },
    init () {
        soundManager.setup({
            url: 'assets/audio/soundmanager2.swf',
            flashVersion: 9,
            onready: function() {
                audio_player.sound = soundManager.createSound({url: 'assets/audio/full_1.mp3', volume: 80});
            },
            // prompt on error
            ontimeout: () => { console.log("Failed to play audio"); }
        });
    }
};

audio_player.init();

// preload
let reanimates = document.querySelectorAll('.re-animate');

document.addEventListener("DOMContentLoaded", () => {
    reanimates.forEach(div => { 
        div.classList.remove('aos-animate'); 
    });
});

document.getElementById('init-card').addEventListener('click', () => {
    let player = document.querySelector('.audio-player'),
        preload = document.querySelector('.preload'),
        main = document.querySelector('.main');

    if (player && preload && main) {
        document.body.style.overflow = 'auto';
        preload.style.display = 'none';

        player.classList.remove('opacity-0'); 
        main.classList.remove('blur-sm'); 

        reanimates.forEach(div => { 
            div.classList.add('aos-animate'); 
        });

        // ini audio
        audio_player.play();
        audio_player.play_btn.addEventListener('click', () => { audio_player.play(); });
        audio_player.pause_btn.addEventListener('click', () => { audio_player.pause(); });
    }
});

// reset scroll
window.onbeforeunload = () => { window.scrollTo(0, 0); }

function getElement(search) {
    return Array.from(document.querySelectorAll('*')).filter((dom) => 
        { return dom.children.length === 0 && dom.textContent.includes('{'+ search +'}'); }
    );
}