let questions = [];
let index = 0;
let wrongQuestions = JSON.parse(localStorage.getItem("wrongQuestions") || "[]");
let reviewMode = false;

fetch("AZ-900-MCQs-Only.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function showQuestion() {
  const quiz = document.getElementById("quiz");
  const feedback = document.getElementById("feedback");
  quiz.innerHTML = "";
  feedback.innerText = "";

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
  qText.innerText = current.question;
  quiz.appendChild(qText);

  for (let key in current.options) {
    const label = document.createElement("label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "option";
    radio.value = key;
    radio.onclick = () => {
      const correct = current.correct_answer;
      if (key === correct) {
        feedback.innerText = "✅ Correct!";
        feedback.style.color = "green";
      } else {
        feedback.innerText = `❌ Incorrect. Correct answer: ${correct}`;
        feedback.style.color = "red";
        if (!wrongQuestions.find(q => q.question === current.question)) {
          wrongQuestions.push(current);
          localStorage.setItem("wrongQuestions", JSON.stringify(wrongQuestions));
        }
      }
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(` ${key}. ${current.options[key]}`));
    quiz.appendChild(label);
  }
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
