

let currentQuestionIndex = 0;
let questions = [];
let totalScore = 0;
let correctCount = 0;
let currentCategory = "";
async function fetchTrivia(categoryId) {
 
    currentCategory = categoryId;

 
    if (!categoryId) {
        console.error("Invalid category ID:", categoryId);
        return;
    }

    let url = "https://opentdb.com/api.php?amount=10&type=multiple&category=" + categoryId;
    try {
        const response = await fetch(url);
        const data = await response.json();
     
        questions = data.results;
        currentQuestionIndex = 0;
        totalScore = 0;
        correctCount = 0;
     
        displayQuestion();
    } catch (error) {
        console.error("Error fetching trivia data:", error);
    }
}


function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const questionData = questions[currentQuestionIndex];
    const questionText = document.getElementById("question-text");
    const answersContainer = document.getElementById("answer-buttons");

    
    questionText.innerHTML = questionData.question;
    answersContainer.innerHTML = ""; 

   
    let choices = [...questionData.incorrect_answers, questionData.correct_answer];
    choices.sort(() => Math.random() - 0.5);

    choices.forEach(choice => {
        let button = document.createElement("button");
        button.textContent = choice;
        button.classList.add("answer-choice");
        button.dataset.correct = (choice === questionData.correct_answer) ? "true" : "false";
        button.onclick = () => handleAnswer(button);
        answersContainer.appendChild(button);
    });

    startTimer(nextQuestion);
}


function handleAnswer(selectedButton) {
    clearInterval(timerInterval);
    revealAnswers();


    if (selectedButton.dataset.correct === "true") {
        correctCount++;
        let points = calculatePoints(timeLeft); 
        totalScore += points; 
        console.log(`Points Earned: ${points}, Total Score: ${totalScore}`);
    } else {
        console.log("Wrong answer -> 0 points");
    }

    document.querySelectorAll(".answer-choice").forEach(button => {
        button.disabled = true;
    });

 
    setTimeout(nextQuestion, 2000);
    //2000 = 2 seconds, 2000(miliseconds)
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function calculatePoints(timeLeft) {

    if (timeLeft <= 0) return 0;

    
    // If answered in 3 seconds they get 1000 points other wise they lose 50 points per second
    let timeUsed = 20 - timeLeft;
    if (timeUsed <= 3) {
        return 1000;
    }
    let pointsLost = (timeUsed - 3) * 50;
    let finalScore = 1000 - pointsLost;
    return (finalScore < 0) ? 0 : finalScore;
}


function showResults() {
    const questionText = document.getElementById("question-text");
    const answersContainer = document.getElementById("answer-buttons");

   
    questionText.innerHTML =  "You answered " + correctCount + " out of " + questions.length + " questions correctly!<br>" +"Your total score is " + totalScore + " points.";

    answersContainer.innerHTML = "";

    let restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart";
    restartBtn.classList.add("answer-choice");
    restartBtn.onclick = restartGame;
    answersContainer.appendChild(restartBtn);
}

function restartGame() {
    fetchTrivia(currentCategory);
}


document.addEventListener("DOMContentLoaded", () => {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    let category = getQueryParam("category");
    console.log("🎯 Selected Category:", category);

    if (category) {
        fetchTrivia(category);
    } else {
        document.getElementById("question-text").textContent = "Error: No category selected";
    }
});

window.fetchTrivia = fetchTrivia;
