import getCountDown from './countdown.js';
import initParticles from './particle.js';
import './message.js';

let ctd_date = new Date("April 20, 2024 00:00:00").getTime(),
    ctd_day = document.getElementById("ctd-day"),
    ctd_hour = document.getElementById("ctd-hour"),
    ctd_min = document.getElementById("ctd-minute"),
    ctd_sec = document.getElementById("ctd-second");

function getElement(search) {
    return Array.from(document.querySelectorAll('*')).filter((dom) => 
        { return dom.children.length === 0 && dom.textContent.includes('{'+ search +'}'); }
    );
}

fetch('assets/json/main.json')
.then(response => response.json())
.then(json => {
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

let ctd = setInterval(function() {
    let timer = getCountDown(ctd_date);

    if (timer) {
        ctd_day.innerText = timer.days;
        ctd_hour.innerText = timer.hours;
        ctd_min.innerText = timer.minutes;
        ctd_sec.innerText = timer.seconds;
    }
    else { clearInterval(ctd); }
}, 1000);