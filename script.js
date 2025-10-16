const queues = { 1: [], 2: [], 3: [], 4: [] };
const lastNumber = { 1: 0, 2: 0, 3: 0, 4: 0 }; // simpan nomor terakhir per ruangan

function addPatient() {
  const name = document.getElementById("patientName").value.trim();
  const room = document.getElementById("roomSelect").value;

  if (!name) {
    alert("Please enter a patient name!");
    return;
  }

  // ambil nomor antrian terakhir dan tambah 1
  lastNumber[room] += 1;
  const number = lastNumber[room];

  queues[room].push({ name, number });
  renderTable(room);
  document.getElementById("patientName").value = "";
}

function renderTable(room) {
  const tbody = document.querySelector(`#room${room} tbody`);
  tbody.innerHTML = "";

  queues[room].forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.number}</td>
      <td>${p.name}</td>
      <td><button class="action-btn" onclick="callPatient(${room}, ${p.number})">🔊 Call</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function callPatient(room, number) {
  const queue = queues[room];
  const index = queue.findIndex(p => p.number === number);
  if (index === -1) return;

  const patient = queue[index];
  const message = `Patient number ${patient.number}, ${patient.name}, please go to Room ${room}.`;

  // 🔊 Panggil dua kali
  speak(message);
  setTimeout(() => speak(message), 3500);

  // Simpan ke history sebelum dihapus
  addToHistory(room, patient);

  // Hapus pasien dari daftar tanpa ubah nomor lain
  queue.splice(index, 1);
  renderTable(room);
}

function addToHistory(room, patient) {
  const historyDiv = document.getElementById("history");
  const entry = document.createElement("div");
  entry.classList.add("history-item");
  entry.textContent = `Room ${room} - Patient #${patient.number}: ${patient.name}`;
  historyDiv.prepend(entry);
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  const voices = speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));
  if (englishVoice) utterance.voice = englishVoice;

  speechSynthesis.speak(utterance);
}

speechSynthesis.onvoiceschanged = () => {};

// === THEME SWITCH FUNCTIONALITY ===
const themeCheckbox = document.getElementById('theme-toggle');
const body = document.body;

// cek preferensi tersimpan
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  themeCheckbox.checked = true;
}

// ubah tema saat switch diubah
themeCheckbox.addEventListener('change', () => {
  if (themeCheckbox.checked) {
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', toggle.checked);
});

});
