const itemsContainer = document.querySelector('.items');
const bins = document.querySelectorAll('.bin');
const scoreDisplay = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const feedback = document.getElementById('game-feedback');
const newRoundBtn = document.getElementById('newRoundBtn');
const toggleMusicBtn = document.getElementById('toggleMusicBtn');

const bgMusic = document.getElementById('bgMusic');
const winMusic = document.getElementById('winMusic');
const errorSound = document.getElementById('errorSound');

let score = 0;
let musicPlaying = true;

const clothes = [
  { name: 'Camisa rasgada', type: 'lixo' },
  { name: 'Calça jeans', type: 'doacao' },
  { name: 'Vestido velho', type: 'reciclagem' },
  { name: 'Jaqueta em bom estado', type: 'doacao' },
  { name: 'Meia furada', type: 'lixo' },
  { name: 'Tecido reaproveitável', type: 'reciclagem' }
];

function createItems() {
  itemsContainer.innerHTML = '';
  clothes.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('draggable');
    div.textContent = item.name;
    div.setAttribute('draggable', true);
    div.dataset.type = item.type;
    div.dataset.index = index;
    itemsContainer.appendChild(div);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.index);
}

function handleDrop(e) {
  e.preventDefault();
  const index = e.dataTransfer.getData('text/plain');
  const item = clothes[index];
  const binType = e.currentTarget.dataset.accept;

  if (item.type === binType) {
    score += 10;
    feedback.textContent = `✅ Boa escolha para "${item.name}"!`;
    winMusic.play();
  } else {
    score -= 5;
    feedback.textContent = `❌ "${item.name}" não deveria ir para ${binType}.`;
    errorSound.play();
  }

  scoreDisplay.textContent = `🌍 Pontuação coletiva: ${score} pontos`;
  updateProgress();
  e.currentTarget.appendChild(document.querySelector(`[data-index="${index}"]`));
}

function updateProgress() {
  const percent = Math.min(score, 100);
  progressBar.style.width = `${percent}%`;
}

function allowDrop(e) {
  e.preventDefault();
}

function toggleMusic() {
  musicPlaying = !musicPlaying;
  bgMusic[musicPlaying ? 'play' : 'pause']();
  toggleMusicBtn.textContent = musicPlaying ? '🔈 Pausar Música' : '🔊 Tocar Música';
}

function startNewRound() {
  score = 0;
  feedback.textContent = '';
  scoreDisplay.textContent = `🌍 Pontuação coletiva: ${score} pontos`;
  progressBar.style.width = '0%';
  createItems();
}

createItems();
bins.forEach(bin => {
  bin.addEventListener('dragover', allowDrop);
  bin.addEventListener('drop', handleDrop);
});
itemsContainer.addEventListener('dragstart', handleDragStart);
newRoundBtn.addEventListener('click', startNewRound);
toggleMusicBtn.addEventListener('click', toggleMusic);
