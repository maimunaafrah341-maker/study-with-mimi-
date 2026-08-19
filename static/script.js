document.addEventListener("DOMContentLoaded", () => {
    const studyModes = [...document.querySelectorAll(".study-mode")];
    const questionCounts = [...document.querySelectorAll(".question-count")];
    const difficulties = [...document.querySelectorAll(".difficulty")];

    let selectedMode = "Quiz";
    let selectedQuestions = 5;
    let selectedDifficulty = "Easy";
    let flashcards = [];
    let currentFlashcard = 0;
    let flashcardShowingAnswer = false;
    let currentQuizQuestions = [];

    const $ = (id) => document.getElementById(id);
    const startButton = $("startStudying");
    const notesInput = $("notes");
    const pdfInput = $("pdf");
    const topicInput = $("topic");
    const errorMessage = $("errorMessage");
    const setupSection = $("setupSection");
    const loadingSection = $("loadingSection");
    const learnSection = $("learnSection");
    const quizSection = $("quizSection");
    const resultSection = $("resultSection");
    const flashcardSection = $("flashcardSection");
    const questionsContainer = $("questionsContainer");
    const quizForm = $("quizForm");
    const quizTitle = $("quizTitle");
    const quizInfo = $("quizInfo");
    const scoreText = $("scoreText");
    const resultMessage = $("resultMessage");
    const reviewContainer = $("reviewContainer");
    const newStudySession = $("newStudySession");
    const fileName = $("fileName");

    const learnTitle = $("learnTitle");
    const learnInfo = $("learnInfo");
    const learnSummary = $("learnSummary");
    const learnKeyPoints = $("learnKeyPoints");
    const learnTermsContainer = $("learnTermsContainer");
    const learnTerms = $("learnTerms");
    const learnNewSession = $("learnNewSession");

    const flashcardTitle = $("flashcardTitle");
    const flashcardInfo = $("flashcardInfo");
    const flashcardQuestion = $("flashcardQuestion");
    const flashcardAnswer = $("flashcardAnswer");
    const previousCard = $("previousCard");
    const nextCard = $("nextCard");
    const flipCard = $("flipCard");
    const cardCounter = $("cardCounter");
    const flashcardNewSession = $("flashcardNewSession");

    function setSelected(items, selected) {
        items.forEach((item) => item.classList.toggle("is-selected", item === selected));
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    }

    function hideError() {
        errorMessage.textContent = "";
        errorMessage.classList.add("hidden");
    }

    function showOnly(section) {
        [setupSection, loadingSection, learnSection, quizSection, resultSection, flashcardSection]
            .forEach((item) => item.classList.add("hidden"));
        section.classList.remove("hidden");
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function parseResponse(response) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) return response.json();
        const text = await response.text();
        throw new Error(text || "The server returned an unexpected response.");
    }

    studyModes.forEach((button) => {
        button.addEventListener("click", () => {
            setSelected(studyModes, button);
            selectedMode = button.dataset.mode || button.querySelector("strong")?.textContent.trim() || "Quiz";
        });
    });

    questionCounts.forEach((button) => {
        button.addEventListener("click", () => {
            setSelected(questionCounts, button);
            selectedQuestions = Number(button.textContent.trim());
        });
    });

    difficulties.forEach((button) => {
        button.addEventListener("click", () => {
            setSelected(difficulties, button);
            selectedDifficulty = button.textContent.trim();
        });
    });

    pdfInput?.addEventListener("change", () => {
        fileName.textContent = pdfInput.files?.length ? `Selected: ${pdfInput.files[0].name}` : "";
    });

    startButton?.addEventListener("click", async () => {
        hideError();

        const notes = notesInput.value.trim();
        const topic = topicInput.value.trim();
        const pdf = pdfInput.files?.length ? pdfInput.files[0] : null;

        if (!notes && !pdf) {
            showError("Add some notes or upload a PDF before starting your session.");
            notesInput.focus();
            return;
        }

        startButton.disabled = true;
        showOnly(loadingSection);

        try {
            let response;

            if (selectedMode === "Learn") {
                if (pdf) {
                    const formData = new FormData();
                    formData.append("pdf", pdf);
                    formData.append("topic", topic || "General");
                    response = await fetch("/learn-from-pdf", { method: "POST", body: formData });
                } else {
                    response = await fetch("/learn", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ notes, topic: topic || "General" }),
                    });
                }

                const data = await parseResponse(response);
                if (!response.ok) throw new Error(data.error || "Could not create the study guide.");
                displayLearn(data);
                return;
            }

            if (selectedMode === "Flashcards") {
                if (pdf) {
                    const formData = new FormData();
                    formData.append("pdf", pdf);
                    formData.append("topic", topic || "General");
                    formData.append("num_cards", selectedQuestions);
                    response = await fetch("/flashcards-from-pdf", { method: "POST", body: formData });
                } else {
                    response = await fetch("/flashcards", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ notes, topic: topic || "General", num_cards: selectedQuestions }),
                    });
                }

                const data = await parseResponse(response);
                if (!response.ok) throw new Error(data.error || "Could not create flashcards.");
                displayFlashcards(data);
                return;
            }

            if (pdf) {
                const formData = new FormData();
                formData.append("pdf", pdf);
                formData.append("topic", topic || "General");
                formData.append("num_questions", selectedQuestions);
                formData.append("difficulty", selectedDifficulty);
                response = await fetch("/quiz-from-pdf", { method: "POST", body: formData });
            } else {
                response = await fetch("/quiz", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        notes,
                        topic: topic || "General",
                        num_questions: selectedQuestions,
                        difficulty: selectedDifficulty,
                    }),
                });
            }

            const data = await parseResponse(response);
            if (!response.ok) throw new Error(data.error || "Could not create your quiz.");
            displayQuiz(data);
        } catch (error) {
            console.error("Study session error:", error);
            showOnly(setupSection);
            showError(error.message || "Something went wrong. Please try again.");
        } finally {
            startButton.disabled = false;
        }
    });

    function displayLearn(data) {
        showOnly(learnSection);
        learnTitle.textContent = data.title || topicInput.value.trim() || "Study Guide";
        learnInfo.textContent = "A clear overview built from your material.";
        learnSummary.textContent = data.summary || data.overview || "No overview was generated.";
        learnKeyPoints.innerHTML = "";

        const keyPoints = Array.isArray(data.key_points) ? data.key_points : [];
        if (!keyPoints.length) {
            const emptyItem = document.createElement("li");
            emptyItem.textContent = "No key points were generated.";
            learnKeyPoints.appendChild(emptyItem);
        } else {
            keyPoints.forEach((point) => {
                const item = document.createElement("li");
                item.textContent = point;
                learnKeyPoints.appendChild(item);
            });
        }

        learnTerms.innerHTML = "";
        const terms = Array.isArray(data.important_terms) ? data.important_terms : [];
        learnTermsContainer.classList.toggle("hidden", !terms.length);
        terms.forEach((item) => {
            const termCard = document.createElement("div");
            termCard.className = "term-item";
            const term = document.createElement("strong");
            term.textContent = item.term || "Term";
            const meaning = document.createElement("span");
            meaning.textContent = item.meaning || "";
            termCard.append(term, meaning);
            learnTerms.appendChild(termCard);
        });

        scrollToTop();
    }

    function displayQuiz(data) {
        const questions = Array.isArray(data.questions) ? data.questions : [];
        if (!questions.length) throw new Error("No quiz questions were generated.");

        currentQuizQuestions = questions;
        showOnly(quizSection);
        quizTitle.textContent = topicInput.value.trim() || "Your study quiz";
        quizInfo.textContent = `${questions.length} questions · ${selectedDifficulty} difficulty`;
        questionsContainer.innerHTML = "";

        questions.forEach((question, index) => {
            const questionCard = document.createElement("article");
            questionCard.className = "question-card";

            const questionTitle = document.createElement("h3");
            questionTitle.textContent = `${String(index + 1).padStart(2, "0")} / ${question.question}`;
            questionCard.appendChild(questionTitle);

            const optionsContainer = document.createElement("div");
            optionsContainer.className = "options-container";

            Object.entries(question.options || {}).forEach(([letter, text]) => {
                const label = document.createElement("label");
                label.className = "option-label";
                const input = document.createElement("input");
                input.type = "radio";
                input.name = `question-${question.id}`;
                input.value = letter;
                const optionText = document.createElement("span");
                optionText.textContent = `${letter}. ${text}`;
                label.append(input, optionText);
                optionsContainer.appendChild(label);
            });

            questionCard.appendChild(optionsContainer);
            questionsContainer.appendChild(questionCard);
        });

        quizForm.dataset.sessionId = data.session_id || "";
        const submitButton = $("submitQuiz");
        submitButton.classList.remove("hidden");
        submitButton.disabled = false;
        submitButton.innerHTML = 'Check answers <span aria-hidden="true">↗</span>';
        scrollToTop();
    }

    quizForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const sessionId = quizForm.dataset.sessionId;
        if (!sessionId) {
            showError("This quiz session is missing its session ID.");
            return;
        }

        const answers = {};
        const selectedAnswers = quizForm.querySelectorAll("input[type='radio']:checked");
        selectedAnswers.forEach((input) => {
            answers[input.name.replace("question-", "")] = input.value;
        });

        if (selectedAnswers.length < currentQuizQuestions.length) {
            showError("Answer every question before submitting your quiz.");
            return;
        }

        const submitButton = $("submitQuiz");
        submitButton.disabled = true;
        submitButton.textContent = "Checking answers…";

        try {
            const response = await fetch("/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: Number(sessionId), answers }),
            });
            const data = await parseResponse(response);
            if (!response.ok) throw new Error(data.error || "Could not submit the quiz.");
            showResults(data);
        } catch (error) {
            console.error("Quiz submission error:", error);
            showError(error.message || "Something went wrong while submitting your quiz.");
            submitButton.disabled = false;
            submitButton.innerHTML = 'Check answers <span aria-hidden="true">↗</span>';
        }
    });

    function displayFlashcards(data) {
        const cards = Array.isArray(data.flashcards) ? data.flashcards : [];
        if (!cards.length) throw new Error("No flashcards were generated.");

        flashcards = cards;
        currentFlashcard = 0;
        flashcardShowingAnswer = false;
        showOnly(flashcardSection);
        flashcardTitle.textContent = data.title || topicInput.value.trim() || "Flashcards";
        flashcardInfo.textContent = `${cards.length} cards · Review at your own pace`;
        renderFlashcard();
        scrollToTop();
    }

    function renderFlashcard() {
        if (!flashcards.length) {
            flashcardQuestion.textContent = "No flashcards were generated.";
            flashcardAnswer.textContent = "";
            cardCounter.textContent = "0 / 0";
            return;
        }

        const card = flashcards[currentFlashcard];
        flashcardQuestion.textContent = card.question || "No question available.";
        flashcardAnswer.textContent = card.answer || "No answer available.";
        cardCounter.textContent = `${currentFlashcard + 1} / ${flashcards.length}`;
        flashcardShowingAnswer = false;
        flashcardQuestion.classList.remove("hidden");
        flashcardAnswer.classList.add("hidden");
        flipCard.textContent = "Show answer";
        previousCard.disabled = currentFlashcard === 0;
        nextCard.disabled = currentFlashcard === flashcards.length - 1;
    }

    flipCard?.addEventListener("click", () => {
        if (!flashcards.length) return;
        flashcardShowingAnswer = !flashcardShowingAnswer;
        flashcardQuestion.classList.toggle("hidden", flashcardShowingAnswer);
        flashcardAnswer.classList.toggle("hidden", !flashcardShowingAnswer);
        flipCard.textContent = flashcardShowingAnswer ? "Show question" : "Show answer";
    });

    previousCard?.addEventListener("click", () => {
        if (currentFlashcard > 0) {
            currentFlashcard -= 1;
            renderFlashcard();
        }
    });

    nextCard?.addEventListener("click", () => {
        if (currentFlashcard < flashcards.length - 1) {
            currentFlashcard += 1;
            renderFlashcard();
        }
    });

    function showResults(data) {
        showOnly(resultSection);
        const score = Number(data.score) || 0;
        const total = Number(data.total) || 0;
        scoreText.textContent = `${score} / ${total}`;

        resultMessage.textContent = score === total && total > 0
            ? "Perfect recall. You are ready to move on."
            : score >= total / 2
                ? "Solid progress. Review the marked items once more."
                : "This is useful feedback. Focus your next review on the items below.";

        reviewContainer.innerHTML = "";
        const review = Array.isArray(data.review) ? data.review : [];
        review.forEach((item) => {
            const reviewCard = document.createElement("article");
            reviewCard.className = "review-card";

            const status = document.createElement("p");
            status.className = `review-status ${item.is_correct ? "is-correct" : "is-wrong"}`;
            status.textContent = item.is_correct ? "Correct" : "Needs review";

            const question = document.createElement("p");
            question.className = "review-question";
            question.textContent = item.question?.question || "Question unavailable.";
            reviewCard.append(status, question);

            const yourAnswer = document.createElement("p");
            yourAnswer.className = "review-detail";
            yourAnswer.textContent = `Your answer: ${item.your_answer || "Not answered"}`;
            reviewCard.appendChild(yourAnswer);

            if (!item.is_correct) {
                const correctAnswer = document.createElement("p");
                correctAnswer.className = "review-detail";
                correctAnswer.textContent = `Correct answer: ${item.correct_answer || "Unknown"}`;
                reviewCard.appendChild(correctAnswer);

                const topic = document.createElement("p");
                topic.className = "review-detail";
                topic.textContent = `Topic: ${item.topic || "General"}`;
                reviewCard.appendChild(topic);
            }

            reviewContainer.appendChild(reviewCard);
        });

        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function resetStudySession() {
        showOnly(setupSection);
        hideError();
        notesInput.value = "";
        topicInput.value = "";
        pdfInput.value = "";
        fileName.textContent = "";
        questionsContainer.innerHTML = "";
        quizForm.dataset.sessionId = "";
        learnTitle.textContent = "";
        learnInfo.textContent = "";
        learnSummary.textContent = "";
        learnKeyPoints.innerHTML = "";
        learnTerms.innerHTML = "";
        learnTermsContainer.classList.add("hidden");
        reviewContainer.innerHTML = "";
        scoreText.textContent = "";
        resultMessage.textContent = "";
        flashcards = [];
        currentFlashcard = 0;
        flashcardShowingAnswer = false;
        currentQuizQuestions = [];
        const submitButton = $("submitQuiz");
        submitButton.classList.add("hidden");
        submitButton.disabled = false;
        selectedMode = "Quiz";
        selectedQuestions = 5;
        selectedDifficulty = "Easy";
        setSelected(studyModes, studyModes.find((button) => button.dataset.mode === "Quiz"));
        setSelected(questionCounts, questionCounts.find((button) => button.textContent.trim() === "5"));
        setSelected(difficulties, difficulties.find((button) => button.textContent.trim() === "Easy"));
        scrollToTop();
    }

    newStudySession?.addEventListener("click", resetStudySession);
    learnNewSession?.addEventListener("click", resetStudySession);
    flashcardNewSession?.addEventListener("click", resetStudySession);
});
