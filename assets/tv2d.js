document.addEventListener("DOMContentLoaded", async function () {
  const canvas = document.getElementById('tv');
  const ctx = canvas.getContext('2d');
  

  async function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const res  = await createResource();
    res.stars = createStars();
    return res;
  }

  function drawText(text, point, fontSize) {
    ctx.font = `${fontSize}px Roboto bold`;
    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
    ctx.fillText(text, point.x, point.y);
  }

  function drawLogo(img, yOff) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const originalWidth = img.width;
    const originalHeight = img.height;
    const scaleFactor = Math.min(viewportWidth / (originalWidth * 2), viewportHeight / (originalHeight * 2));
    const newWidth = originalWidth * scaleFactor;
    const newHeight = originalHeight * scaleFactor;
    const x = (viewportWidth - newWidth) / 2;
    const y = (viewportHeight - newHeight) / 2 + yOff;

    ctx.globalAlpha = 0.5;
    ctx.drawImage(img, x, y, newWidth, newHeight);
    ctx.globalAlpha = 1;
  }

  function createText() {
    return {
      welcome: "Space with marshmallows"
    };
  }

  function getRandomStarColor() {
    const colors = [
      { r: 202, g: 248, b: 19 },
      { r: 216, g: 121, b: 191 },
      { r: 255, g: 255, b: 255 }
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  function drawStars(stars) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const star of stars) {
      ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.brightness})`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'white';
      ctx.fillRect(star.x, star.y, star.size, star.size);
      ctx.shadowBlur = 3;
    }
  }

  function updateStars(stars) {
    for (const star of stars) {
      star.x += Math.cos(star.direction) * star.speed;
      star.y += Math.sin(star.direction) * star.speed;
      if (star.x > canvas.width) star.x = 0;
      if (star.x < 0) star.x = canvas.width;
      if (star.y > canvas.height) star.y = 0;
      if (star.y < 0) star.y = canvas.height;
    }
  }

  function update(scene) {
    updateStars(scene.stars);
  }

  function render(scene) {
    drawStars(scene.stars);
    if (scene.textResources) {
      
      const textWidth = ctx.measureText(scene.textResources.welcome).width;
      drawText(scene.textResources.welcome, 
        { x: canvas.width / 2 - textWidth / 2, 
        y: canvas.height -200}, 40 * (window.innerHeight / 1000));
    }
    drawLogo(scene.logo, 0);
  }

  async function createResource() {
    const logo = new Image();
    logo.src = "./assets/images/alchemicats.png";
    logo.isLoaded = await loadImage(logo);

    const logo_text = new Image();
    logo_text.src = "./assets/images/alchemicats-text.png";
    logo_text.isLoaded = await loadImage(logo_text);

    return {
      logo: logo,
      logo_text: logo_text,
      textResources: createText()
    };
  }

  async function loadImage(img) {
    return new Promise((resolve) => {
      img.onload = () => resolve(true);
    });
  }

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createStars() {
    const stars = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: getRandomNumber(0, canvas.width),
        y: getRandomNumber(0, canvas.height),
        size: getRandomNumber(1, 3),
        brightness: getRandomNumber(0.5, 1),
        speed: getRandomNumber(0, 0.99),
        direction: getRandomNumber(0, Math.PI * 2),
        color: getRandomStarColor()
      });
    }
    return stars;
  }

  function animate(scene) {
    update(scene);
    render(scene);
    requestAnimationFrame(() => animate(scene));
  }

  window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let scene = await init();
  animate(scene);
});
