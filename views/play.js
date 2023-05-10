const questionContainer = document.querySelector('#question-container');
const durationElement = document.querySelector('.duration');
const duration = parseInt(durationElement.textContent);
const difficultyElement = document.querySelector('.difficulty');
const difficulty = parseInt(difficultyElement.textContent);
const timerElement = document.querySelector('.timer');
const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer-input');
const evaluation = document.querySelector('.evaluation');
const operators = ['+', '-', '*', '/'];
let timeLeft = duration;
let questionIndex = 0;
let score = 0;
let correct = 0;
let incorrect = 0;

function addToAnswer(value) {
    var answerInput = document.getElementById("answer-input");
    if(value === 'x'){
        answerInput.value = answerInput.value.slice(0, -1);
    } else {
        answerInput.value += value;
    }    
    const ans = eval(questions[questionIndex]).toString();
    if (answerInput.value.length === ans.length) {
        setTimeout(() => {
            checkAnswer(parseInt(answerInput.value))
        }, 100);

    }
}

function generateQuestions(difficulty) {
    const questions = [];
    let i = 0;
    while (questions.length !== 500) {
        console.log(difficulty)
        const num1 = Math.floor(Math.random() * difficulty);
        const num2 = Math.floor(Math.random() * difficulty);
        if ((num1 / num2) % 1 !== 0 || (num1 - num2) <= 0) {
            continue;
        }
        const operator = operators[Math.floor(Math.random() * operators.length)];
        const question = `${num1} ${operator} ${num2}`;
        questions.push(question);
        i++;
    }

    return questions;
}


function displayQuestion(question) {
    console.log(question);
    const words = question.split(" ");
    if (words[1] === '*') {
        words[1] = '&#10005;';
    } else if (words[1] === '/') {
        words[1] = '&#247;';
    }
    const displayQuestion = `${words[0]} ${words[1]} ${words[2]}`
    questionContainer.innerHTML = `<h3 class="question">${displayQuestion}</h3>`;
    answerInput.focus();
}

function checkAnswer(answer) {
    const currentQuestion = questions[questionIndex];
    const correctAnswer = eval(currentQuestion);
    console.log(`Comparing ${correctAnswer} & ${answer}`)
    // console.log(correctAnswer);
    if (answer === correctAnswer) {
        score++;
        correct++;
        evaluation.innerHTML = `<h1 class="right">&#x2713;</h1>`;
        setTimeout(() => {
            evaluation.innerHTML = ``;
        }, 300);
    } else {
        score = score - 2;
        incorrect++;
        questionIndex--;
        evaluation.innerHTML = `<h1 class="wrong">&#10008;</h1>`;
        setTimeout(() => {
            evaluation.innerHTML = ``;
        }, 300);
    }
    console.log(`score - ${score}`);
    questionIndex++;
    if (questionIndex >= questions.length) {
        displayScore();
    } else {
        displayQuestion(questions[questionIndex]);
    }
    answerInput.value = '';
    answerInput.focus();
}

function displayScore() {
    questionContainer.innerHTML = `
      <h3>Game Over!</h3>
      <p>Your score is ${score} out of ${questions.length}.</p>
    `;
    answerInput.disabled = true;
}

function updateTimer(score) {
    const seconds = timeLeft;
    timerElement.innerHTML = `<h2 class="time"><i class="fa fa-clock-o" style="font-size:48px;color:rgb(255, 217, 93);"></i> ${seconds}</h2>`;
    timeLeft--;

    if (timeLeft < 0) {
        clearInterval(timerInterval);
        // redirect to the result page
        window.location.href = `/result/${score}/${correct}/${incorrect}`;
    }
}

// MAIN
questions = generateQuestions(difficulty);
console.log(questions);
displayQuestion(questions[0]);

window.addEventListener("keydown", function (event) {
    // Check if the pressed key is a numeric key (0-9)
    if (event.keyCode >= 48 && event.keyCode <= 57) {
        // Append the corresponding digit to the answer input field
        answerInput.value += String.fromCharCode(event.keyCode);
        const ans = eval(questions[questionIndex]).toString();
        if (answerInput.value.length === ans.length) {
            setTimeout(() => {
                checkAnswer(parseInt(answerInput.value))
            }, 100);

        }
    }else if (event.keyCode === 8) {
        // Check if the pressed key is the backspace key
        // Remove the last character from the answer input field
        answerInput.value = answerInput.value.slice(0, -1);
      }
});


const timerInterval = setInterval(() => {
    updateTimer(score);
}, 1000);