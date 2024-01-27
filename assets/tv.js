document.addEventListener('DOMContentLoaded', function () {

  const canvas = document.getElementById('tv');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000); // Colore di sfondo del canvas
  renderer.antialias = true;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Create star field
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float size;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;

      void main() {
        vec3 color = vec3(1.0, 1.0, 1.0);
        float radius = 0.05;
        float distance = length(vUv - vec2(0.5, 0.5));
        float blur = smoothstep(radius, radius + 1.32, distance);

        gl_FragColor = vec4(color, blur);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
  });

  const starsVertices = [];
  const starsSizes = [];
  const starsCount = 3000;

  for (let i = 0; i < starsCount; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    const size = Math.random() * 1;

    starsVertices.push(x, y, z);
    starsSizes.push(size);
  }

  starsGeometry.addAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  starsGeometry.addAttribute('size', new THREE.Float32BufferAttribute(starsSizes, 1));

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // Create nebula field
  const nebulaGeometry = new THREE.BufferGeometry();
  const nebulaMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float size;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
    uniform float time;
    varying vec2 vUv;
  
    void main() {
      vec3 colorPink = vec3(0.878, 0.6, 0.804); // Colore rosa
      vec3 colorGreen = vec3(0.788, 0.953, 0.125); // Colore verde acceso
      float radius = 0.1;
      float distance = length(vUv - vec2(0.5, 0.5));
      float blur = smoothstep(radius, radius + 0.2, distance);
  
      // Probabilità casuale di essere rosa o verde
      float randomValue = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
      vec3 finalColor;
  
      if (randomValue < 0.5) {
        // Rosa con probabilità del 50%
        finalColor = colorPink;
      } else {
        // Verde con probabilità del 50%
        finalColor = colorGreen;
      }
  
      gl_FragColor = vec4(finalColor, blur);
    }
  `,
  
  
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
  });

  const nebulaVertices = [];
  const nebulaSizes = [];
  const nebulaCount = 500;

  for (let i = 0; i < nebulaCount; i++) {
    const x = (Math.random() - 0.5) * 1000;  // Ridotto l'intervallo di posizione per le nebulose
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    const size = Math.random() * 2;

    nebulaVertices.push(x, y, z);
    nebulaSizes.push(size);
  }

  nebulaGeometry.addAttribute('position', new THREE.Float32BufferAttribute(nebulaVertices, 3));
  nebulaGeometry.addAttribute('size', new THREE.Float32BufferAttribute(nebulaSizes, 1));

  const nebulas = new THREE.Points(nebulaGeometry, nebulaMaterial);
  scene.add(nebulas);

  // Handle window resize
  window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    //renderer.setSize(newWidth, newHeight);
  });

  // Scrolling animation
  function animate() {
    requestAnimationFrame(animate);

    // Scroll stars along the z-axis
    const scrollSpeed = 10;
    starsGeometry.attributes.position.array.forEach((value, index) => {
      starsGeometry.attributes.position.array[index] += index % 3 === 2 ? scrollSpeed : 0;

      // Reset star position if it goes too far
      if (index % 3 === 2 && starsGeometry.attributes.position.array[index] > 1000) {
        starsGeometry.attributes.position.array[index] = -1000;
      }
    });

    // Scroll nebulas along the z-axis
    nebulaGeometry.attributes.position.array.forEach((value, index) => {
      nebulaGeometry.attributes.position.array[index] += index % 3 === 2 ? scrollSpeed / 2 : 0;

      // Reset nebula position if it goes too far
      if (index % 3 === 2 && nebulaGeometry.attributes.position.array[index] > 1000) {
        nebulaGeometry.attributes.position.array[index] = -1000;
      }
    });

    starsGeometry.attributes.position.needsUpdate = true;
    nebulaGeometry.attributes.position.needsUpdate = true;

    // Update time uniform for the fragment shaders
    starsMaterial.uniforms = { time: { value: 0 } };
    nebulaMaterial.uniforms = { time: { value: 0 } };

    renderer.render(scene, camera);
  }

 
  
  function addImage() {
    // Create a plane with an image texture
    const imageTexture = new THREE.TextureLoader().load('public/gallery/1.png');
    const planeGeometry = new THREE.PlaneGeometry(8, 6);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: imageTexture, transparent: true });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
  }

  animate();
 
});