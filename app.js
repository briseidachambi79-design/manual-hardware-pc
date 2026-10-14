const quizData = [
  { q: '¿Qué zócalo es de AMD para Ryzen 7000?', options: ['AM4','AM5','LGA1700','LGA1200'], answer: 1, hint: 'AM5 es la plataforma moderna de AMD (DDR5/PCIe 5.0).' },
  { q: '¿Qué conector de 24 pines alimenta la placa base?', options: ['8-pin EPS','6-pin PCIe','24-pin ATX','SATA'], answer: 2, hint: 'El conector ATX de 24 pines es el principal de placa.' },
  { q: '¿Qué memoria usa 1.1 V típicamente?', options: ['DDR3','DDR4','DDR5','SO-DIMM DDR3'], answer: 2, hint: 'DDR5 opera a ~1.1 V.' },
  { q: 'Antes de instalar la CPU, ¿qué se debe hacer?', options: ['Aplicar pasta térmica directa a los pines','Verificar orientación y alinear la flecha','Forzar hasta que encaje','Ignorar el zócalo'], answer: 1, hint: 'Siempre verifica la muesca/flecha para evitar doblar pines.' },
  { q: '¿Qué certificación suele ser un buen balance precio/eficiencia?', options: ['80 Plus White','80 Plus Gold','80 Plus Titanium','Sin certificación'], answer: 1, hint: 'Gold ofrece buena eficiencia y costo razonable.' },
  { q: 'Para una GPU de alto consumo, ¿qué conector es común?', options: ['SATA','6/8-pin PCIe','RJ45','USB-C frontal'], answer: 1, hint: 'Las GPU usan PCIe de 6/8 pines (o 12VHPWR). ' },
];

let currentQ = 0, score = 0, answered = false;
const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizScore = document.getElementById('quizScore');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartQuiz');

function renderQuiz() {
  answered = false;
  quizFeedback.textContent = '';
  quizFeedback.className = 'quiz-feedback';
  nextBtn.style.display = 'none';
  const q = quizData[currentQ];
  quizQuestion.textContent = `Pregunta ${currentQ + 1}/${quizData.length}: ${q.q}`;
  quizOptions.innerHTML = q.options.map((opt, i) => `<button class="opt-btn" data-i="${i}">${opt}</button>`).join('');
  quizOptions.querySelectorAll('.opt-btn').forEach(btn => btn.addEventListener('click', () => checkAnswer(parseInt(btn.dataset.i))));
  quizScore.textContent = `Puntaje: ${score}/${currentQ}`;
}

function checkAnswer(i) {
  if (answered) return;
  answered = true;
  const q = quizData[currentQ];
  const btns = quizOptions.querySelectorAll('.opt-btn');
  btns.forEach((b, idx) => {
    b.disabled = true;
    if (idx === q.answer) b.classList.add('correct');
    if (idx === i && i !== q.answer) b.classList.add('wrong');
  });
  if (i === q.answer) { score++; quizFeedback.textContent = '✅ ¡Correcto!'; quizFeedback.classList.add('ok'); }
  else { quizFeedback.textContent = `❌ Incorrecto. Pista: ${q.hint}`; quizFeedback.classList.add('bad'); }
  nextBtn.style.display = 'inline-flex';
  quizScore.textContent = `Puntaje: ${score}/${currentQ + 1}`;
}

nextBtn.addEventListener('click', () => {
  currentQ++;
  if (currentQ >= quizData.length) {
    quizQuestion.textContent = `¡Quiz terminado! Resultado: ${score}/${quizData.length}`;
    quizOptions.innerHTML = '';
    quizFeedback.textContent = score === quizData.length ? '🏆 Perfecto. ¡Eres un experto en hardware!' : '💡 Repasa los componentes y vuelve a intentarlo.';
    quizFeedback.className = 'quiz-feedback ' + (score === quizData.length ? 'ok' : 'bad');
    nextBtn.style.display = 'none';
    return;
  }
  renderQuiz();
});
restartBtn.addEventListener('click', () => { currentQ = 0; score = 0; renderQuiz(); });

// theme
const themeToggle = document.getElementById('themeToggle');
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = 'light'; try { saved = localStorage.getItem('theme') || 'light'; } catch (e) {}
applyTheme(saved);
themeToggle.addEventListener('click', () => applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

// install
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; installBtn.hidden = false; });
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if (choice.outcome === 'accepted') alert('App instalada.');
  deferredPrompt = null;
  installBtn.hidden = true;
});

renderQuiz();
