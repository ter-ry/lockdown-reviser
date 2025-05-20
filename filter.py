import json
import re

def is_mcq(question_text):
    return (
        re.search(r"\bA\.\s", question_text) and
        re.search(r"\bB\.\s", question_text)
    )

def filter_mcqs(input_json, output_json):
    with open(input_json, "r", encoding="utf-8") as infile:
        data = json.load(infile)

    mcqs = []
    for item in data:
        q = item["raw_question"]
        if is_mcq(q):
            # Extract options
            options = {}
            matches = re.findall(r"([A-Z])\.\s(.*?)(?=\n[A-Z]\.\s|\Z)", q, re.DOTALL)
            for key, val in matches:
                options[key] = val.strip()

            mcqs.append({
                "question": re.split(r"A\.\s", q)[0].strip(),  # Everything before A.
                "options": options,
                "correct_answer": item["correct_answer"]
            })

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(mcqs, f, indent=2, ensure_ascii=False)

# Run it
filter_mcqs("AZ-900-LooseParsed.json", "AZ-900-MCQs-Only.json")
