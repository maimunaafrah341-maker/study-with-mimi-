# Mimi — AI Study Companion 

> Turn your notes into smarter study sessions. 🌿

**Mimi** is an AI-powered study companion that helps students understand, practice, and revise their study material in one simple workspace.

Instead of using AI only to generate quizzes, Mimi gives students different ways to study the same material:

🌿 **Learn** — Understand the topic first  
📝 **Quiz** — Test what you know  
🪻 **Flashcards** — Review important concepts  

Students can paste their notes or upload a PDF, choose how they want to study, and let Mimi create personalized study material from their content.

---

## Why Mimi?

Studying often means switching between notes, PDFs, quiz websites, flashcard apps, and AI tools.

Mimi brings these steps together in one place.

### The idea is simple:

**Give Mimi your material → Choose how you want to study → Learn → Practice → Review** 🌿

The generated content is based only on the student's provided notes, helping keep the study material relevant to what they actually need to learn.

---

##  Features

###  Learn Mode

Turn your notes into a simple, student-friendly study guide.

Mimi generates:

- 🌿 A short topic summary
- 🌷 Important key points
- 🪻 Important terms and their meanings
- 🎀 Clear explanations based only on the provided notes

---

###  Quiz Mode

Test your understanding with AI-generated multiple-choice questions.

Choose:

- 📖 Number of questions
- 🌿 Difficulty level
  - Easy
  - Medium
  - Hard

Each question contains:

- Four answer options
- One correct answer
- Topic information

After submitting the quiz, Mimi provides:

- 🌷 Your score
- 📝 Correct and incorrect answers
- 🌿 Review of questions that need more attention
- 🪻 Topic information for questions that need revision

---

###  Flashcard Mode

Turn important concepts from your notes into study flashcards.

Each flashcard contains:

- 📝 A question
- 🌿 A concise answer
- 🪻 The related topic

Students can:

- Previous / next through cards
- Flip cards to reveal answers
- Review concepts at their own pace

---

### 📄 PDF Support

Don't want to copy and paste your notes?

Simply upload a PDF.

Mimi extracts the text from the document and can create:

- 🧠 Study guides
- 📝 Quizzes
- 🪻 Flashcards

This makes it useful for lecture notes, study material, and other text-based PDFs.

> Note: Image-only or scanned PDFs may not contain extractable text.

---

### 🌿 Personalized Study Sessions

Students can customize their session before starting.

Choose:

- 🎀 Study mode
- 📝 Number of questions / flashcards
- 🌷 Quiz difficulty
- 📄 Notes or PDF material
- 🪻 Topic

Everything happens within the same study workspace.

---

## 🪻 How It Works

```text
                  Mimi Study Companion
                          │
                          ▼
                  Add Study Material
                   /              \
                  /                \
            📝 Paste Notes       📄 Upload PDF
                  \                /
                   \              /
                    ▼            ▼
                   🌿 Study Material
                          │
                          ▼
                  Choose Study Mode
                 /        |         \
                /         |          \
               ▼          ▼           ▼
            🧠 Learn    📝 Quiz    🪻 Flashcards
               │          │           │
               ▼          ▼           ▼
          Study Guide   Questions   Flashcards
                          │
                          ▼
                      Review Results
                          │
                          ▼
                    🌿 Improve & Revise

## Tech stack

- **Backend:** Flask (Python)
- **Database:** SQLite
- **AI:** Google Gemini API (`google-genai` SDK)
- **Frontend:** Vanilla JavaScript, Tailwind CSS
- **PDF parsing:** pypdf

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/maimunaafrah341-maker/study-with-mimi-
cd study-with-mimi
pip install -r requirements.txt
```

### 2. Set up your environment

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

### 3. Initialize the database

```bash
python database.py
```

### 4. Run it

```bash
python app.py
```

Then open `http://localhost:5000` in your browser.

## Live demo

🔗 

## About

What Makes Mimi Different?

Mimi is designed around the idea that studying is more than simply taking a quiz.

Instead of:

Notes → Quiz → Score

Mimi aims for:

Notes
  ↓
Understand
  ↓
Practice
  ↓
Review
  ↓
Improve

The goal is to make AI feel like a study companion, rather than just a question generator. 🌿
