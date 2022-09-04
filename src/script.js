// https://github.com/danielblagy/three_mmi

import './style.css'
import * as THREE from 'three'

import * as THREEx from 'threex.domevents'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { DoubleSide, Group } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { EventDispatcher } from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { Font1 } from 'three/examples/fonts/helvetiker_regular.typeface.json'


const canvas = document.querySelector('.webgl')

const scene = new THREE.Scene()

// Animate (This is needed to controls to work)
const clock = new THREE.Clock()
const elapsedTime = clock.getElapsedTime()

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    //Update Sizes
    sizes.width = window.innerWidth,
    sizes.height = window.innerHeight

    // Update Camera
    camera.aspect = sizes.width / sizes.height

    // Update Projections
    camera.updateProjectionMatrix()

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height)

    // Pixel Ratio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Caps the pixel ratio at 2
})

// Double Click for Full Screen Switch
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) 
    {
        canvas.requestFullscreen()
    }
        else 
    {
        document.exitFullscreen()
    }
})
// Lights

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set(10,50,10)

    // Shadows
    light.castShadow = true
    light.shadow.mapSize.width = 500; // default
    light.shadow.mapSize.height = 500; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default

    light.shadow.camera.top = 50
    light.shadow.camera.right = 50
    light.shadow.camera.bottom = -50
    light.shadow.camera.left = -50
    

const sunsetLight = new THREE.DirectionalLight ( 0xff5566, 1)
sunsetLight.position.set(-10, 3, 0)
sunsetLight.castShadow = false

scene.add( light, sunsetLight );
// scene.add(new THREE.AmbientLight(0xffffff,0.3))

const helper = new THREE.CameraHelper(light.shadow.camera)
scene.add(helper)


// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000)
camera.position.set(0,10,20)
scene.add(camera)



// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.setSize(sizes.width, sizes.height)
scene.background = new THREE.Color(0x87ceeb) 
renderer.render(scene, camera)


// Textures
const GroundTexture = new THREE.TextureLoader().load( '/ForestGround/forrest_ground_01_diff_4k.jpg' )
GroundTexture.wrapS = THREE.RepeatWrapping
GroundTexture.wrapT = THREE.RepeatWrapping
GroundTexture.repeat.set(50, 50)

const TreeTexture = new THREE.TextureLoader().load('/rotting-wood-texture.jpg')
TreeTexture.wrapT = TreeTexture.wrapS = THREE.RepeatWrapping
TreeTexture.repeat.set(4, 10)

// Materials
const CloudMaterial = new THREE.MeshPhongMaterial({ 
    color: 'white', 
    /*flatShading: true,*/
     opacity: .5,
     transparent: true,
})



const GroundMaterial = new THREE.MeshLambertMaterial({color: '#567D46', side: THREE.DoubleSide })
const TreeMaterial = new THREE.MeshLambertMaterial({map: TreeTexture})
const TreeTopMaterial = new THREE.MeshPhongMaterial({ color: 'green', flatShading: true})

//

const sphereGeometry = new THREE.SphereGeometry()
const sphere = new THREE.Mesh(sphereGeometry, CloudMaterial)
sphere.position.y = 5
sphere.castShadow = true;
scene.add(sphere)
sphere.name = 'sphere'

const sphere2 = new THREE.Mesh(sphereGeometry, CloudMaterial)
sphere2.position.y = 8
sphere2.castShadow = true;
scene.add(sphere2)
sphere2.name = 'sphere2'


// Font Loader
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Mitchell Stowman',
            {
                font: font,
                size: 3,
                height: .5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 1,
            }
        )
        const textMaterial = new THREE.MeshBasicMaterial()
        const text = new THREE.Mesh(textGeometry, textMaterial)

        textGeometry.center()
        text.position.y = 2
        text.position.z = -7

        scene.add(text)
    }
)


/* Clouds (From Scratch using Groups)

const tuft1geometry = new THREE.TetrahedronBufferGeometry(1.7, 6)
tuft1geometry.translate(-2,0,0)
const tuft1 = new THREE.Mesh(tuft1geometry, CloudMaterial)

const tuft2geometry = new THREE.TetrahedronBufferGeometry(1.3, 8)
tuft2geometry.translate(2,0,0)
const tuft2 = new THREE.Mesh(tuft2geometry, CloudMaterial)

const tuft3geometry = new THREE.TetrahedronBufferGeometry(2, 6)
tuft3geometry.translate(0,0,0)
const tuft3 = new THREE.Mesh(tuft3geometry, CloudMaterial)

const tuft4geometry = new THREE.TetrahedronBufferGeometry(.7, 2)
tuft4geometry.translate(-1, 0, 1.7)
const tuft4 = new THREE.Mesh(tuft4geometry, CloudMaterial)


const cloud = new Group()
cloud.position.y = 10;
cloud.add(tuft1, tuft2, tuft3, tuft4,);

const cloud2 = cloud.clone()
cloud2.position.x = 2;
cloud2.position.y = 13;
cloud2.position.z = -1;
cloud2.scale.set(.3, .3, .3)

const cloudCluster = new Group()
cloudCluster.add(cloud, cloud2)
scene.add(cloudCluster)

*/

/* Randomized Tree Population

for (let i = 0; i < 1000; i++) {

    const treeGeometry = new THREE.CylinderGeometry(.2,.3,2.5,25)
    const treeMesh = new THREE.Mesh(treeGeometry, TreeMaterial)

    const treeTopGeometry1 = new THREE.ConeGeometry(1,2.5,25)
    const treeTopMesh = new THREE.Mesh(treeTopGeometry1, TreeTopMaterial)
    treeTopMesh.position.y = 2.5

    const treeTopGeometry2 = new THREE.ConeGeometry(.8,2,25)
    const treeTopMesh2 = new THREE.Mesh(treeTopGeometry2, TreeTopMaterial)
    treeTopMesh2.position.y = 3.2

    const tree = new Group()
    tree.add(treeMesh, treeTopMesh, treeTopMesh2)

    tree.position.x = (Math.random() - 0.5) * 50
    tree.position.z = (Math.random() - 0.5) * 50

    const scaleNum = Math.random()
    tree.scale.x = scaleNum
    tree.scale.y = scaleNum
    tree.scale.z = scaleNum

    scene.add(tree)
}
*/

// GLTF Loader

    // Tree Spawn Far

const gltfLoader = new GLTFLoader();

for (let i=0; i<1000; i++) {

gltfLoader.load('/tree.glb', (gltfScene) => {

        gltfScene.scene.scale.set(.2,.3,.2) 

        gltfScene.scene.position.x = (Math.random() -.5) * 300;			    
        gltfScene.scene.position.y = 0;	
        gltfScene.scene.position.z = (Math.random() -.5) * 100 + -100;

        gltfScene.scene.rotateY(Math.PI / 2 * (Math.random() *2))

        scene.add(gltfScene.scene)
    })
}

        // Tree Spawn Close

        for (let i=0; i<1000; i++) {

            gltfLoader.load('/tree.glb', (gltfScene) => {
            
                    gltfScene.scene.scale.set(.2,.3,.2) 
            
                    gltfScene.scene.position.x = (Math.random() -.5) * 300;			    
                    gltfScene.scene.position.y = 0;	
                    gltfScene.scene.position.z = (Math.random() -.5) * 100 + 100;
            
                    gltfScene.scene.rotateY(Math.PI / 2 * (Math.random() *2))
            
                    scene.add(gltfScene.scene)
                })
            }

            // Tree Spawn Left

            for (let i=0; i<300; i++) {

                gltfLoader.load('/tree.glb', (gltfScene) => {
                
                        gltfScene.scene.scale.set(.2,.3,.2) 
                
                        gltfScene.scene.position.x = (Math.random() -.5) * 120 - 80;			    
                        gltfScene.scene.position.y = 0;	
                        gltfScene.scene.position.z = (Math.random() -.5) * 100;
                
                        gltfScene.scene.rotateY(Math.PI / 2 * (Math.random() *2))
                
                        scene.add(gltfScene.scene)
                    })
                }

            // Tree Spawn Right

            for (let i=0; i<300; i++) {

                gltfLoader.load('/tree.glb', (gltfScene) => {
                
                        gltfScene.scene.scale.set(.2,.3,.2) 
                
                        gltfScene.scene.position.x = (Math.random() -.5) * 120 + 80;			    
                        gltfScene.scene.position.y = 0;	
                        gltfScene.scene.position.z = (Math.random() -.5) * 100;
                
                        gltfScene.scene.rotateY(Math.PI / 2 * (Math.random() *2))
                
                        scene.add(gltfScene.scene)
                    })
                }


    // Sketchfab Cloud

    gltfLoader.load('/cloud.glb', (cloud) => {
        cloud.scene.scale.set(3,3,3)

        cloud.scene.position.x = 0
        cloud.scene.position.y = 20
        cloud.scene.position.z = -15

        scene.add(cloud.scene)
    })

    // Mountain

    gltfLoader.load('/low_poly_mountain.glb', (mountain) => {
        mountain.scene.scale.set(.5,.5,.5)

        mountain.scene.position.x = 100
        mountain.scene.position.y = -54
        mountain.scene.position.z = 100

        scene.add(mountain.scene)
    })


    // Birds

    gltfLoader.load('/birds2.glb', (birds) => {

    birds.scene.scale.set(2,8,2)
        
    birds.scene.position.x = 5;			    
    birds.scene.position.y = 8;	
    birds.scene.position.z = 0

    // birds.scene.castShadow = true

    scene.add(birds.scene)
    })

    // Campfire

    gltfLoader.load('/army_campfire_01.glb', (fire) => {
        fire.scene.scale.set(1,1,1)

        fire.scene.position.x = 0;
        fire.scene.position.y = 0;
        fire.scene.position.z = 0;

        scene.add(fire.scene)
    })

    /* Grass Clumps

for (let i=0; i<100; i++) {
    gltfLoader.load('/low_poly_grass_clump.glb', (grass) => {
        grass.scene.scale.set(.6,.6,.6)

        grass.scene.position.x = (Math.random() -.5) * 25;
        grass.scene.position.z = (Math.random() -.5) * 25;

        scene.add(grass.scene)
    })
}

*/

// Ground Planes

const groundGeometry = new THREE.PlaneGeometry(100,100,)
groundGeometry.rotateX(Math.PI / 2 * -45)

const groundPlane = new THREE.Mesh(groundGeometry, GroundMaterial)
groundPlane.receiveShadow = true
const groundPlane2 = new THREE.Mesh(groundGeometry, GroundMaterial)
groundPlane2.position.x = 100
const groundPlane3 = new THREE.Mesh(groundGeometry, GroundMaterial)
groundPlane3.position.x = -100

const LargeGroundGeometry = new THREE.PlaneGeometry(300,100)
LargeGroundGeometry.rotateX(Math.PI / 2 * -45)

const groundPlane4 = new THREE.Mesh(LargeGroundGeometry, GroundMaterial)
groundPlane4.position.z = 100

const groundPlane5 = new THREE.Mesh(LargeGroundGeometry, GroundMaterial)
groundPlane5.position.z = -100

scene.add(groundPlane, groundPlane2, groundPlane3, groundPlane4, groundPlane5)






// Orbit Controls
const controls = new OrbitControls( camera, canvas)
/* controls.enambleDamping = true
controls.dampingFactor = 1
controls.minDistance = 1
controls.maxPolarAngle = Math.PI/2.5
controls.dragToLook = true
controls.maxDistance = 25 */
controls.lookVertical = false
controls.update()

/////////////////////////////////////////////////////////////////////////
//// INTRO CAMERA ANIMATION USING TWEEN

/* function introAnimation() {
    controls.enabled = false //disable orbit controls to animate the camera
    
    new TWEEN.Tween(camera.position.set(0,30,0 )).to({ // from camera position
        x: 0, //desired x position to go
        y: 20, //desired y position to go
        z: 20 //desired z position to go
    }, 3000) // time take to animate
    .delay(4000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
    .onComplete(function () { //on finish animation
        controls.enabled = true //enable orbit controls
         //enable controls limits
        TWEEN.remove(this) // remove the animation from memory
    })
}

canvas.addEventListener('onClick', introAnimation()) // call intro animation on start
 */

// Three MMI // Event Types: click, dblclick, contextmenu, mouseenter, mouseleave, mousedown, mouseup
/* const mmi = new MouseMeshInteraction(scene, camera)
mmi.addHandler('sphere','click' , function(mesh) { // {Target, Event Type, Function}
    if (mesh.material === CloudMaterial) {
        mesh.material = GroundMaterial
    } else {
        mesh.material = CloudMaterial
    }
})

mmi.addHandler('sphere2','mouseenter' , function(mesh) { // {Target, Event Type, Function}
    mesh.scale.set(2,2,2)
})

mmi.addHandler('sphere2','mouseleave' , function(mesh) { // {Target, Event Type, Function}
    mesh.scale.set(1,1,1)
})

 */



const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // Move Sphere
    sphere.position.x += Math.sin(elapsedTime) * .3

    // Update Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // TWEEN
    TWEEN.update()

    // mmi (Event Listeners)
    // mmi.update()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


////////////////////////////////////////////

/*
gsap.to(controls.target,
    {x: ,y: , z: , duration: , ease: 'power3.inOut' })

gsap.to(camera.position,
    {x: ,y: ,z: , duration: , ease: 'power3.inOut;,
onComplte: enableButtons }, "-=2")

*/