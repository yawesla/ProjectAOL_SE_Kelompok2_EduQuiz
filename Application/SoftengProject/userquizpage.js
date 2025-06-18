let currentQuestion = 1;
let totalQuestions = 0;
const quizId = localStorage.getItem("quizId");
const participantId = localStorage.getItem("participantId");
const accessToken = localStorage.getItem("access_token");

const questionNumberEl = document.getElementById("questionNumber");
const questionTextEl = document.getElementById("questionText");
const answerOptionsEl = document.getElementById("answerOptions");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const resultContainer = document.getElementById("resultContainer");
const resultSummary = document.getElementById("resultSummary");

const URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  if (!quizId || !participantId || !accessToken) {
    alert("Quiz, peserta, atau token tidak ditemukan.");
    return;
  }

  fetch(`${URL}/student/quiz/${quizId}/`, {
    headers: {
      access_token: accessToken,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      totalQuestions = data.totalQuestions;
      loadQuestion();
    })
    .catch((err) => {
      alert("Gagal mengambil jumlah soal.");
      console.error(err);
    });
});

let timer;
let timeLeft = 15;
let selectedOption = null;
let selectedQuestionId = null;

function loadQuestion() {
  nextBtn.disabled = true;
  fetch(`${URL}/student/quiz/${quizId}/questions/${currentQuestion}`, {
    headers: {
      access_token: accessToken,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      selectedOption = null;
      selectedQuestionId = data.questionId;

      questionNumberEl.innerText = `Soal ${data.questionNumber} dari ${totalQuestions}`;
      questionTextEl.innerText = data.questionText;
      answerOptionsEl.innerHTML = "";

      for (const key in data.options) {
        const btn = document.createElement("button");
        btn.classList.add("btn");
        btn.innerText = `${key}: ${data.options[key]}`;
        btn.onclick = () => selectAnswer(key);
        answerOptionsEl.appendChild(btn);
      }

      startTimer();
    })
    .catch((err) => {
      alert("Gagal mengambil soal.");
      console.error(err);
    });
}

function selectAnswer(option) {
  selectedOption = option;
  nextBtn.disabled = false;

  const buttons = answerOptionsEl.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.classList.remove("selected");
    if (btn.innerText.startsWith(option)) {
      btn.classList.add("selected");
    }
  });
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerEl.innerText = `Waktu: ${timeLeft} detik`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Waktu: ${timeLeft} detik`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoSubmitAnswer();
    }
  }, 1000);
}

function autoSubmitAnswer() {
  submitAnswer(selectedOption); // boleh null
}

nextBtn.addEventListener("click", () => {
  submitAnswer(selectedOption);
});

function submitAnswer(option) {
  nextBtn.disabled = true;
  clearInterval(timer);

  if (!selectedQuestionId) {
    alert("Pertanyaan tidak valid.");
    return;
  }

  fetch(`${URL}/student/quiz/${quizId}/questions/${selectedQuestionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: accessToken,
    },
    body: JSON.stringify({
      participantId,
      chooseOption: option, // bisa null
    }),
  })
    .then((res) => res.json())
    .then(() => {
      currentQuestion++;
      if (currentQuestion > totalQuestions) {
        showResult();
      } else {
        loadQuestion();
      }
    })
    .catch((err) => {
      alert("Gagal mengirim jawaban.");
      console.error(err);
    });
}

function showResult() {
  document.getElementById("quizContainer").style.display = "none";
  resultContainer.style.display = "block";
  fetchAllResults();
}

function fetchAllResults() {
  let totalScore = 0;
  let completed = 0;

  for (let i = 1; i <= totalQuestions; i++) {
    fetch(
      `${URL}/student/quiz/${quizId}/questions/${i}/result?participantId=${participantId}`,
      {
        headers: {
          access_token: accessToken,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const score = Number(data.score);
        totalScore += isNaN(score) ? 0 : score;

        completed++;
        if (completed === totalQuestions) {
          resultSummary.innerHTML = `<p>Skor akhir Anda: <strong>${totalScore}</strong></p>`;
        }
      })
      .catch((err) => {
        console.error(`Gagal mengambil hasil soal ke-${i}:`, err);
      });
  }
}
