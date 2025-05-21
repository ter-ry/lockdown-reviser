# Lockdown-Style MCQ Reviewer

This project is a **local multiple choice question (MCQ) reviewer** styled after the **lockdown browser environment**, designed to help you revise for certification exams — specifically built around the **AZ-900 question bank** (Microsoft Azure Fundamentals).

## ✅ Features

- One-question-at-a-time interface (mimics lockdown browser)
- No backtracking or skipping
- Instant feedback (correct/incorrect + explanation)
- Tracks incorrect answers using browser localStorage
- Revision mode that cycles only your incorrect questions until you get them right

## 📂 Folder Structure

```
lockdown-reviser/
├── index.html                # Main quiz interface
├── style.css                 # Dark mode, lockdown-style styling
├── app.js                    # Core logic (load questions, validate answers, track progress)
├── AZ-900-MCQs-Only.json     # Cleaned question set (generated from extract + filter scripts)
├── extract.py                # Extracts raw text from PDF (AZ-900.pdf → raw.txt)
├── filter.py                 # Filters MCQs from raw.txt and outputs AZ-900-MCQs-Only.json
```

## ⚙️ Setup Instructions

1. Place your question bank PDF (e.g. `AZ-900.pdf`) in the folder.
2. Run:

```bash
python extract.py
python filter.py
```

3. Start a local server (due to browser fetch restrictions):

```bash
python -m http.server 8080
```

4. Visit `http://localhost:8080` in your browser.

> The MCQs will be displayed with feedback and answer tracking.

## 🔄 Changing the Question Bank

If you're not studying for AZ-900, just replace:
- Your PDF file in `extract.py`
- The output name `AZ-900-MCQs-Only.json` (or rename it consistently)
- Update the title in `index.html` to reflect your exam (e.g., “AWS Cloud Practitioner MCQ Review”)

---

## 🐞 Known Bugs / Limitations

- ❌ Words containing `fi` (e.g. *configure*, *satisfies*) may be missing due to PDF font encoding issues
- ❌ Questions with **multiple correct answers** (e.g. select 2 out of 4) are not currently supported

---

## 🧩 Use Case

This project is designed for students and candidates preparing for certification exams where navigation is restricted, such as those using **lockdown browsers**.

It recreates that experience for effective self-testing.

---

## 📄 License

MIT License
