import pdfplumber
import re
import json

def extract_all_valid_questions(pdf_path, output_json):
    with pdfplumber.open(pdf_path) as pdf:
        text = "\n".join(p.extract_text() for p in pdf.pages if p.extract_text())

    # Match blocks starting with "Question #X" until the next "Question #"
    blocks = re.findall(r"(Question\s+#\d+[\s\S]*?)(?=Question\s+#\d+|$)", text)

    questions = []
    for block in blocks:
        if "Correct Answer:" not in block:
            continue

        # Remove lines like: upvoted, usernames, links, emojis
        clean = re.sub(r"(upvoted.*|.*|https?://\S+|[^\x00-\x7F]+)", "", block)
        clean = re.sub(r"\n{2,}", "\n", clean).strip()

        # Extract correct answer
        answer_match = re.search(r"Correct Answer:\s*([A-Z])", clean)
        correct = answer_match.group(1) if answer_match else None

        # Extract options and question body (we’ll treat everything before "Correct Answer" as one block)
        before_answer = clean.split("Correct Answer:")[0].strip()

        questions.append({
            "raw_question": before_answer,
            "correct_answer": correct
        })

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)

# Run it
extract_all_valid_questions("AZ-900.pdf", "AZ-900-LooseParsed.json")
