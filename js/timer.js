
let timeLeft = 20;
let timerInterval;
let switchTimeout;
let timeExpired = false;


function startTimer(nextQuestionCallback) {
    clearInterval(timerInterval);
    clearTimeout(switchTimeout);
    timeLeft = 20; 
    timeExpired = false;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0 && !timeExpired) {
            timeExpired = true;
            clearInterval(timerInterval);
            revealAnswers();
           
            switchTimeout = setTimeout(nextQuestionCallback, 2000);
        }
    }, 1000);
}


function updateTimerDisplay() {
    const timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.textContent = timeLeft;
    }
}

function revealAnswers() {
    document.querySelectorAll(".answer-choice").forEach(button => {
        button.disabled = true;
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        } else {
            button.classList.add("incorrect");
        }
    });
}


window.startTimer = startTimer;
window.revealAnswers = revealAnswers;
