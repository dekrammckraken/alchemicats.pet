document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("tv"); // Get the canvas element
    const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
  
    function createStar(name, options, scene) {
        var star = BABYLON.MeshBuilder.CreateSphere(name, options, scene);
        return star;
    }
  
      
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
  
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
  
        var stars = [];
        for (var i = 0; i < 400; i++) {
            var star = createStar("star" + i, { diameter: Math.random() * 3.5 + 0.1 }, scene);
            star.position.x = Math.random() * 2000 - 1000;
            star.position.y = Math.random() * 2000 - 1000;
            star.position.z = Math.random() * 2000 - 1000;
  
            // Set custom colors for stars
            var material = new BABYLON.StandardMaterial("starMaterial", scene);
            if (Math.random() > 0.5) {
                material.emissiveColor = new BABYLON.Color3.FromHexString("#caf812");
            } else {
                material.emissiveColor = new BABYLON.Color3.FromHexString("#d97bc0");
            }
            //material.disableLighting = true;
            star.material = material;
  
            stars.push(star);
        }
  
            
  
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -20), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
  
        // Animazione per stelle che si avvicinano alla telecamera
        scene.registerBeforeRender(function () {
            for (var i = 0; i < stars.length; i++) {
                // Muovi le stelle verso la telecamera
                stars[i].position.z += 0.6;
            }
            
        });
  
        return scene;
    };
  
    const scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
});
