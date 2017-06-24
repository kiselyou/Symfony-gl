var timerElement = document.body.querySelector('[data-404-timer]');
var timerTime = Number(timerElement.getAttribute('data-404-timer'));

var timerId = setInterval(function () {
    if (timerTime <= 0) {
        clearInterval(timerId);
        window.location.href = timerElement.getAttribute('data-404-goto');
    }
    timerElement.innerHTML = timerTime;
    timerTime--;
}, 1000);
