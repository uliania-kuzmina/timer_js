let countdownInterval; //переменная для хранения интервала
let alarmSound = new Audio("beep.wav")

function startCountdown() {
    clearInterval(countdownInterval); //очищаем предыдущий таймер

    let input = document.getElementById("dateInput").value;
    let targetDate = new Date(input).getTime();

    if (isNaN(targetDate)) {
        document.getElementById("countdown").textContent = "Выберите корректную дату!";
        return;
    }

    localStorage.setItem("targetDate", targetDate); //сохраняем дату в localStorage

    let totalTime = targetDate - new Date().getTime();

    countdownInterval = setInterval(function(){
        let now = new Date().getTime();
        let timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").textContent = "Время вышло!";

            alarmSound.play();
            return;
        }

        let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeLeft % (1000 * 60 * 60 *24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeLeft  % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("countdown").textContent =
        `Осталось: ${days}д ${hours}ч ${minutes}м ${seconds}с`;

        updateCircle(timeLeft, totalTime)
    }, 1000)
}


function checkSavedCountdown(){
    let savedDate = Number(localStorage.getItem("targetDate"));

    if (savedDate){
        let now = new Date().getTime();
        if(savedDate > now) {
            let totalTime = savedDate - now;
            startCountdown()
        } else {
            localStorage.removeItem("targetDate"); //удаляем, если время вышло
        }
    }
}

function updateCircle(timeLeft, totalTime){
    let circle = document.getElementById("progressCircle");
    if (!circle || totalTime <= 0) return;

    let percent = timeLeft / totalTime;
    let offset = 377 * (1 - percent);
    circle.style.strokeDashoffset = offset;
}

// вызываем при загрузке страницы
window.onload = function(){
    checkSavedCountdown();
    let savedDate = Number(localStorage.getItem("targetDate"));
    if (savedDate) {
        let now = new Date().getTime();
        let totalTime = savedDate - now;
        updateCircle(savedDate - now, totalTime);
    }
}

function resetCountdown(){
    clearInterval(countdownInterval);
    localStorage.removeItem("targetDate");
    document.getElementById("countdown").textContent = "Выберите дату и нажмите кнопку"

    let circle = document.getElementById("progressCircle");

    if (circle){
        circle.style.strokeDashoffset = 377; //сбрасываем круг
    }
}