import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

let model, bluefairing, blackfairing;
let isAnimation = true;
let buttonGet, buttonMotor, buttonFrontWheel, buttonBackWheel, buttonPower, buttonOff;
let mouse = {};
let animationIndex = 0;
let isActivate;

const scene = new THREE.Scene();

let cameraDistance = window.innerWidth >= 1024 ? 50 : 70;
const camera = new THREE.PerspectiveCamera(cameraDistance, window.innerWidth / window.innerHeight, 0.25, 20);
camera.position.set(3.27, 0.31, 0.09);
camera.rotation.set(-1.29, 1.47, 1.29);

const listener = new THREE.AudioListener();

const audio = new THREE.Audio( listener );
camera.add(listener);

const loaderAudio = new THREE.AudioLoader();

let rayCast = new THREE.Raycaster();

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

//Render configurations
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0x000000, 0 );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;

let ambientArray = ['./img/posx.jpg', './img/negx.jpg', './img/posy.jpg', './img/negy.jpg', './img/posz.jpg', './img/negz.jpg'];
let ambientLoader = new THREE.CubeTextureLoader();
let cubeMap = ambientLoader.load(ambientArray);

const reflectionRendererTarget = new THREE.WebGLCubeRenderTarget(128, { 
    format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter 
});

const reflectionCamera = new THREE.CubeCamera(1, 1000, reflectionRendererTarget);
reflectionCamera.position.set(0, 0, 0);
scene.add(reflectionCamera);

// scene.background = new THREE.Color('white');
scene.environment = cubeMap;

document.querySelector('#scene').appendChild(renderer.domElement);

//Controlers
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 0;
controls.maxDistance = 10;
controls.target.set(0, 0, 0);
controls.enableDamping = true;

//click and move mouse
renderer.domElement.addEventListener('click', OnClickButton, true);
renderer.domElement.addEventListener('mousemove', OnMouseMove, true);
let backAnimationButton = document.getElementById('custom-back-button');

//Loader models
const loader = new GLTFLoader().setPath('./obj/');

loader.load('lander250.gltf', (gltf) => {
    model = gltf.scene;
    model.position.y = -0.1;
    scene.add(model);
});

loader.load('blueFairing.gltf', (gltf) => {
    bluefairing = gltf.scene;
    bluefairing.position.y = -0.1;
    scene.add(bluefairing);
});

loader.load('blackFairing.gltf', (gltf) => {
    blackfairing = gltf.scene;
    blackfairing.position.y = -0.1;
    scene.add(bluefairing);
});
//Loader Audio

function audioController(){
const file = './audio/mouseClick.mp3'; 
loaderAudio.load( file, function (buffer) {
   // audio.loop = true;
    audio.setBuffer(buffer);
    audio.play();
})
}
//Light
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.2);
scene.add(hemisphereLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 9.13);
scene.add(ambientLight);

const direcitonalLight = new THREE.DirectionalLight(0xffffff, 10, 10);
direcitonalLight.position.set(0, 2, 0);
scene.add(direcitonalLight);

const pointLightOne = new THREE.PointLight(0xffffff, 12, 10);
pointLightOne.position.set(1.75, 0.55, 0);
scene.add(pointLightOne);

const pointLightTwo = new THREE.PointLight(0xffffff, 12, 10);
pointLightTwo.position.set(-1.75, 0.55, 0);
scene.add(pointLightTwo);

const pointLightThree = new THREE.PointLight(0xffffff, 12, 10);
pointLightThree.position.set(0, 0.55, 1.75);
scene.add(pointLightThree);

const pointLightFour = new THREE.PointLight(0xffffff, 12, 10);
pointLightFour.position.set(0, 0.55, -1.75);
scene.add(pointLightFour);

function creteButton() {
    const map = new THREE.TextureLoader().load( './img/spriteButton.png');
    const material = new THREE.SpriteMaterial( { map: map } );

    const mapRed = new THREE.TextureLoader().load( './img/iconRed.png');
    const materialRed = new THREE.SpriteMaterial( { map: mapRed } );

    const mapGreen = new THREE.TextureLoader().load( './img/iconGreen.png');
    const materialGreen = new THREE.SpriteMaterial( { map: mapGreen } );

    //Button Get Motorcycle
    buttonGet = new THREE.Sprite(material);
    buttonGet.position.set(0, 0.35, 0.30);
    buttonGet.scale.set(0.10, 0.10);
    buttonGet.name = "buttonGet";

    //Button Motor
    buttonMotor  = new THREE.Sprite(material);
    buttonMotor.position.set(0.2, -0.2, -0.07);
    buttonMotor.scale.set(0.08, 0.08);
    buttonMotor.name = "buttonMotor";

    //Button front wheel
    buttonFrontWheel  = new THREE.Sprite(material);
    buttonFrontWheel.position.set(0.1, -0.1, -1);
    buttonFrontWheel.scale.set(0.08, 0.08);
    buttonFrontWheel.name = "buttonFrontWheel";

    //Button back wheel
    buttonBackWheel  = new THREE.Sprite(material);
    buttonBackWheel.position.set(0.09, -0.16, 0.96);
    buttonBackWheel.scale.set(0.08, 0.08);
    buttonBackWheel.name = "buttonBackWheel";

    //Button power motorcycle
    
    buttonPower  = new THREE.Sprite(materialRed);
    buttonPower.position.set(-0.01, 0.52, -0.30);
    buttonPower.scale.set(0.05, 0.05);
    buttonPower.name = "buttonPower";

    
    //Button off motorcycle
    
    buttonOff  = new THREE.Sprite(materialGreen);
    buttonOff.position.set(-0.01, 0.52, -0.30);
    buttonOff.scale.set(0.05, 0.05);
    buttonOff.name = "buttonOff";
    
    scene.add(buttonGet, buttonFrontWheel, buttonMotor, buttonBackWheel);
};

creteButton();

function OnClickButton() {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    rayCast.setFromCamera(mouse, camera);
    let intersects = rayCast.intersectObjects(scene.children);

    if(intersects.length > 0){
        intersects.forEach((i)=> {
        if(i.object.name == "buttonGet") {
            controls.enabled = false;
            animationIndex = 1;
            ButtonController();
            camAnimation(0, 0.92, 0, 2800, 0,1,0.8);  
        };

        if(i.object.name == "buttonMotor") {
            controls.enabled = false;
            animationIndex = 2;
            ButtonController();
            camAnimation(0.045, -0.11, -0.052, 2400, 0.75, -0.107, 0.02);
        };

        if(i.object.name == "buttonFrontWheel") {
            controls.enabled = false;
            animationIndex = 3;
            ButtonController();
            camAnimation(0.045, -0.182, -0.74, 2400, 0.838, 0.092, -0.735);
        };

        if(i.object.name == "buttonBackWheel") {
            controls.enabled = false;
            animationIndex = 4;
            ButtonController();
            camAnimation(-0.14, -0.16, 0.72, 2400, 0.91, 0.107, 0.81);
        };

        if(i.object.name == "buttonPower" || i.object.name == "buttonOff" ) {
            if(audio.isPlaying){   
                audio.stop();
                exitMotorcycleButton.style.display= "block";
                scene.remove(buttonOff);
                scene.add(buttonPower);

            } else {
                const file = './audio/motorAudio.mp3'; 
                loaderAudio.load( file, function (buffer) {
                // audio.loop = true;
                audio.setBuffer(buffer);
                audio.play();
                exitMotorcycleButton.style.display= "none";
                scene.add(buttonOff);
                scene.remove(buttonPower);

                })
            }
        };
        });
    };
};
function camAnimation(xTarget,yTarget,zTarget,tweenDuration, xCam, yCam, zCam){
    audioController();
    var xTarget, yTarget, zTarget, tweenDuration
    var camNewPosition = {x :xCam, y: yCam, z: zCam};
    var targetNewPos ={x :xTarget, y: yTarget, z: zTarget};


    TWEEN.removeAll();
    var camTween = new TWEEN.Tween(camera.position).to(camNewPosition, tweenDuration).easing(TWEEN.Easing.Quadratic.InOut).start();
    var targetTween = new TWEEN.Tween(controls.target).to(targetNewPos, tweenDuration).easing(TWEEN.Easing.Quadratic.InOut).start();

    targetTween.onComplete(function() {
      //  audio.stop();
        ButtonController();
        
        if(animationIndex != 1)controls.enabled = true;

        if(animationIndex == 1 ){
            isAnimation = false;
            scene.add(buttonPower);
            exitMotorcycleButton.style.display = 'flex';
            BackMainScene();
        }

        if(animationIndex >= 2 ){
            backAnimationButton.style.display= "block";
            CanvasDescription();
        }
        
        if(animationIndex == 0) {
            scene.add(buttonGet);
            isActivate = true;
            controls.enabled = true;
        }

        if(animationIndex ==0){
            controls.enableZoom = true;
        } else {
            controls.enableZoom = false;
        }
    });
};
function CanvasDescription() {

    let canvasDescriptionMotor = document.getElementById('custom-canvas-description-motor');
    let canvasDescriptionRoda = document.getElementById('custom-canvas-description-roda');

    if(animationIndex == 2)canvasDescriptionMotor.style.display = 'flex';
    if(animationIndex == 3)canvasDescriptionRoda.style.display = 'flex';
    if(animationIndex == 4)canvasDescriptionRoda.style.display = 'flex';
    
    backAnimationButton.addEventListener("click", function(){
        canvasDescriptionMotor.style.display = 'none';
        canvasDescriptionRoda.style.display = 'none';
        animationIndex = 0;
        camAnimation(0, 0, 0, 2800, 3.27, 0.31, 0.09);   
        controls.enabled = false;
        backAnimationButton.style.display = 'none';
        
    })
}

function BackMainScene() {
    exitMotorcycleButton.addEventListener("click", function(){
        isAnimation = true;
        animationIndex = 0;
        exitMotorcycleButton.style.display="none";
        camAnimation(0, 0, 0, 2800, 3.27, 0.31, 0.09);
        controls.enabled = false;
        scene.remove(buttonPower);
    })
}
function ButtonController() {
    if(animationIndex == 0){
    scene.add(buttonGet, buttonMotor, buttonFrontWheel, buttonBackWheel);
    } else {
        scene.remove(buttonGet, buttonMotor, buttonFrontWheel, buttonBackWheel);
    }
}

//Camera Rotation
function clickDown(e) {
    renderer.domElement.addEventListener('mousemove', clickMove);
}
function clickUp(e) {
    renderer.domElement.removeEventListener('mousemove', clickMove);
}
function clickMove(e) { 
let movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
let movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

camera.rotation.x -= movementY / 1600;
camera.rotation.y -= movementX / 2100;
}
function OnMouseMove() {
 
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // mouse.x = (event.clientX / 1280) * 2 - 1;
    // mouse.y = -(event.clientY / 720) * 2 + 1;

    rayCast.setFromCamera(mouse, camera);
    let intersects = rayCast.intersectObjects(scene.children);

    if(intersects.length > 0){
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    };
};

// RADIO BUTTONS
let blueSelected = document.getElementById('blue-selected');
let blueUnselected = document.getElementById('blue-unselected');

let blackSelected = document.getElementById('black-selected');
let blackUnselected = document.getElementById('black-unselected');

// BUTTONS SCENE ANIMATIONS

let exitMotorcycleButton = document.getElementById('custom-testdrive-button');

function selectVariantBlue() {
    scene.add(bluefairing);
    scene.remove(blackfairing);
    
    blueSelected.style.display = 'flex';
    blueUnselected.style.display = 'none';

    blackSelected.style.display = 'none';
    blackUnselected.style.display = 'flex';
}

function selectVariantBlack() {
    scene.remove(bluefairing);
    scene.add(blackfairing);

    blueSelected.style.display = 'none';
    blueUnselected.style.display = 'flex';

    blackSelected.style.display = 'flex';
    blackUnselected.style.display = 'none';
}

blueSelected.addEventListener('click', selectVariantBlue);
blueUnselected.addEventListener('click', selectVariantBlue);

blackSelected.addEventListener('click', selectVariantBlack);
blackUnselected.addEventListener('click', selectVariantBlack);
// END RADIO BUTTONS

const animate = function () {

    renderer.domElement.addEventListener('mousedown', clickDown);
    renderer.domElement.addEventListener('mouseup', clickUp);

    requestAnimationFrame(animate);
    TWEEN.update();
    if(isAnimation)controls.update();
    renderer.render(scene, camera);

    window.addEventListener('resize', () => {
        // if(screen.width > 1194) {
        //     camera.aspect = window.innerWidth * 0.75 /window.innerHeight;
        //     renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
        // } else {
        //     if(screen.width >= 1140 && screen.width <= 1193) {
        //         camera.aspect = window.innerWidth /window.innerHeight;
        //         renderer.setSize(window.innerWidth * 0.70, window.innerHeight * 0.70);
        //     } else {
        //         if(screen.width < 1139) {
        //             camera.aspect = window.innerWidth / window.innerHeight;
        //             renderer.setSize(window.innerWidth,window.innerHeight  * 0.70 );
        //         }
        //     }
        // }
        camera.updateProjectionMatrix();
    });

    //if(model) model.visible = false;
   // if(reflectionCamera && model) reflectionCamera.position.copy(model.position);
   // reflectionCamera.update(renderer, scene);
   // if(model) model.visible = true;
};
animate();
