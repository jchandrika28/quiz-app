class Quiz {
    constructor() {
        this.score = 0;
        this.currentIdx = 0;
        this.questions = [];
        this.userName = "";
        this.timer = null;
        this.timeLeft = 15;

        // UI Bindings
        this.views = document.querySelectorAll('.view');
        this.startBtn = document.getElementById('start-btn');
        this.answerGrid = document.getElementById('answer-grid');
        this.timerEl = document.getElementById('seconds');
        
        this.startBtn.addEventListener('click', () => this.initGame());
    }

    showView(viewId) {
        this.views.forEach(v => v.classList.add('hide'));
        document.getElementById(viewId).classList.remove('hide');
    }

    async initGame() {
        this.userName = document.getElementById('username').value || "Player";
        const cat = document.getElementById('category-select').value;
        document.getElementById('user-badge').innerText = `👤 ${this.userName}`;
        
        try {
            const res = await fetch(`https://opentdb.com/api.php?amount=5&category=${cat}&type=multiple`);
            const data = await res.json();
            this.questions = data.results.map(q => ({
                text: q.question,
                correct: q.correct_answer,
                options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
            }));
            
            this.showView('quiz-screen');
            this.renderQuestion();
        } catch (e) {
            alert("API Error. Please try again later.");
        }
    }

    startTimer() {
        this.timeLeft = 15;
        this.timerEl.innerText = this.timeLeft;
        this.timerEl.classList.remove('warning');
        clearInterval(this.timer);

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerEl.innerText = this.timeLeft;

            if (this.timeLeft <= 5) this.timerEl.classList.add('warning');

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleAnswer(null, null); // Auto-fail on timeout
            }
        }, 1000);
    }

    renderQuestion() {
        const q = this.questions[this.currentIdx];
        document.getElementById('question-text').innerHTML = q.text;
        this.answerGrid.innerHTML = '';
        
        document.getElementById('progress-fill').style.width = `${(this.currentIdx / this.questions.length) * 100}%`;

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'ans-btn';
            btn.innerHTML = opt;
            btn.onclick = () => this.handleAnswer(opt, btn);
            this.answerGrid.appendChild(btn);
        });
        this.startTimer();
    }

    handleAnswer(selected, btn) {
        clearInterval(this.timer);
        const correct = this.questions[this.currentIdx].correct;
        const allBtns = this.answerGrid.querySelectorAll('button');
        
        allBtns.forEach(b => b.disabled = true);

        if (selected === correct) {
            btn.classList.add('correct');
            this.score++;
        } else if (btn) {
            btn.classList.add('wrong');
        }

        // Always show the correct answer
        allBtns.forEach(b => {
            if (b.innerHTML === correct) b.classList.add('correct');
        });

        setTimeout(() => {
            this.currentIdx++;
            if (this.currentIdx < this.questions.length) {
                this.renderQuestion();
            } else {
                this.showResults();
            }
        }, 1200);
    }

    showResults() {
        this.showView('results-screen');
        document.getElementById('progress-fill').style.width = '100%';
        document.getElementById('final-stat').innerText = `${this.userName}, your score: ${this.score} / ${this.questions.length}`;
        this.saveScore();
    }

    saveScore() {
        let scores = JSON.parse(localStorage.getItem('quizScores') || "[]");
        scores.push({ name: this.userName, score: this.score });
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5); 
        localStorage.setItem('quizScores', JSON.stringify(scores));

        document.getElementById('score-list').innerHTML = scores
            .map(s => `<li><span>${s.name}</span><span>${s.score} pts</span></li>`)
            .join('');
    }
}

new Quiz();