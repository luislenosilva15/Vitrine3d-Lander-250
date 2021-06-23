import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

let model;
let buttonGet, isAnimation;
let onMotorcycle = false
let mouse = {};

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;

const scene = new THREE.Scene();
let rayCast = new THREE.Raycaster();

let cameraDistance = window.innerWidth >= 1024 ? 50 : 70;

const camera = new THREE.PerspectiveCamera(cameraDistance, window.innerWidth * 0.75 / window.innerHeight, 0.25, 20);
camera.position.set(3.27, 0.31, 0.09);
camera.rotation.set(-1.29, 1.47, 1.29);

let ambientArray = ['./img/posx.jpg', './img/negx.jpg', './img/posy.jpg', './img/negy.jpg', './img/posz.jpg', './img/negz.jpg'];
let ambientLoader = new THREE.CubeTextureLoader();
let cubeMap = ambientLoader.load(ambientArray);

const reflectionRendererTarget = new THREE.WebGLCubeRenderTarget(128, { 
    format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter 
});

const reflectionCamera = new THREE.CubeCamera(1, 1000, reflectionRendererTarget);
reflectionCamera.position.set(0, 0, 0);
scene.add(reflectionCamera);

scene.background = new THREE.Color('white');
scene.environment = cubeMap;

const loader = new GLTFLoader().setPath('./obj/');

loader.load('lander250.gltf', (gltf) => {
    model = gltf.scene;

    model.position.y = -0.1;
    scene.add(model);
});

document.querySelector('#scene').appendChild(renderer.domElement);

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

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 10;
controls.target.set(0, 0, 0);
controls.enableDamping = true;

function CreateButtonGetMotorcycle() {
    const map = new THREE.TextureLoader().load("../img/buttonGetMotorcycle.png");
    const material = new THREE.SpriteMaterial( { map: map } );
    const sprite = new THREE.Sprite( material );
    sprite.position.set(0, 0.35, 0.30);
    sprite.scale.set(0.15, 0.15, 1);
    
    let cGeo = new THREE.BoxGeometry(1,1,1);
    let cMat = new THREE.MeshBasicMaterial({ wireframe: false, opacity: 0, transparent: true });
    let cMesh = new THREE.Mesh(cGeo, cMat);
    cMesh.position.set(0, 0.35, 0.30);
    cMesh.scale.set(0.2, 0.3, 0.3);

    cMesh.name = "buttonGetMotorcycle";
    buttonGet = sprite, cMesh;
    scene.add(cMesh, sprite);
}
CreateButtonGetMotorcycle();

function ButtonGetMotorcycle() {
    addEventListener("pointerdown", (e)=> {
        rayCast.setFromCamera(mouse, camera);
        mouse.x = (e.clientX/window.innerWidth * 0.75) * 2-1;
        mouse.y = (e.clientY/window.innerHeight) * -2+1;

        let items = rayCast.intersectObjects(scene.children);
    
        items.forEach((i)=> {
            if (i.object.name == "buttonGetMotorcycle") {
                scene.remove(buttonGet);
                isAnimation = true;
                camAnimation(0, 1, 0.8, 2500);  
            }
        });
    });
}
ButtonGetMotorcycle();

function motorcycleCameraController () {
	camera.rotation.order = "YXZ";

	addEventListener('mousemove', function(evt){
        let movementX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || 0;
        let movementY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || 0;

        if(!onMotorcycle) { 
            movementX = 0; movementY = 0;
        }
    
        camera.rotation.x -= movementY / window.innerHeight;
        camera.rotation.y -= movementX / window.innerWidth * 0.75;
    }, false);
}

function camAnimation(xTarget,yTarget,zTarget,tweenDuration){
    var xTarget, yTarget, zTarget, tweenDuration
    var camNewPosition = { x : xTarget, y : yTarget, z : zTarget};
    var targetNewPos = {x : xTarget, y : yTarget, z : 0};

    if(!isAnimation) {
        camNewPosition = { x :0, y : 0, z : 0};
        targetNewPos = {x : 0, y : 0, z : 0};
    }

    TWEEN.removeAll();
    controls.enabled = false;

    var camTween = new TWEEN.Tween(camera.position).to(camNewPosition, tweenDuration).easing(TWEEN.Easing.Quadratic.InOut).start();
    var targetTween = new TWEEN.Tween(controls.target).to(targetNewPos, tweenDuration).easing(TWEEN.Easing.Quadratic.InOut).start();
    
    onMotorcycle = false;  

    targetTween.onComplete(function() {
        if(isAnimation) {
            onMotorcycle = true;

            if(onMotorcycle) controls.enabled = false;
            motorcycleCameraController();
            // buttonUi.style.display="block";
        } else {
            motorcycleCameraController(); 
            scene.add(buttonGet);
        }
    })
}

// RADIO BUTTONS
let blueSelected = document.getElementById('blue-selected');
let blueUnselected = document.getElementById('blue-unselected');

let blackSelected = document.getElementById('black-selected');
let blackUnselected = document.getElementById('black-unselected');

function selectVariantBlue() {
    blueSelected.style.display = 'flex';
    blueUnselected.style.display = 'none';

    blackSelected.style.display = 'none';
    blackUnselected.style.display = 'flex';
}

function selectVariantBlack() {
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


renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);

    if(model) model.visible = false;
    if(reflectionCamera && model) reflectionCamera.position.copy(model.position);
    reflectionCamera.update(renderer, scene);
    if(model) model.visible = true;
    if(!onMotorcycle) controls.update();
    TWEEN.update();

    window.addEventListener('resize', () => {
        if(screen.width > 1194) {
            camera.aspect = window.innerWidth * 0.75 /window.innerHeight;
            renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
        } else {
            if(screen.width >= 1140 && screen.width <= 1194) {
                camera.aspect = window.innerWidth/window.innerHeight;
                renderer.setSize(window.innerWidth * 0.70, window.innerHeight * 0.70);
            } else {
                if(screen.width < 1090) {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    renderer.setSize(window.innerWidth  * 0.70, window.innerHeight  * 0.70 );
                }
            }
        }
        camera.updateProjectionMatrix();
    });
});