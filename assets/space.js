document.addEventListener("DOMContentLoaded", async function () {
  const canvas = document.getElementById('space');
  const ctx = canvas.getContext('2d');


  async function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const res = await createResource();
    res.stars = createStars();
    return res;
  }

  function drawText(text, point, fontSize) {
    ctx.font = `${fontSize}px Roboto bold`;
    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
    ctx.fillText(text, point.x, point.y);
  }

  function centeredRescale(w, h) {
    let factor = Math.min(innerWidth / (w * 2), innerHeight / (h * 2));
    const nw = w * factor;
    const nh = h * factor;
    return {
      w: nw,
      h: nh,
      x: (innerWidth - nw) / 2,
      y: (innerHeight -nh) / 2
    };
  }
  function drawLogo(scene) {

    let logo_scaled = centeredRescale(scene.logo.width, scene.logo.height);
    let logo_text_scaled = centeredRescale(scene.logo_text.width, scene.logo_text.height);
    ctx.globalAlpha = 0.7;
    ctx.drawImage(scene.logo, 
      logo_scaled.x, 
      logo_scaled.y -120, 
      logo_scaled.w, 
      logo_scaled.h);
    ctx.drawImage(scene.logo_text,
       logo_text_scaled.x, 
       (logo_scaled.y + logo_scaled.h)-120 , 
       logo_text_scaled.w, 
       logo_text_scaled.h);
    ctx.globalAlpha = 1;
  }

  function createText() {
    return {
      welcome: "Coming soon..."
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
    /*
    if (scene.textResources) {
      
      const textWidth = ctx.measureText(scene.textResources.welcome).width;
      drawText(scene.textResources.welcome, 
        { x: canvas.width / 2 - textWidth / 2, 
        y: canvas.height -200}, 40 * (window.innerHeight / 1000));
    }*/

   // drawLogo(scene, 0);

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
    for (let i = 0; i < 200; i++) {
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
