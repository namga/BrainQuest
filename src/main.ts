import Phaser from 'phaser';
import './style.css';

type Puzzle = { sequence: string[]; answers: string[]; correct: number; title: string; instruction: string; hint: string; explain: string };
const puzzles: Puzzle[] = [
  {sequence:['●','●●','●●●','?'],answers:['●','●●●●','●●','◈'],correct:1,title:'What comes next?',instruction:'The pattern is growing. Can you spot how?',hint:'Count how many dots appear in each step.',explain:'One dot is added each time: 1, 2, 3, then 4.'},
  {sequence:['▲','■','▲','■','?'],answers:['●','▲','◆','■'],correct:1,title:'Follow the rhythm',instruction:'Every shape has its place in this sequence.',hint:'The two shapes alternate.',explain:'Triangle, square, triangle, square… triangle!'},
  {sequence:['2','4','8','16','?'],answers:['18','24','30','32'],correct:3,title:'Double trouble',instruction:'Numbers can hide a simple rule.',hint:'Each number is multiplied by the same amount.',explain:'Each number doubles: 2, 4, 8, 16, 32.'},
  {sequence:['☾','◐','●','◑','?'],answers:['☾','●','◐','★'],correct:0,title:'Moon phases',instruction:'Watch how the light changes.',hint:'The sequence cycles back to the beginning.',explain:'The four symbols repeat in the same order.'},
  {sequence:['1','4','9','16','?'],answers:['20','24','25','36'],correct:2,title:'Square it up',instruction:'Look for the hidden number pattern.',hint:'Think 1×1, 2×2, 3×3…',explain:'These are square numbers: 1, 4, 9, 16, 25.'},
  {sequence:['◆','◇','◆','◇','?'],answers:['◇','◆','○','□'],correct:1,title:'Light and shadow',instruction:'One filled, one empty. What follows?',hint:'Filled and empty diamonds take turns.',explain:'The pattern alternates filled and empty diamonds.'},
  {sequence:['3','6','9','12','?'],answers:['13','14','15','18'],correct:2,title:'Count by three',instruction:'Find the steady step between numbers.',hint:'Add the same number each time.',explain:'Add 3 each time to reach 15.'},
  {sequence:['🟦','🟦🟨','🟦🟨🟦','?'],answers:['🟨🟦🟨','🟦🟨🟦🟨','🟦🟦🟨','🟨🟨🟦'],correct:1,title:'Color cascade',instruction:'A new tile joins the line at each step.',hint:'Keep adding one tile, alternating blue and yellow.',explain:'The next sequence adds a yellow tile at the end.'}
];

const saveKey = 'brain-quest-save-v1';
type Save = { xp: number; solved: number[]; stars: number; sound: boolean; premiumInterest: boolean };
const defaultSave: Save = { xp: 120, solved: [], stars: 0, sound: true, premiumInterest: false };
let save: Save = loadSave();
let activeWorld = 0;
let activePuzzle = 0;
let dailyMode = false;
let hinted = false;
let toastTimer = 0;

function loadSave(): Save {
  try { return { ...defaultSave, ...JSON.parse(localStorage.getItem(saveKey) || '{}') }; } catch { return { ...defaultSave }; }
}
function persist() { localStorage.setItem(saveKey, JSON.stringify(save)); renderStats(); }
function $(id: string) { const el = document.getElementById(id); if (!el) throw new Error(`Missing element #${id}`); return el; }
function showToast(message: string) { const el = $('toast'); el.textContent = message; el.classList.add('show'); window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => el.classList.remove('show'), 2400); }
function renderStats() {
  $('xp-count').textContent = String(save.xp);
  $('solved-count').textContent = String(save.solved.length);
  $('star-count').textContent = `☆ ${save.stars} stars`;
  $('progress-fill').style.width = `${Math.min(100, save.solved.length / 60 * 100)}%`;
  $('next-level').textContent = `${save.xp % 300} / 300 XP`;
  $('world-progress').textContent = `${[0,1,2].filter(w => worldUnlocked(w)).length} / 3 worlds`;
  $('lock-1').textContent = worldUnlocked(1) ? '✓ WORLD OPEN' : '🔒 Unlock at 5 stars';
  $('lock-2').textContent = worldUnlocked(2) ? '✓ WORLD OPEN' : '🔒 Unlock at 15 stars';
  document.querySelectorAll<HTMLButtonElement>('.world-card').forEach((card, i) => card.classList.toggle('locked', !worldUnlocked(i)));
}
function worldUnlocked(world: number) { return world === 0 || save.stars >= (world === 1 ? 5 : 15); }
function puzzleFor(world: number, index: number): Puzzle {
  const base = puzzles[(index + world * 2) % puzzles.length];
  if (world === 1) return { ...base, title: ['Plan your next move','A clever sequence','Think in steps'][index % 3], instruction: 'Use the pattern to predict the next move.' };
  if (world === 2) return { ...base, title: ['Memory of the cosmos','A stellar pattern','Connect the clues'][index % 3], instruction: 'Focus on the symbols and find the hidden rule.' };
  return base;
}
function openPuzzle(world = 0, index = 0, daily = false) {
  if (!worldUnlocked(world)) { showToast(world === 1 ? 'Earn 5 stars to unlock Clockwork Lab.' : 'Earn 15 stars to unlock Cosmic Mind.'); return; }
  activeWorld = world; activePuzzle = index; dailyMode = daily; hinted = false;
  $('game-modal').classList.remove('hidden'); $('win-panel').classList.add('hidden'); $('puzzle-stage').classList.remove('hidden');
  $('feedback').textContent = ''; $('hint-btn').classList.remove('hint-used');
  renderPuzzle();
}
function renderPuzzle() {
  const p = puzzleFor(activeWorld, activePuzzle);
  $('level-chip').textContent = `${dailyMode ? 'DAILY CHALLENGE' : `WORLD 0${activeWorld + 1}`} · PUZZLE ${String(activePuzzle + 1).padStart(2,'0')}`;
  $('game-title').textContent = p.title; $('puzzle-instruction').textContent = p.instruction;
  $('level-progress').style.width = `${(activePuzzle + 1) / 20 * 100}%`;
  $('sequence').innerHTML = p.sequence.map((s, i) => `<span class="sequence-item" style="--i:${i}">${s}</span>`).join('');
  $('answer-grid').innerHTML = '';
  p.answers.forEach((answer, i) => {
    const button = document.createElement('button'); button.className = 'answer-btn'; button.textContent = answer; button.setAttribute('aria-label', `Answer ${i + 1}: ${answer}`);
    button.addEventListener('click', () => chooseAnswer(i, button)); $('answer-grid').appendChild(button);
  });
}
function chooseAnswer(choice: number, button: HTMLButtonElement) {
  const p = puzzleFor(activeWorld, activePuzzle);
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('.answer-btn')]; buttons.forEach(b => b.disabled = true);
  if (choice !== p.correct) {
    button.classList.add('wrong'); $('feedback').textContent = 'Not quite — take another look and try again.';
    window.setTimeout(() => { buttons.forEach(b => { b.disabled = false; b.classList.remove('wrong'); }); $('feedback').textContent = ''; }, 850);
    return;
  }
  button.classList.add('correct'); $('feedback').textContent = p.explain;
  const id = activeWorld * 20 + activePuzzle;
  if (!save.solved.includes(id)) { save.solved.push(id); save.xp += hinted ? 5 : 10; save.stars += hinted ? 1 : 2; persist(); }
  window.setTimeout(() => {
    $('puzzle-stage').classList.add('hidden'); $('win-panel').classList.remove('hidden');
    $('win-title').textContent = hinted ? 'Well done!' : 'Brilliant!'; $('win-copy').textContent = p.explain;
    $('win-stars').textContent = hinted ? '★☆☆' : '★★☆';
  }, 450);
}
function nextPuzzle() {
  if (dailyMode) { closeGame(); showToast('Daily challenge complete. Come back tomorrow for a new one!'); return; }
  if (activePuzzle >= 19) { closeGame(); showToast('World complete! More puzzles are coming soon.'); return; }
  openPuzzle(activeWorld, activePuzzle + 1, false);
}
function closeGame() { $('game-modal').classList.add('hidden'); }
function showPremium() { $('premium-modal').classList.remove('hidden'); }
function closePremium() { $('premium-modal').classList.add('hidden'); }

// Phaser adds a subtle animated starfield behind the DOM-based game UI.
class AmbientScene extends Phaser.Scene {
  private stars: Phaser.GameObjects.Arc[] = [];
  constructor() { super('ambient'); }
  create() {
    const { width, height } = this.scale;
    for (let i = 0; i < 34; i++) {
      const x = Phaser.Math.Between(0, width), y = Phaser.Math.Between(0, height);
      const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0x8e96ff, Phaser.Math.FloatBetween(0.15, 0.6));
      this.stars.push(star); this.tweens.add({ targets: star, alpha: Phaser.Math.FloatBetween(0.05, 0.45), duration: Phaser.Math.Between(900, 2600), yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 1600) });
    }
    this.scale.on('resize', () => this.scene.restart());
  }
}
const ambientRoot = document.createElement('div');
ambientRoot.id = 'ambient-canvas';
document.body.prepend(ambientRoot);
const game = new Phaser.Game({ type: Phaser.CANVAS, parent: ambientRoot, width: 420, height: 800, transparent: true, render: { antialias: true }, scene: [AmbientScene], scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH } });
// Keep the ambient renderer lightweight and behind the HTML interface.
game.canvas.style.width = '100%'; game.canvas.style.height = '100%'; game.canvas.style.pointerEvents = 'none';

$('play-btn').addEventListener('click', () => openPuzzle(0, Math.min(19, save.solved.filter(id => id < 20).length)));
$('daily-btn').addEventListener('click', () => openPuzzle(0, new Date().getDate() % puzzles.length, true));
$('daily-card-btn').addEventListener('click', () => openPuzzle(0, new Date().getDate() % puzzles.length, true));
document.querySelectorAll<HTMLButtonElement>('.world-card').forEach(card => card.addEventListener('click', () => { const world = Number(card.dataset.world); if (worldUnlocked(world)) openPuzzle(world, Math.min(19, save.solved.filter(id => Math.floor(id / 20) === world).length)); else showToast(world === 1 ? 'Earn 5 stars to unlock this world.' : 'Earn 15 stars to unlock this world.'); }));
$('close-game').addEventListener('click', closeGame); $('back-worlds').addEventListener('click', closeGame); $('next-puzzle').addEventListener('click', nextPuzzle);
$('hint-btn').addEventListener('click', () => { if (hinted) { showToast('You already used a hint for this puzzle.'); return; } if (save.xp < 10) { showToast('Not enough XP for a hint yet.'); return; } save.xp -= 10; persist(); hinted = true; $('feedback').textContent = `HINT: ${puzzleFor(activeWorld, activePuzzle).hint}`; $('hint-btn').classList.add('hint-used'); });
$('sound-toggle').addEventListener('click', () => { save.sound = !save.sound; persist(); $('sound-toggle').classList.toggle('muted', !save.sound); $('sound-toggle').textContent = save.sound ? '♫' : '♪̸'; showToast(save.sound ? 'Sound enabled' : 'Sound muted'); });
$('premium-link').addEventListener('click', showPremium); $('close-premium').addEventListener('click', closePremium);
$('notify-premium').addEventListener('click', () => { save.premiumInterest = true; persist(); $('premium-feedback').textContent = 'Thanks! Your interest is saved on this device.'; $('notify-premium').textContent = 'Interest saved ✓'; });
$('game-modal').addEventListener('click', e => { if (e.target === $('game-modal')) closeGame(); }); $('premium-modal').addEventListener('click', e => { if (e.target === $('premium-modal')) closePremium(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeGame(); closePremium(); } });
if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
renderStats();
