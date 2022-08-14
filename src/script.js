import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Group } from 'three'


const canvas = document.querySelector('.webgl')

const scene = new THREE.Scene()

// Materials
const CloudMaterial = new THREE.MeshPhongMaterial({ color: 'white', flatShading: true, })

// Clouds

const tuft1geometry = new THREE.TetrahedronBufferGeometry(1.7, 4)
tuft1geometry.translate(-2,0,0)
const tuft1 = new THREE.Mesh(tuft1geometry, CloudMaterial)

const tuft2geometry = new THREE.TetrahedronBufferGeometry(1.3, 5)
tuft2geometry.translate(2,0,0)
const tuft2 = new THREE.Mesh(tuft2geometry, CloudMaterial)

const tuft3geometry = new THREE.TetrahedronBufferGeometry(2, 6)
tuft3geometry.translate(0,0,0)
const tuft3 = new THREE.Mesh(tuft3geometry, CloudMaterial)

const tuft4geometry = new THREE.TetrahedronBufferGeometry(.5, 2)
tuft4geometry.translate(-1, 0, 1.7)
const tuft4 = new THREE.Mesh(tuft4geometry, CloudMaterial)


const cloud = new Group()
cloud.add(tuft1, tuft2, tuft3, tuft4);


scene.add(cloud)

const cloud2 = cloud.clone()
cloud2.position.x = 3;
cloud2.position.y = 4;
cloud2.position.z = -3;
cloud2.scale.set(.4, .4, .4)
scene.add(cloud2)


/* ISNT WORKING.  VERTICE RANDOMIZER

var noise = 5;
for(var i=0; i<tuft1.vertices.length; i++){
  var v = tuft1.vertices[i];
  v.x += -noise/2 + Math.random()*noise;
  v.y += -noise/2 + Math.random()*noise;
  v.z += -noise/2 + Math.random()*noise;
}

*/

// Sizes
const sizes = {
    width: 1200,
    height: 700
}

// Lights

const light = new THREE.DirectionalLight( 0xffffff, .8 );

const sunsetLight = new THREE.DirectionalLight ( 0xff5566, 0.7)
sunsetLight.position.set(-3, -1, 0)

scene.add( light, sunsetLight );
scene.add(new THREE.AmbientLight(0xffffff,0.3))

// Camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, .0001, 10000)
camera.position.z = 4
camera.position.x = 1
camera.position.y = 1
scene.add(camera)


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)


// Controls

const controls = new OrbitControls( camera, canvas)
controls.enambleDamping = true
controls.update()


// Animate (This is needed to controls to work)
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()



