let questions = [];
let index = 0;
let wrongQuestions = JSON.parse(localStorage.getItem("wrongQuestions") || "[]");
let reviewMode = false;

fetch("CLF_C02.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function showQuestion() {
  const quiz = document.getElementById("quiz");
  const feedback = document.getElementById("feedback");
  quiz.innerHTML = "";
  feedback.innerHTML = "";

  const current = (reviewMode ? wrongQuestions : questions)[index];
  if (!current) {
    quiz.innerHTML = "<p>🎉 All done!</p>";
    document.getElementById("nextBtn").style.display = "none";
    if (reviewMode) {
      localStorage.setItem("wrongQuestions", JSON.stringify([]));
    } else {
      document.getElementById("reviewWrongBtn").style.display = wrongQuestions.length ? "inline" : "none";
    }
    return;
  }

  const qText = document.createElement("p");
  qText.innerHTML = current.question.replace(/\n/g, " ");
  qText.className = "question";
  quiz.appendChild(qText);

  for (let key in current.options) {
    const wrapper = document.createElement("div");
    wrapper.className = "option";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "option";
    checkbox.value = key;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${key}. ${current.options[key]}`));
    wrapper.appendChild(label);
    quiz.appendChild(wrapper);
  }

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.onclick = () => {
    const selected = Array.from(document.querySelectorAll("input[name='option']:checked")).map(r => r.value);
    const correct = current.correct_answers || [current.correct_answer]; // support both formats

    const selectedSet = new Set(selected);
    const correctSet = new Set(correct);
    const isCorrect = selectedSet.size === correctSet.size && [...selectedSet].every(x => correctSet.has(x));

    feedback.innerHTML = `
      ${isCorrect ? "✅ Correct!" : `❌ Incorrect. Correct answer(s): ${correct.join(", ")}`}<br/><br/>
      <strong>Explanation:</strong><br/>
      ${current.explanation || "(No explanation provided)"}
    `;
    feedback.style.color = isCorrect ? "green" : "red";

    if (!isCorrect && !wrongQuestions.find(q => q.question === current.question)) {
      wrongQuestions.push(current);
      localStorage.setItem("wrongQuestions", JSON.stringify(wrongQuestions));
    }

    document.querySelectorAll("input[name='option']").forEach(cb => cb.disabled = true);
    submitBtn.disabled = true;
  };

  quiz.appendChild(submitBtn);
}

document.getElementById("nextBtn").onclick = () => {
  index++;
  showQuestion();
};

document.getElementById("reviewWrongBtn").onclick = () => {
  if (wrongQuestions.length === 0) {
    alert("No wrong questions to review.");
    return;
  }
  reviewMode = true;
  index = 0;
  showQuestion();
};

document.getElementById("resetBtn").onclick = () => {
  localStorage.removeItem("wrongQuestions");
  wrongQuestions = [];
  reviewMode = false;
  index = 0;
  showQuestion();
};
