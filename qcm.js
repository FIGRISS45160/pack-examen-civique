let currentQuestion = 0;
let score = 0;
let timer = 0;
let timerInterval;
let mode = '';

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startExamen() {
    mode = 'examen';
    currentQuestion = 0;
    score = 0;
    let examQuestions = shuffle(questions).slice(0, 35);
    window.examQuestions = examQuestions; // Global pour accès
    timer = 25 * 60;
    showQuestion();
    startTimer();
}

function startApprentissage() {
    mode = 'apprentissage';
    currentQuestion = 0;
    score = 0;
    window.allQuestions = questions; // Toutes questions
    showQuestion();
}

function showQuestion() {
    const questionsList = mode === 'examen' ? window.examQuestions : window.allQuestions;
    if (currentQuestion >= questionsList.length) {
        endQuiz();
        return;
    }
    
    const q = questionsList[currentQuestion];
    document.getElementById('question-container').innerHTML = `
        <div class="question">
            <h3>Q${currentQuestion + 1}/${questionsList.length}</h3>
            <p>${q.question}</p>
            ${q.options.map((opt, i) => 
                `<div class="option" onclick="selectAnswer(${i})">${String.fromCharCode(65+i)}. ${opt}</div>`
            ).join('')}
            <div style="margin-top:20px; color:#666;">${q.explication || ''}</div>
        </div>
    `;
}

function selectAnswer(index) {
    const questionsList = mode === 'examen' ? window.examQuestions : window.allQuestions;
    const q = questionsList[currentQuestion];
    
    // Colorie réponses
    document.querySelectorAll('.option').forEach((el, i) => {
        if (i === q.reponse) el.classList.add('correct');
        if (i === index && i !== q.reponse) el.classList.add('incorrect');
    });
    
    if (index === q.reponse) score++;
    
    // Suivant après 2s
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, mode === 'examen' ? 2000 : 1000);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').innerHTML = `⏰ ${Math.floor(timer/60)}:${timer%60<10?'0':''}${timer%60}`;
        if (timer <= 0) endQuiz();
    }, 1000);
}

function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerHTML = '';
    document.getElementById('score').innerHTML = `
        <h2>✅ Score : ${Math.round(score*100/questions.length)}%</h2>
        <p>${score}/${questions.length} bonnes réponses</p>
    `;
    document.getElementById('reset').style.display = 'block';
}

function reset() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('score').innerHTML = '';
    document.getElementById('reset').style.display = 'none';
    document.getElementById('question-container').innerHTML = '';
}
