document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quizId");

  if (!quizId) {
    alert("Quiz ID tidak ditemukan.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/teacher/quizzes/${quizId}/leaderboard`, {
      headers: {
        "Content-Type": "application/json",
        access_token: localStorage.getItem("access_token"),
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Gagal memuat leaderboard.");

    const leaderboard = result.leaderboard || result.data || []; // disesuaikan dengan response backend
    const tbody = document.getElementById("leaderboardBody");

    if (leaderboard.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3">Belum ada peserta.</td></tr>`;
    } else {
      leaderboard.forEach((participant, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${participant.name}</td>
          <td>${participant.score}</td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan saat memuat leaderboard.");
  }

  // Tombol kembali
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "viewquiz.html";
  });
});
