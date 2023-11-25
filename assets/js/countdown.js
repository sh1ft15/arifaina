const getCountDown = (countDownDate) => {
    let now = new Date().getTime(),
        distance = countDownDate - now;
        
    if (distance < 0) { return null; }
    else {
        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        }
    }
}


export default getCountDown;