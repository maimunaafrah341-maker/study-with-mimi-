from flask import Flask, request, jsonify, render_template
from google import genai
from google.genai import types
from dotenv import load_dotenv
from database import get_db, init_db
from pypdf import PdfReader

import json
import os
import time


# ========================================
# CONFIGURATION
# ========================================

load_dotenv()

app = Flask(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash"
)

# How much text (typed notes or PDF-extracted text) we'll send to
# Gemini in one go. Longer input means a longer generation time,
# which raises the odds of the connection getting dropped before
# a response comes back. This keeps prompts in a safe range.
MAX_NOTES_CHARACTERS = 15000


client = None

if GEMINI_API_KEY:
    client = genai.Client(
        api_key=GEMINI_API_KEY,
        http_options=types.HttpOptions(
            timeout=120000  # 120 seconds, in milliseconds
        )
    )


# ========================================
# GEMINI HELPER
# ========================================

def generate_gemini_response(prompt, max_attempts=2):
    """
    Send a prompt to Gemini and return the text response.

    Retries once if the connection drops mid-request — a known
    intermittent issue with longer-running generations, especially
    on large PDF-derived prompts.
    """

    if client is None:
        raise RuntimeError(
            "GEMINI_API_KEY is missing. "
            "Please add it to your .env file."
        )

    last_error = None

    for attempt in range(1, max_attempts + 1):

        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )

            if not response or not response.text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            return response.text.strip()

        except Exception as error:
            last_error = error

            print(
                f"⚠️ Gemini request failed on attempt "
                f"{attempt}/{max_attempts}: {error}"
            )

            if attempt < max_attempts:
                time.sleep(1.5)

    raise RuntimeError(
        "Gemini didn't respond in time. This can happen with "
        "very long notes or PDFs — try a shorter document, or "
        f"just try again. (Details: {last_error})"
    )


# ========================================
# CLEAN GEMINI JSON
# ========================================

def clean_json_response(response_text):
    """
    Clean Gemini's response and find where the JSON starts.

    Handles:
    - ```json ... ```
    - ``` ... ```
    - Extra text before the JSON

    Note: this only trims LEADING junk (e.g. "Here's your quiz:").
    Trailing junk after the JSON is handled separately by
    generate_json(), which uses raw_decode() to parse just the
    first complete JSON value and ignore anything Gemini adds
    after it.
    """

    if not response_text:
        raise ValueError(
            "Gemini returned an empty response."
        )

    raw = response_text.strip()

    # Remove markdown code fences.
    raw = raw.replace("```json", "")
    raw = raw.replace("```", "")
    raw = raw.strip()

    # Find whichever comes first: the start of an array or an object.
    array_start = raw.find("[")
    object_start = raw.find("{")

    starts = [
        position
        for position in (array_start, object_start)
        if position != -1
    ]

    if not starts:
        raise ValueError(
            "Could not find valid JSON in Gemini response."
        )

    return raw[min(starts):].strip()


def generate_json(prompt):
    """
    Generate a Gemini response and convert it into Python JSON.

    Uses JSONDecoder.raw_decode() instead of json.loads() because
    Gemini sometimes appends extra content after the JSON block
    (a repeated answer, a trailing note, etc). raw_decode() parses
    just the first complete JSON value and ignores whatever comes
    after it, instead of raising "Extra data".
    """

    response_text = generate_gemini_response(prompt)

    cleaned = clean_json_response(
        response_text
    )

    decoder = json.JSONDecoder()

    try:
        parsed, _ = decoder.raw_decode(cleaned)
        return parsed

    except json.JSONDecodeError as error:
        print("❌ GEMINI JSON ERROR:")
        print(cleaned)

        raise ValueError(
            f"Gemini returned invalid JSON: {error}"
        )


# ========================================
# EXTRACT PDF TEXT
# ========================================

def extract_pdf_text(pdf_file):
    """
    Extract text from every page of a PDF.
    """

    reader = PdfReader(pdf_file)

    pages = []

    for page in reader.pages:

        text = page.extract_text()

        if text:
            pages.append(text)

    full_text = "\n".join(pages).strip()

    if len(full_text) > MAX_NOTES_CHARACTERS:

        print(
            f"⚠️ PDF text truncated from {len(full_text)} "
            f"to {MAX_NOTES_CHARACTERS} characters."
        )

        full_text = full_text[:MAX_NOTES_CHARACTERS]

    return full_text


# ========================================
# VALIDATE NUMBER
# ========================================

def validate_count(
    value,
    minimum=1,
    maximum=20
):
    """
    Validate question/flashcard count.
    """

    try:
        value = int(value)

    except (TypeError, ValueError):
        raise ValueError(
            "Count must be a number."
        )

    if value < minimum or value > maximum:
        raise ValueError(
            f"Count must be between "
            f"{minimum} and {maximum}."
        )

    return value


# ========================================
# GENERATE AND STORE QUIZ
# ========================================

def generate_and_store_quiz(
    notes,
    topic,
    num_questions,
    difficulty
):

    prompt = f"""
Based ONLY on the following study notes, generate
{num_questions} multiple-choice questions.

Topic: {topic}

Difficulty level: {difficulty}

Difficulty guidelines:

Easy:
- Test basic definitions, facts, and direct understanding.

Medium:
- Test understanding, application, and conceptual reasoning.

Hard:
- Test deeper reasoning, application, comparisons,
  and tricky concepts.

IMPORTANT:
- Questions must be based ONLY on the provided study notes.
- Do not introduce outside information.
- Each question must have exactly four options.
- Exactly one option must be correct.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use code blocks.

Return exactly this format:

[
    {{
        "question": "Question text",
        "options": {{
            "A": "Option A",
            "B": "Option B",
            "C": "Option C",
            "D": "Option D"
        }},
        "correct_answer": "A",
        "topic": "Short topic name"
    }}
]

Study notes:
{notes}
"""

    questions = generate_json(prompt)

    if not isinstance(questions, list):
        raise ValueError(
            "Gemini did not return a list of questions."
        )

    # Limit to requested number.
    questions = questions[:num_questions]

    # ========================================
    # STORE IN DATABASE
    # ========================================

    conn = get_db()
    cur = conn.cursor()

    # Only questions that pass validation and get stored end up here.
    # This is what we send back to the frontend, so it's always in
    # sync with what's actually in the database.
    public_questions = []

    try:

        cur.execute(
            """
            INSERT INTO sessions (topic)
            VALUES (?)
            """,
            (topic,)
        )

        session_id = cur.lastrowid

        for question in questions:

            # Basic structure validation.
            if not isinstance(question, dict):
                continue

            options = question.get(
                "options",
                {}
            )

            if not isinstance(options, dict):
                continue

            required_options = {
                "A",
                "B",
                "C",
                "D"
            }

            if not required_options.issubset(
                options.keys()
            ):
                continue

            question_text = question.get(
                "question",
                ""
            )

            correct_answer = question.get(
                "correct_answer",
                "A"
            )

            question_topic = question.get(
                "topic",
                topic
            )

            # Full record (including the answer) — this is what
            # gets stored and later used to grade the submission.
            stored_question = {
                "question": question_text,
                "options": options,
                "correct_answer": correct_answer,
                "topic": question_topic
            }

            cur.execute(
                """
                INSERT INTO questions
                (
                    session_id,
                    question_text,
                    correct_answer,
                    topic
                )
                VALUES (?, ?, ?, ?)
                """,
                (
                    session_id,
                    json.dumps(stored_question),
                    correct_answer,
                    question_topic
                )
            )

            # Public copy for the frontend — deliberately leaves out
            # correct_answer so a student can't see it in the network
            # response before taking the quiz.
            public_questions.append({
                "id": cur.lastrowid,
                "question": question_text,
                "options": options,
                "topic": question_topic
            })

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()

    if not public_questions:
        raise ValueError(
            "No valid questions were generated. Please try again."
        )

    return session_id, public_questions


# ========================================
# GENERATE LEARN CONTENT
# ========================================

def generate_learn_content(
    notes,
    topic
):

    prompt = f"""
Based ONLY on the following study notes, create a simple,
student-friendly study guide.

Topic: {topic}

IMPORTANT:
- Explain only information found in the notes.
- Do not add outside facts.
- Keep the explanation clear for a student.
- The overview should be 2-4 sentences.
- Include 3-8 important key points.
- Include important terms when appropriate.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use code blocks.

Use exactly this format:

{{
    "title": "Short topic title",

    "summary": "A clear 2-4 sentence overview.",

    "key_points": [
        "Important point 1",
        "Important point 2",
        "Important point 3"
    ],

    "important_terms": [
        {{
            "term": "Term",
            "meaning": "Simple explanation based on the notes."
        }}
    ]
}}

Study notes:
{notes}
"""

    content = generate_json(prompt)

    if not isinstance(content, dict):
        raise ValueError(
            "Gemini did not return valid study-guide data."
        )

    # Keep frontend consistent.
    content.setdefault(
        "title",
        topic or "Study Guide"
    )

    content.setdefault(
        "summary",
        ""
    )

    content.setdefault(
        "key_points",
        []
    )

    content.setdefault(
        "important_terms",
        []
    )

    return content


# ========================================
# GENERATE FLASHCARDS
# ========================================

def generate_flashcards(
    notes,
    topic,
    num_cards
):

    prompt = f"""
Based ONLY on the following study notes, create
{num_cards} useful study flashcards.

Topic: {topic}

Rules:
- Each flashcard should test an important concept.
- Questions must be clear.
- Answers should be concise.
- Do not add information not present in the notes.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use code blocks.

Use exactly this format:

[
    {{
        "question": "Question for the student",
        "answer": "Short answer based on the notes",
        "topic": "Short topic name"
    }}
]

Study notes:
{notes}
"""

    cards = generate_json(prompt)

    if not isinstance(cards, list):
        raise ValueError(
            "Gemini did not return a list of flashcards."
        )

    cards = cards[:num_cards]

    if not cards:
        raise ValueError(
            "No flashcards were generated."
        )

    return cards


# ========================================
# HOME
# ========================================

@app.route("/")
def home():
    return render_template(
        "index.html"
    )


# ========================================
# QUIZ FROM NOTES
# ========================================

@app.route(
    "/quiz",
    methods=["POST"]
)
def quiz():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        notes = (
            data.get("notes") or ""
        ).strip()

        topic = (
            data.get("topic")
            or "General"
        ).strip()

        difficulty = (
            data.get("difficulty")
            or "Easy"
        ).strip()

        num_questions = validate_count(
            data.get(
                "num_questions",
                5
            )
        )

        if not notes:

            return jsonify({
                "error":
                "Please provide some notes."
            }), 400

        session_id, questions = (
            generate_and_store_quiz(
                notes,
                topic,
                num_questions,
                difficulty
            )
        )

        return jsonify({
            "session_id": session_id,
            "questions": questions
        })

    except Exception as error:

        print(
            "❌ QUIZ ERROR:",
            error
        )

        return jsonify({
            "error":
            str(error)
        }), 500


# ========================================
# QUIZ FROM PDF
# ========================================

@app.route(
    "/quiz-from-pdf",
    methods=["POST"]
)
def quiz_from_pdf():

    try:

        pdf_file = request.files.get(
            "pdf"
        )

        if not pdf_file:

            return jsonify({
                "error":
                "Please upload a PDF."
            }), 400

        topic = (
            request.form.get(
                "topic"
            )
            or "General"
        ).strip()

        difficulty = (
            request.form.get(
                "difficulty"
            )
            or "Easy"
        ).strip()

        num_questions = validate_count(
            request.form.get(
                "num_questions",
                5
            )
        )

        notes = extract_pdf_text(
            pdf_file
        )

        if not notes:

            return jsonify({
                "error":
                "Couldn't extract text from this PDF. "
                "It might be scanned or image-based."
            }), 400

        session_id, questions = (
            generate_and_store_quiz(
                notes,
                topic,
                num_questions,
                difficulty
            )
        )

        return jsonify({
            "session_id": session_id,
            "questions": questions
        })

    except Exception as error:

        print(
            "❌ PDF QUIZ ERROR:",
            error
        )

        return jsonify({
            "error":
            str(error)
        }), 500


# ========================================
# LEARN FROM NOTES
# ========================================

@app.route(
    "/learn",
    methods=["POST"]
)
def learn():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        notes = (
            data.get("notes") or ""
        ).strip()

        topic = (
            data.get("topic")
            or "General"
        ).strip()

        if not notes:

            return jsonify({
                "error":
                "Please provide some notes."
            }), 400

        content = generate_learn_content(
            notes,
            topic
        )

        return jsonify(content)

    except Exception as error:

        print(
            "❌ LEARN ERROR:",
            error
        )

        return jsonify({
            "error":
            str(error)
        }), 500


# ========================================
# LEARN FROM PDF
# ========================================

@app.route(
    "/learn-from-pdf",
    methods=["POST"]
)
def learn_from_pdf():

    try:

        pdf_file = request.files.get(
            "pdf"
        )

        if not pdf_file:

            return jsonify({
                "error":
                "Please upload a PDF."
            }), 400

        topic = (
            request.form.get(
                "topic"
            )
            or "General"
        ).strip()

        notes = extract_pdf_text(
            pdf_file
        )

        if not notes:

            return jsonify({
                "error":
                "Couldn't extract text from this PDF. "
                "It might be scanned or image-based."
            }), 400

        content = generate_learn_content(
            notes,
            topic
        )

        return jsonify(content)

    except Exception as error:

        print(
            "❌ PDF LEARN ERROR:",
            error
        )

        return jsonify({
            "error":
            str(error)
        }), 500


# ========================================
# FLASHCARDS FROM NOTES
# ========================================

@app.route(
    "/flashcards",
    methods=["POST"]
)
def flashcards():

    try:

        data = request.get_json(
            silent=True
        ) or {}

        notes = (
            data.get("notes") or ""
        ).strip()

        topic = (
            data.get("topic")
            or "General"
        ).strip()

        num_cards = validate_count(
            data.get(
                "num_cards",
                5
            )
        )

        if not notes:

            return jsonify({
                "error":
                "Please provide some notes."
            }), 400

        cards = generate_flashcards(
            notes,
            topic,
            num_cards
        )

        return jsonify({
            "title":
            topic or "Flashcards",

            "flashcards":
            cards
        })

    except Exception as error:

        print(
            "❌ FLASHCARD ERROR:",
            error
        )

        return jsonify({
            "error":
            str(error)
        }), 500


# ========================================
# FLASHCARDS FROM PDF
# ========================================

@app.route(
    "/flashcards-from-pdf",
    methods=["POST"]
)
def flashcards_from_pdf():

    try:

        pdf_file = request.files.get(
            "pdf"
        )

        if not pdf_file:

            return jsonify({
                "error":
                "Please upload a PDF."
            }), 400

        topic = (
            request.form.get(
                "topic"
            )
            or "General"
        ).strip()

        num_cards = validate_count(
            request.form.get(
                "num_cards",
                5
            )
        )

        notes = extract_pdf_text(
            pdf_file
        )

        if not notes:

            return jsonify({
                "error":
                "Couldn't extract text from this PDF. "
                "It might be scanned or image-based."
            }), 400

        cards = generate_flashcards(
            notes,
            topic,
            num_cards
        )

        return jsonify({
            "title":
            topic or "Flashcards",

            "flashcards":
            cards
        })

    except Exception as error:

        print(
            "❌ PDF FLASHCARD ERROR:",
            error
        )

        return jsonify({
            "error":
            str(error)
        }), 500


# ========================================
# SUBMIT QUIZ
# ========================================

@app.route(
    "/submit",
    methods=["POST"]
)
def submit():

    conn = None

    try:

        data = request.get_json(
            silent=True
        ) or {}

        session_id = data.get(
            "session_id"
        )

        answers = data.get(
            "answers",
            {}
        )

        if not session_id:

            return jsonify({
                "error":
                "Missing session ID."
            }), 400

        if not isinstance(
            answers,
            dict
        ):

            return jsonify({
                "error":
                "Invalid answers."
            }), 400

        conn = get_db()

        questions = conn.execute(
            """
            SELECT *
            FROM questions
            WHERE session_id = ?
            ORDER BY id
            """,
            (session_id,)
        ).fetchall()

        if not questions:

            return jsonify({
                "error":
                "No questions found for this study session."
            }), 404

        score = 0
        review = []

        for question in questions:

            question_id = str(
                question["id"]
            )

            user_answer = answers.get(
                question_id
            )

            correct_answer = (
                question["correct_answer"]
            )

            is_correct = (
                user_answer ==
                correct_answer
            )

            if is_correct:
                score += 1

            conn.execute(
                """
                UPDATE questions
                SET
                    user_answer = ?,
                    is_correct = ?
                WHERE id = ?
                """,
                (
                    user_answer,
                    1 if is_correct else 0,
                    question["id"]
                )
            )

            try:

                question_data = json.loads(
                    question["question_text"]
                )

            except (
                json.JSONDecodeError,
                TypeError
            ):

                question_data = {
                    "question":
                    question["question_text"]
                }

            review.append({
                "id":
                question["id"],

                "question":
                question_data,

                "your_answer":
                user_answer,

                "correct_answer":
                correct_answer,

                "is_correct":
                is_correct,

                "topic":
                question["topic"]
            })

        conn.commit()

        return jsonify({
            "score":
            score,

            "total":
            len(questions),

            "review":
            review
        })

    except Exception as error:

        if conn:
            conn.rollback()

        print(
            "❌ SUBMIT ERROR:",
            error
        )

        return jsonify({
            "error":
            "Something went wrong while "
            "checking your answers."
        }), 500

    finally:

        if conn:
            conn.close()


# ========================================
# WEAK TOPICS
# ========================================

@app.route(
    "/weak-topics"
)
def weak_topics():

    conn = None

    try:

        conn = get_db()

        rows = conn.execute(
            """
            SELECT
                topic,
                COUNT(*) AS total,
                SUM(
                    CASE
                        WHEN is_correct = 0
                        THEN 1
                        ELSE 0
                    END
                ) AS wrong
            FROM questions
            WHERE user_answer IS NOT NULL
            GROUP BY topic
            ORDER BY wrong DESC
            """
        ).fetchall()

        return jsonify({
            "topics": [
                dict(row)
                for row in rows
            ]
        })

    except Exception as error:

        print(
            "❌ WEAK TOPICS ERROR:",
            error
        )

        return jsonify({
            "error":
            "Could not load weak topics."
        }), 500

    finally:

        if conn:
            conn.close()


# ========================================
# START APPLICATION
# ========================================

if __name__ == "__main__":

    init_db()

    app.run(
        debug=True
    )