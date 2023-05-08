const operators = ['+', '-', '*', '/'];

function generateQuestions() {
    const questions = [];
    for(let i=0; i<500; i++){
        const num1 = Math.floor(Math.random() * 100);
        const num2 = Math.floor(Math.random() * 100);
        const operator = operators[Math.floor(Math.random() * operators.length)];    
        const question = `${num1} ${operator} ${num2}`;
        questions.push(question);
    }
    
    return questions;
}

module.exports = generateQuestions;