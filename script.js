let timer;
let startTime;
let elapsedTime = 0;
let running = false;

const display = document.getElementById('display');
const laps = document.getElementById('laps');
const stopwatchHand = document.querySelector('.stopwatch-hand');
const svgHand = document.getElementById('svg-hand');
const ticksGroup = document.getElementById('ticks');
const numbersGroup = document.getElementById('numbers');

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const milliseconds = String(ms % 1000).padStart(3, '0').slice(0, 2);
  return `${minutes}:${seconds}:${milliseconds}`;
}

function drawStopwatchFace() {
  // Clear previous
  ticksGroup.innerHTML = '';
  numbersGroup.innerHTML = '';
  // Draw 60 tick marks
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * 2 * Math.PI;
    const inner = i % 5 === 0 ? 72 : 77;
    const outer = 85;
    const x1 = 100 + inner * Math.sin(angle);
    const y1 = 100 - inner * Math.cos(angle);
    const x2 = 100 + outer * Math.sin(angle);
    const y2 = 100 - outer * Math.cos(angle);
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', x1);
    tick.setAttribute('y1', y1);
    tick.setAttribute('x2', x2);
    tick.setAttribute('y2', y2);
    tick.setAttribute('stroke', i % 5 === 0 ? '#fff' : '#bbb');
    tick.setAttribute('stroke-width', i % 5 === 0 ? 3 : 1);
    ticksGroup.appendChild(tick);
    // Draw numbers for every 5th tick
    if (i % 5 === 0) {
      let num = i === 0 ? '00' : String(i).padStart(2, '0');
      const numAngle = (i / 60) * 2 * Math.PI;
      const nx = 100 + 62 * Math.sin(numAngle);
      const ny = 100 - 62 * Math.cos(numAngle) + 5;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', nx);
      text.setAttribute('y', ny);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '15');
      text.setAttribute('font-family', 'monospace');
      text.setAttribute('fill', '#fff');
      text.textContent = num;
      numbersGroup.appendChild(text);
    }
  }
}
drawStopwatchFace();

function updateDisplay() {
  const now = Date.now();
  const diff = now - startTime + elapsedTime;
  display.textContent = formatTime(diff);
  // Update SVG hand rotation
  const seconds = (diff / 1000) % 60;
  const rotation = (seconds / 60) * 360;
  svgHand.setAttribute('transform', `rotate(${rotation} 100 100)`);
}

function start() {
  if (!running) {
    startTime = Date.now();
    timer = setInterval(updateDisplay, 100);
    running = true;
  }
}

function pause() {
  if (running) {
    clearInterval(timer);
    elapsedTime += Date.now() - startTime;
    running = false;
  }
}

function reset() {
  clearInterval(timer);
  elapsedTime = 0;
  running = false;
  display.textContent = '00:00:00';
  laps.innerHTML = '';
  svgHand.setAttribute('transform', 'rotate(0 100 100)');
}

function lap() {
  if (running) {
    const now = Date.now();
    const lapTime = now - startTime + elapsedTime;
    const li = document.createElement('li');
    li.textContent = formatTime(lapTime);
    laps.appendChild(li);
  }
}
