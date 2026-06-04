class Quiz {
    constructor() {
        this.score = 0;
        this.currentIdx = 0;
        this.questions = [];
        this.userName = "";
        this.timer = null;
        this.timeLeft = 15;

        // UI Elements
        this.views = document.querySelectorAll(".view");
        this.startBtn = document.getElementById("start-btn");
        this.answerGrid = document.getElementById("answer-grid");
        this.timerEl = document.getElementById("seconds");

        this.startBtn.addEventListener("click", () => this.initGame());
    }

    showView(viewId) {
        this.views.forEach(view => view.classList.add("hide"));
        document.getElementById(viewId).classList.remove("hide");
    }

    async initGame() {
        this.userName =
            document.getElementById("username").value.trim() || "Player";

        const category =
            document.getElementById("category-select").value;

        document.getElementById(
            "user-badge"
        ).innerText = `👤 ${this.userName}`;

        try {
            const response = await fetch(
                `https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`
            );

            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                alert("No questions available.");
                return;
            }

            this.questions = data.results.map(q => ({
                text: q.question,
                correct: q.correct_answer,
                options: [...q.incorrect_answers, q.correct_answer]
                    .sort(() => Math.random() - 0.5)
            }));

            this.currentIdx = 0;
            this.score = 0;

            this.showView("quiz-screen");
            this.renderQuestion();
        } catch (error) {
            console.error(error);
            alert("Failed to load quiz questions.");
        }
    }

    startTimer() {
        clearInterval(this.timer);

        this.timeLeft = 15;
        this.timerEl.innerText = this.timeLeft;
        this.timerEl.classList.remove("warning");

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerEl.innerText = this.timeLeft;

            if (this.timeLeft <= 5) {
                this.timerEl.classList.add("warning");
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleAnswer(null, null);
            }
        }, 1000);
    }

    renderQuestion() {
        const question = this.questions[this.currentIdx];

        document.getElementById("question-text").innerHTML =
            question.text;

        this.answerGrid.innerHTML = "";

        document.getElementById("progress-fill").style.width =
            `${((this.currentIdx + 1) / this.questions.length) * 100}%`;

        question.options.forEach(option => {
            const button = document.createElement("button");

            button.className = "ans-btn";
            button.innerHTML = option;

            button.addEventListener("click", () =>
                this.handleAnswer(option, button)
            );

            this.answerGrid.appendChild(button);
        });

        this.startTimer();
    }

    handleAnswer(selected, button) {
        clearInterval(this.timer);

        const correctAnswer =
            this.questions[this.currentIdx].correct;

        const buttons =
            this.answerGrid.querySelectorAll("button");

        buttons.forEach(btn => (btn.disabled = true));

        if (selected === correctAnswer) {
            if (button) {
                button.classList.add("correct");
            }
            this.score++;
        } else {
            if (button) {
                button.classList.add("wrong");
            }
        }

        buttons.forEach(btn => {
            if (btn.innerHTML === correctAnswer) {
                btn.classList.add("correct");
            }
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
        this.showView("results-screen");

        document.getElementById("final-stat").innerText =
            `${this.userName}, your score: ${this.score} / ${this.questions.length}`;

        this.saveScore();
    }

    saveScore() {
        let scores =
            JSON.parse(localStorage.getItem("quizScores")) || [];

        scores.push({
            name: this.userName,
            score: this.score
        });

        scores.sort((a, b) => b.score - a.score);

        scores = scores.slice(0, 5);

        localStorage.setItem(
            "quizScores",
            JSON.stringify(scores)
        );

        document.getElementById("score-list").innerHTML =
            scores
                .map(
                    score =>
                        `<li><span>${score.name}</span><span>${score.score} pts</span></li>`
                )
                .join("");
    }
}

new Quiz();