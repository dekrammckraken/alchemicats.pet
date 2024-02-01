document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("tv"); // Get the canvas element
    const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
  

    function createStar(name, options, scene) {
        var star = BABYLON.MeshBuilder.CreateSphere(name, options, scene);
        return star;
    }
    
    function createStars(scene) {
        var stars = [];
        for (var i = 0; i < 800; i++) {
            var star = createStar("star" + i, { diameter: Math.random() * 1.5 + 0.1 }, scene);
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
        return stars;
    }
    
    function updateStage(ambience) {
        updateStars(ambience.stars);
        updateIntro(ambience.intro);
    }
    var updateStars = function (stars) {
        if (!shouldStopStars(stars)) {
            for (var i = 0; i < stars.length; i++) {
                stars[i].position.z += 3; //Deep in the Z
            }
        }
    }
    
    function shouldStopStars(stars) {
        return stars.every(function (star) {
            return star.position.z >= 1000;
        });
    
    }
    function createIntro(scene) {
        // Creazione della scritta 3D con MeshBuilder
        var font_size = 14;
    
        // Crea la texture dinamica
        var dynamicTexture = new BABYLON.DynamicTexture("dynamicTexture", 2048, scene);
        dynamicTexture.hasAlpha = true;
    
        // Crea il materiale e assegna la texture
        var material = new BABYLON.StandardMaterial("textMaterial", scene);
        material.emissiveColor = new BABYLON.Color3(1, 1, 1)
        material.diffuseTexture = dynamicTexture;
    
        // Usa MeshBuilder per creare un piano
        var textPlane = BABYLON.MeshBuilder.CreatePlane("textPlane", { size: font_size }, scene);
        textPlane.material = material;
        textPlane.position.z = -10;
        //textPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    
        // Restituisci la texture dinamica se necessario
        return {
            texture: dynamicTexture,
            plane: textPlane
        };
    }
    function updateIntro(intro) {
        var text = "Welcome to our space, alchemicats";
        var font_size = 74;
        intro.texture.drawText(text, null, null, " " + font_size + "px Arial", "white");
        intro.texture.updateSamplingMode(BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
    
        if (intro.plane.position.z < 1) {
            intro.plane.position.z += 0.03;
        }
    }
    function loadModels() {
    

        BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon").then(function (result) {
            // Le mesh sono state importate con successo
            // result.meshes contiene l'array di mesh importate
    
            // Aggiungi le mesh alla scena
            for (var i = 0; i < result.meshes.length; i++) {
                scene.addMesh(result.meshes[i]);
            }
    
            // Posiziona, scala o ruota le mesh a tuo piacimento
            result.meshes[0].position = new BABYLON.Vector3(0, 0, 0);
            result.meshes[0].scaling = new BABYLON.Vector3(2, 2, 2); // Aggiungi scaling se necessario
        });
    }

   
    function createStage() {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -20), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        var stars = createStars(scene)
        var intro = createIntro(scene);
        return {
            scene: scene,
            camera: camera,
            stars: stars,
            intro: intro
        };
    }
    
    
    
    var createScene = function () {
    
        var stage = createStage();
    
        stage.scene.registerBeforeRender(function () {
            updateStage(stage);
        });
    
        return stage.scene;
    };
    
    
    
  
    const scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
});
