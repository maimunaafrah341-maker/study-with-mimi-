# Study with Mimi

An AI-powered study companion that turns your notes — typed or uploaded as a PDF — into a study guide, a quiz, or a set of flashcards, using Google's Gemini API.

## Features

- **Learn** — generates a structured study guide (summary, key points, key terms) from your notes or an uploaded PDF.
- **Quiz** — a multiple-choice quiz (choose 5, 10, 15, or 20 questions, at Easy / Medium / Hard difficulty), scored automatically, with a review screen showing correct answers after you submit.
- **Flashcards** — flip-through Q&A cards generated from your material.
- **PDF upload** — all three modes work from typed notes or an uploaded PDF, with automatic text extraction.
- **Weak topics tracking** — past quiz results are stored, so the app can surface which topics you're consistently missing.

## Tech stack

- **Backend:** Flask (Python)
- **Database:** SQLite
- **AI:** Google Gemini API (`google-genai` SDK)
- **Frontend:** Vanilla JavaScript, Tailwind CSS
- **PDF parsing:** pypdf

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
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

🔗 [add your deployed link here]

## About

Built solo as a first-year AI & ML student, over a few days working around college.

## License

MIT
