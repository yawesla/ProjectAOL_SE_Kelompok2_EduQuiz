// Data quiz contoh (bisa diganti sesuai kebutuhan)
const questions = [
  {
    text: "Apa ibu kota Indonesia?",
    options: ["Jakarta", "Bandung", "Surabaya", "Medan"],
    correctAnswer: 0,
    userCounts: [15, 3, 2, 1]
  },
  {
    text: "Siapa penemu lampu pijar?",
    options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Isaac Newton"],
    correctAnswer: 0,
    userCounts: [12, 4, 1, 2]
  },
  {
    text: "Berapa hasil 5 x 6?",
    options: ["30", "25", "35", "40"],
    correctAnswer: 0,
    userCounts: [18, 1, 0, 0]
  },
  {
    text: "Apa warna bendera Jepang?",
    options: ["Merah dan Putih", "Merah dan Hitam", "Putih dan Biru", "Merah dan Biru"],
    correctAnswer: 0,
    userCounts: [20, 0, 0, 0]
  },
  {
    text: "Siapa presiden pertama Indonesia?",
    options: ["Soekarno", "Soeharto", "Joko Widodo", "B.J. Habibie"],
    correctAnswer: 0,
    userCounts: [19, 1, 0, 0]
  }
];

// Ambil elemen DOM
const startQuizBtn = document.getElementById('startQuizBtn');
const hostView = document.getElementById('hostView');
const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const timerDisplay = document.getElementById('timer');
const answerOptions = document.getElementById('answerOptions');
const prevQuestionBtn = document.getElementById('prevQuestionBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const completeQuestionBtn = document.getElementById('completeQuestionBtn');
const finishQuizBtn = document.getElementById('finishQuizBtn');

let currentQuestionIndex = 0;
let quizStarted = false;
let timerInterval = null;
const timeLimitSeconds = 30; // waktu per soal dalam detik
let timeLeft = timeLimitSeconds;
let questionAnswered = false; // status apakah pertanyaan sudah selesai ditampilkan hasilnya

// Fungsi mulai timer
function startTimer() {
  timeLeft = timeLimitSeconds;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      completeCurrentQuestion();
    }
  }, 1000);
}

// Update tampilan timer
function updateTimerDisplay() {
  timerDisplay.textContent = `Waktu tersisa: ${timeLeft} detik`;
}

// Update pertanyaan dan pilihan jawaban
function updateQuestion() {
  questionAnswered = false;
  completeQuestionBtn.disabled = false;

  const current = questions[currentQuestionIndex];
  questionNumber.textContent = `Pertanyaan ${currentQuestionIndex + 1} dari ${questions.length}`;
  questionText.textContent = current.text;

  // Kosongkan pilihan jawaban dulu
  answerOptions.innerHTML = '';

  // Buat elemen pilihan jawaban
  current.options.forEach((optionText, idx) => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('answer-option');
    optionDiv.textContent = `${String.fromCharCode(65 + idx)}. ${optionText}`;
    answerOptions.appendChild(optionDiv);
  });

  // Atur tombol navigasi
  prevQuestionBtn.disabled = currentQuestionIndex === 0;
  nextQuestionBtn.disabled = true; // disable next sampai pertanyaan selesai
  completeQuestionBtn.style.display = 'inline-block';

  // Tampilkan tombol finish hanya di soal terakhir
  if (currentQuestionIndex === questions.length - 1) {
    finishQuizBtn.style.display = 'inline-block';
    nextQuestionBtn.style.display = 'none';
  } else {
    finishQuizBtn.style.display = 'none';
    nextQuestionBtn.style.display = 'inline-block';
  }

  // Mulai timer ulang setiap ganti soal
  clearInterval(timerInterval);
  startTimer();
}

// Tampilkan hasil jawaban setelah waktu habis atau selesai
function showResults() {
  clearInterval(timerInterval);
  timerDisplay.textContent = 'Waktu habis! Menampilkan hasil...';

  const current = questions[currentQuestionIndex];
  answerOptions.innerHTML = '';

  current.options.forEach((optionText, idx) => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('answer-option');

    // Tandai jawaban benar dan salah
    if (idx === current.correctAnswer) {
      optionDiv.classList.add('correct');
    } else {
      optionDiv.classList.add('incorrect');
    }

    // Tampilkan teks pilihan dan jumlah user yang memilih
    const count = current.userCounts ? current.userCounts[idx] : 0;
    optionDiv.textContent = `${String.fromCharCode(65 + idx)}. ${optionText} — Dipilih oleh ${count} user`;

    answerOptions.appendChild(optionDiv);
  });

  // Nonaktifkan navigasi soal saat hasil tampil
  prevQuestionBtn.disabled = true;
  nextQuestionBtn.disabled = true;
  finishQuizBtn.disabled = true;
  completeQuestionBtn.disabled = true;
  startQuizBtn.disabled = true;

  // Tambahkan tombol View Leaderboard jika sudah soal terakhir dan belum ada tombolnya
  if (currentQuestionIndex === questions.length - 1) {
    if (!document.getElementById('viewLeaderboardBtn')) {
      const leaderboardBtn = document.createElement('button');
      leaderboardBtn.id = 'viewLeaderboardBtn';
      leaderboardBtn.textContent = 'View Leaderboard';
      leaderboardBtn.classList.add('btn', 'primary-btn');
      leaderboardBtn.style.marginTop = '20px';
      leaderboardBtn.onclick = () => {
        window.location.href = 'leaderboard.html';
      };
      hostView.appendChild(leaderboardBtn);
    }
  }
}

// Fungsi untuk menyelesaikan pertanyaan saat ini (manual atau timer habis)
function completeCurrentQuestion() {
  if (!questionAnswered) {
    questionAnswered = true;
    clearInterval(timerInterval);
    showResults();

    // Setelah hasil tampil, aktifkan tombol Next jika bukan soal terakhir
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestionBtn.disabled = false;
    }

    // Nonaktifkan tombol Complete agar tidak bisa ditekan lagi
    completeQuestionBtn.disabled = true;
  }
}

// Event listener tombol Start Quiz
startQuizBtn.addEventListener('click', () => {
  if (!quizStarted) {
    quizStarted = true;
    hostView.style.display = 'flex';
    startQuizBtn.disabled = true;
    prevQuestionBtn.disabled = true;
    nextQuestionBtn.disabled = questions.length > 1 ? false : true;
    currentQuestionIndex = 0;
    updateQuestion();
  }
});

// Event listener tombol Previous
prevQuestionBtn.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    updateQuestion();
  }
});

// Event listener tombol Next
nextQuestionBtn.addEventListener('click', () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    updateQuestion();
  }
});

// Event listener tombol Finish Quiz
finishQuizBtn.addEventListener('click', () => {
    
  showResults();

});

// Event listener tombol Selesaikan Pertanyaan
completeQuestionBtn.addEventListener('click', () => {
  completeCurrentQuestion();
});
