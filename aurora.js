const canvas = document.getElementById('auroraCanvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// 球体类
class Ball {
  constructor() {
    this.reset();
  }

  // 初始化球体属性
  reset() {
    // 位置
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    // 大小 (最大20px)
    this.size = Math.random() * 10 + 5; // 5-15的随机大小
    // 速度
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    // 颜色
    this.hue = Math.random() * 360;
    this.saturation = Math.random() * 30 + 70; // 70-100%
    this.lightness = Math.random() * 30 + 60;  // 60-90%
    // 降低透明度
    this.alpha = Math.random() * 0.15 + 0.05; // 0.05-0.2
    // 光晕大小
    this.glowSize = this.size * 1.5;
  }

  // 更新球体位置
  update() {
    // 更新位置
    this.x += this.vx;
    this.y += this.vy;

    // 碰撞检测和反弹
    if (this.x < this.size) {
      this.x = this.size;
      this.vx *= -1;
    }
    if (this.x > canvas.width - this.size) {
      this.x = canvas.width - this.size;
      this.vx *= -1;
    }
    if (this.y < this.size) {
      this.y = this.size;
      this.vy *= -1;
    }
    if (this.y > canvas.height - this.size) {
      this.y = canvas.height - this.size;
      this.vy *= -1;
    }

    // 缓慢改变颜色
    this.hue += 0.1; // 降低颜色变化速度
    if (this.hue >= 360) this.hue = 0;
  }

  // 绘制球体
  draw() {
    ctx.save();
    
    // 创建径向渐变
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.glowSize
    );

    // 球体的基础颜色
    const baseColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%`;
    
    // 添加渐变色停点，降低整体透明度
    gradient.addColorStop(0, `${baseColor}, ${this.alpha})`);
    gradient.addColorStop(0.4, `${baseColor}, ${this.alpha * 0.4})`);
    gradient.addColorStop(1, `${baseColor}, 0)`);

    // 绘制发光效果
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
    ctx.fill();

    // 绘制球体主体，降低主体透明度
    ctx.fillStyle = `${baseColor}, ${this.alpha * 1.2})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// 创建球体数组
const balls = Array(25).fill().map(() => new Ball());

// 动画循环
function animate() {
  // 完全清除画布，使背景透明
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 更新和绘制所有球体
  balls.forEach(ball => {
    ball.update();
    ball.draw();
  });

  requestAnimationFrame(animate);
}

// 窗口大小改变时重置画布尺寸
window.addEventListener('resize', () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

// 开始动画
animate();