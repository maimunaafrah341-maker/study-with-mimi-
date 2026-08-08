document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // STUDY MODE
    // ========================================

    const studyModes =
        document.querySelectorAll(".study-mode");

    let selectedMode = "Quiz";


    studyModes.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                studyModes.forEach(
                    function (mode) {

                        mode.classList.remove(
                            "border-2",
                            "border-violet-300",
                            "bg-violet-50"
                        );

                        mode.classList.add(
                            "border",
                            "border-gray-200"
                        );

                    }
                );


                button.classList.remove(
                    "border",
                    "border-gray-200"
                );


                button.classList.add(
                    "border-2",
                    "border-violet-300",
                    "bg-violet-50"
                );


                const title =
                    button.querySelector(
                        ".font-semibold"
                    );


                if (title) {

                    selectedMode =
                        title.innerText.trim();

                }


                console.log(
                    "Study mode:",
                    selectedMode
                );

            }
        );

    });


    // ========================================
    // QUESTION COUNT
    // ========================================

    const questionCounts =
        document.querySelectorAll(
            ".question-count"
        );

    let selectedQuestions = 5;


    questionCounts.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    questionCounts.forEach(
                        function (countButton) {

                            countButton.classList.remove(
                                "border-2",
                                "border-violet-300",
                                "bg-violet-50",
                                "text-violet-600"
                            );

                            countButton.classList.add(
                                "border",
                                "border-gray-200",
                                "text-gray-600"
                            );

                        }
                    );


                    button.classList.remove(
                        "border",
                        "border-gray-200"
                    );


                    button.classList.add(
                        "border-2",
                        "border-violet-300",
                        "bg-violet-50",
                        "text-violet-600"
                    );


                    selectedQuestions =
                        Number(
                            button.innerText.trim()
                        );


                    console.log(
                        "Questions:",
                        selectedQuestions
                    );

                }
            );

        }
    );


    // ========================================
    // DIFFICULTY
    // ========================================

    const difficulties =
        document.querySelectorAll(
            ".difficulty"
        );

    let selectedDifficulty = "Easy";


    difficulties.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    difficulties.forEach(
                        function (difficultyButton) {

                            difficultyButton.classList.remove(
                                "border-2",
                                "border-violet-300",
                                "bg-violet-50",
                                "text-violet-600"
                            );

                            difficultyButton.classList.add(
                                "border",
                                "border-gray-200",
                                "text-gray-600"
                            );

                        }
                    );


                    button.classList.remove(
                        "border",
                        "border-gray-200",
                        "text-gray-600"
                    );


                    button.classList.add(
                        "border-2",
                        "border-violet-300",
                        "bg-violet-50",
                        "text-violet-600"
                    );


                    selectedDifficulty =
                        button.innerText.trim();


                    console.log(
                        "Difficulty:",
                        selectedDifficulty
                    );

                }
            );

        }
    );


    // ========================================
    // ELEMENTS
    // ========================================

    const startButton =
        document.getElementById(
            "startStudying"
        );

    const notesInput =
        document.getElementById(
            "notes"
        );

    const pdfInput =
        document.getElementById(
            "pdf"
        );

    const topicInput =
        document.getElementById(
            "topic"
        );

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );

    const setupSection =
        document.getElementById(
            "setupSection"
        );

    const loadingSection =
        document.getElementById(
            "loadingSection"
        );

    const learnSection =
        document.getElementById(
            "learnSection"
        );

    const quizSection =
        document.getElementById(
            "quizSection"
        );

    const resultSection =
        document.getElementById(
            "resultSection"
        );

    const flashcardSection =
        document.getElementById(
            "flashcardSection"
        );

    const questionsContainer =
        document.getElementById(
            "questionsContainer"
        );

    const quizForm =
        document.getElementById(
            "quizForm"
        );

    const quizTitle =
        document.getElementById(
            "quizTitle"
        );

    const quizInfo =
        document.getElementById(
            "quizInfo"
        );

    const scoreText =
        document.getElementById(
            "scoreText"
        );

    const resultMessage =
        document.getElementById(
            "resultMessage"
        );

    const reviewContainer =
        document.getElementById(
            "reviewContainer"
        );

    const newStudySession =
        document.getElementById(
            "newStudySession"
        );

    const fileName =
        document.getElementById(
            "fileName"
        );


    // ========================================
    // LEARN ELEMENTS
    // ========================================

    const learnTitle =
        document.getElementById(
            "learnTitle"
        );

    const learnInfo =
        document.getElementById(
            "learnInfo"
        );

    const learnSummary =
        document.getElementById(
            "learnSummary"
        );

    const learnKeyPoints =
        document.getElementById(
            "learnKeyPoints"
        );

    const learnTermsContainer =
        document.getElementById(
            "learnTermsContainer"
        );

    const learnTerms =
        document.getElementById(
            "learnTerms"
        );

    const learnNewSession =
        document.getElementById(
            "learnNewSession"
        );


    // ========================================
    // FLASHCARD ELEMENTS
    // ========================================

    const flashcardTitle =
        document.getElementById(
            "flashcardTitle"
        );

    const flashcardInfo =
        document.getElementById(
            "flashcardInfo"
        );

    const flashcardQuestion =
        document.getElementById(
            "flashcardQuestion"
        );

    const flashcardAnswer =
        document.getElementById(
            "flashcardAnswer"
        );

    const previousCard =
        document.getElementById(
            "previousCard"
        );

    const nextCard =
        document.getElementById(
            "nextCard"
        );

    const flipCard =
        document.getElementById(
            "flipCard"
        );

    const cardCounter =
        document.getElementById(
            "cardCounter"
        );

    const flashcardNewSession =
        document.getElementById(
            "flashcardNewSession"
        );


    // ========================================
    // STATE
    // ========================================

    let flashcards = [];

    let currentFlashcard = 0;

    let flashcardShowingAnswer = false;

    let currentQuizQuestions = [];


    // ========================================
    // ERROR HANDLING
    // ========================================

    function showError(message) {

        errorMessage.innerText =
            message;

        errorMessage.classList.remove(
            "hidden"
        );

    }


    function hideError() {

        errorMessage.innerText = "";

        errorMessage.classList.add(
            "hidden"
        );

    }


    // ========================================
    // API RESPONSE HELPER
    // ========================================

    async function parseResponse(response) {

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        if (
            contentType.includes(
                "application/json"
            )
        ) {

            return await response.json();

        }


        const text =
            await response.text();


        throw new Error(
            text ||
            "The server returned an unexpected response."
        );

    }


    // ========================================
    // PDF FILE NAME
    // ========================================

    if (pdfInput) {

        pdfInput.addEventListener(
            "change",
            function () {

                if (
                    pdfInput.files &&
                    pdfInput.files.length > 0
                ) {

                    fileName.innerText =
                        "Selected: " +
                        pdfInput.files[0].name;

                } else {

                    fileName.innerText = "";

                }

            }
        );

    }


    // ========================================
    // START STUDY SESSION
    // ========================================

    if (startButton) {

        startButton.addEventListener(
            "click",
            async function () {

                hideError();


                const notes =
                    notesInput.value.trim();

                const topic =
                    topicInput.value.trim();

                const pdf =
                    pdfInput.files &&
                    pdfInput.files.length > 0
                        ? pdfInput.files[0]
                        : null;


                // ========================================
                // VALIDATION
                // ========================================

                if (!notes && !pdf) {

                    showError(
                        "Please paste your notes or upload a PDF first. 🌸"
                    );

                    return;

                }


                // ========================================
                // SHOW LOADING
                // ========================================

                setupSection.classList.add(
                    "hidden"
                );

                loadingSection.classList.remove(
                    "hidden"
                );


                try {

                    // ========================================
                    // LEARN MODE
                    // ========================================

                    if (
                        selectedMode === "Learn"
                    ) {

                        let response;


                        if (pdf) {

                            const formData =
                                new FormData();

                            formData.append(
                                "pdf",
                                pdf
                            );

                            formData.append(
                                "topic",
                                topic || "General"
                            );


                            response =
                                await fetch(
                                    "/learn-from-pdf",
                                    {
                                        method: "POST",
                                        body: formData
                                    }
                                );

                        } else {

                            response =
                                await fetch(
                                    "/learn",
                                    {
                                        method: "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        body:
                                            JSON.stringify({
                                                notes:
                                                    notes,

                                                topic:
                                                    topic ||
                                                    "General"
                                            })
                                    }
                                );

                        }


                        const data =
                            await parseResponse(
                                response
                            );


                        if (!response.ok) {

                            throw new Error(
                                data.error ||
                                "Could not create the explanation."
                            );

                        }


                        displayLearn(
                            data
                        );

                        return;

                    }


                    // ========================================
                    // FLASHCARD MODE
                    // ========================================

                    if (
                        selectedMode ===
                        "Flashcards"
                    ) {

                        let response;


                        if (pdf) {

                            const formData =
                                new FormData();

                            formData.append(
                                "pdf",
                                pdf
                            );

                            formData.append(
                                "topic",
                                topic ||
                                "General"
                            );

                            formData.append(
                                "num_cards",
                                selectedQuestions
                            );


                            response =
                                await fetch(
                                    "/flashcards-from-pdf",
                                    {
                                        method: "POST",
                                        body: formData
                                    }
                                );

                        } else {

                            response =
                                await fetch(
                                    "/flashcards",
                                    {
                                        method: "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        body:
                                            JSON.stringify({
                                                notes:
                                                    notes,

                                                topic:
                                                    topic ||
                                                    "General",

                                                num_cards:
                                                    selectedQuestions
                                            })
                                    }
                                );

                        }


                        const data =
                            await parseResponse(
                                response
                            );


                        if (!response.ok) {

                            throw new Error(
                                data.error ||
                                "Could not create flashcards."
                            );

                        }


                        displayFlashcards(
                            data
                        );

                        return;

                    }


                    // ========================================
                    // QUIZ MODE
                    // ========================================

                    let response;


                    if (pdf) {

                        const formData =
                            new FormData();

                        formData.append(
                            "pdf",
                            pdf
                        );

                        formData.append(
                            "topic",
                            topic ||
                            "General"
                        );

                        formData.append(
                            "num_questions",
                            selectedQuestions
                        );

                        formData.append(
                            "difficulty",
                            selectedDifficulty
                        );


                        response =
                            await fetch(
                                "/quiz-from-pdf",
                                {
                                    method: "POST",
                                    body: formData
                                }
                            );

                    } else {

                        response =
                            await fetch(
                                "/quiz",
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({

                                            notes:
                                                notes,

                                            topic:
                                                topic ||
                                                "General",

                                            num_questions:
                                                selectedQuestions,

                                            difficulty:
                                                selectedDifficulty

                                        })
                                }
                            );

                    }


                    const data =
                        await parseResponse(
                            response
                        );


                    if (!response.ok) {

                        throw new Error(
                            data.error ||
                            "Something went wrong while creating your quiz."
                        );

                    }


                    displayQuiz(
                        data
                    );


                } catch (error) {

                    console.error(
                        "❌ STUDY ERROR:",
                        error
                    );


                    loadingSection.classList.add(
                        "hidden"
                    );

                    setupSection.classList.remove(
                        "hidden"
                    );


                    showError(
                        error.message ||
                        "Something went wrong. Please try again. ˙◠˙"
                    );

                }

            }
        );

    }


    // ========================================
    // DISPLAY LEARN
    // ========================================

    function displayLearn(data) {

        loadingSection.classList.add(
            "hidden"
        );

        setupSection.classList.add(
            "hidden"
        );

        learnSection.classList.remove(
            "hidden"
        );

        quizSection.classList.add(
            "hidden"
        );

        resultSection.classList.add(
            "hidden"
        );

        flashcardSection.classList.add(
            "hidden"
        );


        learnTitle.innerText =
            data.title ||
            topicInput.value.trim() ||
            "Study Guide";


        learnInfo.innerText =
            "Learn mode 🌿";


        learnSummary.innerText =
            data.summary ||
            data.overview ||
            "No overview was generated.";


        // ========================================
        // KEY POINTS
        // ========================================

        learnKeyPoints.innerHTML = "";


        const keyPoints =
            Array.isArray(
                data.key_points
            )
                ? data.key_points
                : [];


        if (!keyPoints.length) {

            const emptyItem =
                document.createElement(
                    "li"
                );

            emptyItem.className =
                "text-gray-500";

            emptyItem.innerText =
                "No key points were generated.";

            learnKeyPoints.appendChild(
                emptyItem
            );

        } else {

            keyPoints.forEach(
                function (point) {

                    const li =
                        document.createElement(
                            "li"
                        );

                    li.className =
                        "flex gap-3 text-gray-700";


                    const icon =
                        document.createElement(
                            "span"
                        );

                    icon.className =
                        "text-violet-500";

                    icon.innerText =
                        "✦";


                    const text =
                        document.createElement(
                            "span"
                        );

                    text.innerText =
                        point;


                    li.appendChild(
                        icon
                    );

                    li.appendChild(
                        text
                    );

                    learnKeyPoints.appendChild(
                        li
                    );

                }
            );

        }


        // ========================================
        // IMPORTANT TERMS
        // ========================================

        learnTerms.innerHTML = "";


        const terms =
            Array.isArray(
                data.important_terms
            )
                ? data.important_terms
                : [];


        if (!terms.length) {

            learnTermsContainer.classList.add(
                "hidden"
            );

        } else {

            learnTermsContainer.classList.remove(
                "hidden"
            );


            terms.forEach(
                function (item) {

                    const termCard =
                        document.createElement(
                            "div"
                        );

                    termCard.className =
                        "rounded-2xl bg-stone-50 p-4";


                    const term =
                        document.createElement(
                            "p"
                        );

                    term.className =
                        "font-semibold text-gray-800";

                    term.innerText =
                        item.term || "Term";


                    const meaning =
                        document.createElement(
                            "p"
                        );

                    meaning.className =
                        "text-sm text-gray-600 mt-1";

                    meaning.innerText =
                        item.meaning || "";


                    termCard.appendChild(
                        term
                    );

                    termCard.appendChild(
                        meaning
                    );

                    learnTerms.appendChild(
                        termCard
                    );

                }
            );

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // ========================================
    // DISPLAY QUIZ
    // ========================================

    function displayQuiz(data) {

        const questions =
            Array.isArray(
                data.questions
            )
                ? data.questions
                : [];


        if (
            questions.length === 0
        ) {

            throw new Error(
                "No quiz questions were generated."
            );

        }


        currentQuizQuestions =
            questions;


        loadingSection.classList.add(
            "hidden"
        );

        setupSection.classList.add(
            "hidden"
        );

        quizSection.classList.remove(
            "hidden"
        );

        learnSection.classList.add(
            "hidden"
        );

        resultSection.classList.add(
            "hidden"
        );

        flashcardSection.classList.add(
            "hidden"
        );


        quizTitle.innerText =
            topicInput.value.trim() ||
            "Your Study Quiz";


        quizInfo.innerText =
            `${currentQuizQuestions.length} questions • ${selectedDifficulty} difficulty`;


        questionsContainer.innerHTML =
            "";


        currentQuizQuestions.forEach(
            function (question, index) {

                const questionCard =
                    document.createElement(
                        "div"
                    );


                questionCard.className =
                    "mb-8 p-6 rounded-2xl " +
                    "bg-stone-50 border border-gray-100";


                const questionTitle =
                    document.createElement(
                        "h3"
                    );


                questionTitle.className =
                    "text-lg font-semibold " +
                    "text-gray-800 mb-4";


                questionTitle.innerText =
                    `${index + 1}. ${question.question}`;


                questionCard.appendChild(
                    questionTitle
                );


                const optionsContainer =
                    document.createElement(
                        "div"
                    );


                optionsContainer.className =
                    "space-y-3";


                const options =
                    question.options || {};


                Object.entries(
                    options
                ).forEach(
                    function ([letter, text]) {

                        const label =
                            document.createElement(
                                "label"
                            );


                        label.className =
                            "flex items-center gap-3 " +
                            "p-3 rounded-xl border " +
                            "border-gray-200 bg-white " +
                            "cursor-pointer " +
                            "hover:border-violet-200 " +
                            "hover:bg-violet-50/50 transition";


                        const input =
                            document.createElement(
                                "input"
                            );


                        input.type =
                            "radio";

                        input.name =
                            `question-${question.id}`;

                        input.value =
                            letter;

                        input.className =
                            "accent-violet-500";


                        const optionText =
                            document.createElement(
                                "span"
                            );


                        optionText.className =
                            "text-gray-700";


                        optionText.innerText =
                            `${letter}. ${text}`;


                        label.appendChild(
                            input
                        );

                        label.appendChild(
                            optionText
                        );

                        optionsContainer.appendChild(
                            label
                        );

                    }
                );


                questionCard.appendChild(
                    optionsContainer
                );


                questionsContainer.appendChild(
                    questionCard
                );

            }
        );


        quizForm.dataset.sessionId =
            data.session_id || "";


        const submitButton =
            document.getElementById(
                "submitQuiz"
            );


        submitButton.classList.remove(
            "hidden"
        );

        submitButton.disabled =
            false;

        submitButton.innerText =
            "Check My Answers ★⋆.";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // ========================================
    // SUBMIT QUIZ
    // ========================================

    if (quizForm) {

        quizForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const sessionId =
                    quizForm.dataset.sessionId;


                if (!sessionId) {

                    alert(
                        "This quiz session is missing its session ID."
                    );

                    return;

                }


                const answers = {};


                const selectedAnswers =
                    quizForm.querySelectorAll(
                        "input[type='radio']:checked"
                    );


                selectedAnswers.forEach(
                    function (input) {

                        const questionId =
                            input.name.replace(
                                "question-",
                                ""
                            );


                        answers[questionId] =
                            input.value;

                    }
                );


                const totalQuestions =
                    currentQuizQuestions.length;


                if (
                    selectedAnswers.length <
                    totalQuestions
                ) {

                    alert(
                        "Please answer all the questions before submitting. 🌸"
                    );

                    return;

                }


                const submitButton =
                    document.getElementById(
                        "submitQuiz"
                    );


                submitButton.disabled =
                    true;

                submitButton.innerText =
                    "Checking your answers... 🍃";


                try {

                    const response =
                        await fetch(
                            "/submit",
                            {

                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        session_id:
                                            Number(
                                                sessionId
                                            ),

                                        answers:
                                            answers

                                    })

                            }
                        );


                    const data =
                        await parseResponse(
                            response
                        );


                    if (!response.ok) {

                        throw new Error(
                            data.error ||
                            "Could not submit the quiz."
                        );

                    }


                    showResults(
                        data
                    );


                } catch (error) {

                    console.error(
                        "❌ SUBMIT ERROR:",
                        error
                    );


                    alert(
                        error.message ||
                        "Something went wrong while submitting your quiz."
                    );


                    submitButton.disabled =
                        false;

                    submitButton.innerText =
                        "Check My Answers ★⋆.";

                }

            }
        );

    }


    // ========================================
    // DISPLAY FLASHCARDS
    // ========================================

    function displayFlashcards(data) {

        const cards =
            Array.isArray(
                data.flashcards
            )
                ? data.flashcards
                : [];


        if (!cards.length) {

            throw new Error(
                "No flashcards were generated."
            );

        }


        flashcards =
            cards;


        loadingSection.classList.add(
            "hidden"
        );

        setupSection.classList.add(
            "hidden"
        );

        quizSection.classList.add(
            "hidden"
        );

        learnSection.classList.add(
            "hidden"
        );

        resultSection.classList.add(
            "hidden"
        );

        flashcardSection.classList.remove(
            "hidden"
        );


        currentFlashcard = 0;

        flashcardShowingAnswer =
            false;


        flashcardTitle.innerText =
            data.title ||
            topicInput.value.trim() ||
            "Flashcards";


        flashcardInfo.innerText =
            `${flashcards.length} flashcards • Review mode 🌸`;


        renderFlashcard();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // ========================================
    // RENDER CURRENT FLASHCARD
    // ========================================

    function renderFlashcard() {

        if (!flashcards.length) {

            flashcardQuestion.innerText =
                "No flashcards were generated.";

            flashcardAnswer.innerText =
                "";

            cardCounter.innerText =
                "0 / 0";

            return;

        }


        const card =
            flashcards[
                currentFlashcard
            ];


        flashcardQuestion.innerText =
            card.question ||
            "No question available.";


        flashcardAnswer.innerText =
            card.answer ||
            "No answer available.";


        cardCounter.innerText =
            `${currentFlashcard + 1} / ${flashcards.length}`;


        flashcardShowingAnswer =
            false;


        flashcardQuestion.classList.remove(
            "hidden"
        );

        flashcardAnswer.classList.add(
            "hidden"
        );


        flipCard.innerText =
            "Show Answer";


        previousCard.disabled =
            currentFlashcard === 0;


        nextCard.disabled =
            currentFlashcard ===
            flashcards.length - 1;

    }


    // ========================================
    // FLIP FLASHCARD
    // ========================================

    if (flipCard) {

        flipCard.addEventListener(
            "click",
            function () {

                if (!flashcards.length) {
                    return;
                }


                flashcardShowingAnswer =
                    !flashcardShowingAnswer;


                if (
                    flashcardShowingAnswer
                ) {

                    flashcardQuestion.classList.add(
                        "hidden"
                    );

                    flashcardAnswer.classList.remove(
                        "hidden"
                    );

                    flipCard.innerText =
                        "Show Question";

                } else {

                    flashcardQuestion.classList.remove(
                        "hidden"
                    );

                    flashcardAnswer.classList.add(
                        "hidden"
                    );

                    flipCard.innerText =
                        "Show Answer";

                }

            }
        );

    }


    // ========================================
    // PREVIOUS FLASHCARD
    // ========================================

    if (previousCard) {

        previousCard.addEventListener(
            "click",
            function () {

                if (
                    currentFlashcard > 0
                ) {

                    currentFlashcard--;

                    renderFlashcard();

                }

            }
        );

    }


    // ========================================
    // NEXT FLASHCARD
    // ========================================

    if (nextCard) {

        nextCard.addEventListener(
            "click",
            function () {

                if (
                    currentFlashcard <
                    flashcards.length - 1
                ) {

                    currentFlashcard++;

                    renderFlashcard();

                }

            }
        );

    }


    // ========================================
    // SHOW RESULTS
    // ========================================

    function showResults(data) {

        quizSection.classList.add(
            "hidden"
        );

        resultSection.classList.remove(
            "hidden"
        );


        const score =
            Number(data.score) || 0;

        const total =
            Number(data.total) || 0;


        scoreText.innerText =
            `You scored ${score} / ${total}`;


        if (
            total > 0 &&
            score === total
        ) {

            resultMessage.innerText =
                "Perfect! You know this really well. 🌸";

        } else if (
            total > 0 &&
            score >= total / 2
        ) {

            resultMessage.innerText =
                "Good job! A little more revision and you'll get there. 🌿";

        } else {

            resultMessage.innerText =
                "No worries! Let's see what you can improve. ☺︎";

        }


        reviewContainer.innerHTML =
            "";


        const review =
            Array.isArray(
                data.review
            )
                ? data.review
                : [];


        review.forEach(
            function (item) {

                const reviewCard =
                    document.createElement(
                        "div"
                    );


                reviewCard.className =
                    "mt-4 p-5 rounded-2xl " +
                    "border bg-gray-50";


                const status =
                    document.createElement(
                        "p"
                    );


                status.className =
                    item.is_correct
                        ? "font-semibold text-green-600"
                        : "font-semibold text-rose-500";


                status.innerText =
                    item.is_correct
                        ? "✓ Correct"
                        : "✗ Needs Review";


                const question =
                    document.createElement(
                        "p"
                    );


                question.className =
                    "font-semibold text-gray-800 mt-2";


                question.innerText =
                    item.question?.question ||
                    "Question unavailable.";


                reviewCard.appendChild(
                    status
                );

                reviewCard.appendChild(
                    question
                );


                const yourAnswer =
                    document.createElement(
                        "p"
                    );


                yourAnswer.className =
                    "text-sm text-gray-500 mt-3";


                yourAnswer.innerText =
                    "Your answer: " +
                    (
                        item.your_answer ||
                        "Not answered ˙◠˙"
                    );


                reviewCard.appendChild(
                    yourAnswer
                );


                if (!item.is_correct) {

                    const correctAnswer =
                        document.createElement(
                            "p"
                        );


                    correctAnswer.className =
                        "text-sm text-gray-500 mt-1";


                    correctAnswer.innerText =
                        "Correct answer: " +
                        (
                            item.correct_answer ||
                            "Unknown"
                        );


                    reviewCard.appendChild(
                        correctAnswer
                    );


                    const topic =
                        document.createElement(
                            "p"
                        );


                    topic.className =
                        "text-sm text-gray-500 mt-2";


                    topic.innerText =
                        "Topic: " +
                        (
                            item.topic ||
                            "General"
                        );


                    reviewCard.appendChild(
                        topic
                    );

                }


                reviewContainer.appendChild(
                    reviewCard
                );

            }
        );


        resultSection.scrollIntoView({
            behavior: "smooth"
        });

    }


    // ========================================
    // RESET EVERYTHING
    // ========================================

    function resetStudySession() {

        learnSection.classList.add(
            "hidden"
        );

        quizSection.classList.add(
            "hidden"
        );

        resultSection.classList.add(
            "hidden"
        );

        flashcardSection.classList.add(
            "hidden"
        );


        setupSection.classList.remove(
            "hidden"
        );


        notesInput.value =
            "";

        topicInput.value =
            "";

        pdfInput.value =
            "";

        fileName.innerText =
            "";


        questionsContainer.innerHTML =
            "";


        quizForm.dataset.sessionId =
            "";


        learnTitle.innerText =
            "";

        learnInfo.innerText =
            "";

        learnSummary.innerText =
            "";

        learnKeyPoints.innerHTML =
            "";

        learnTerms.innerHTML =
            "";

        learnTermsContainer.classList.add(
            "hidden"
        );


        reviewContainer.innerHTML =
            "";


        scoreText.innerText =
            "";

        resultMessage.innerText =
            "";


        flashcards = [];

        currentFlashcard = 0;

        flashcardShowingAnswer =
            false;

        currentQuizQuestions =
            [];


        const submitButton =
            document.getElementById(
                "submitQuiz"
            );


        submitButton.classList.add(
            "hidden"
        );

        submitButton.disabled =
            false;

        submitButton.innerText =
            "Check My Answers ★⋆.";


        hideError();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // ========================================
    // NEW QUIZ SESSION
    // ========================================

    if (newStudySession) {

        newStudySession.addEventListener(
            "click",
            resetStudySession
        );

    }


    // ========================================
    // NEW LEARN SESSION
    // ========================================

    if (learnNewSession) {

        learnNewSession.addEventListener(
            "click",
            resetStudySession
        );

    }


    // ========================================
    // NEW FLASHCARD SESSION
    // ========================================

    if (flashcardNewSession) {

        flashcardNewSession.addEventListener(
            "click",
            resetStudySession
        );

    }

});