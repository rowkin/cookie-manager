const canvas = document.getElementById('auroraCanvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const colors = [
  'rgba(0, 255, 255, 0.2)',
  'rgba(0, 128, 255, 0.2)',
  'rgba(128, 0, 255, 0.2)',
  'rgba(255, 0, 128, 0.2)'
];

const auroraLines = Array(10).fill().map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  width: Math.random() * 200 + 100,
  height: Math.random() * 30 + 20,
  speed: Math.random() * 0.5 + 0.2,
  color: colors[Math.floor(Math.random() * colors.length)]
}));

function drawAurora() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  auroraLines.forEach((line) => {
    const gradient = ctx.createLinearGradient(line.x, line.y, line.x + line.width, line.y + line.height);
    gradient.addColorStop(0, line.color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(line.x, line.y, line.width, line.height);

    // Update position
    line.x += line.speed;
    if (line.x - line.width > canvas.width) {
      line.x = -line.width;
      line.y = Math.random() * canvas.height;
      line.width = Math.random() * 200 + 100;
      line.height = Math.random() * 30 + 20;
      line.speed = Math.random() * 0.5 + 0.2;
      line.color = colors[Math.floor(Math.random() * colors.length)];
    }
  });

  requestAnimationFrame(drawAurora);
}

drawAurora();

// Resize canvas on window resize
window.addEventListener('resize', () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});