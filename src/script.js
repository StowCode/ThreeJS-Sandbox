import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DoubleSide, Group } from 'three'



const canvas = document.querySelector('.webgl')

const scene = new THREE.Scene()

// Textures
const GroundTexture = new THREE.TextureLoader().load( '/ForestGround/forrest_ground_01_diff_4k.jpg' )
GroundTexture.wrapS = THREE.RepeatWrapping
GroundTexture.wrapT = THREE.RepeatWrapping
GroundTexture.repeat.set(50, 50)

const TreeTexture = new THREE.TextureLoader().load('/rotting-wood-texture.jpg')
TreeTexture.wrapT = TreeTexture.wrapS = THREE.RepeatWrapping
TreeTexture.repeat.set(4, 10)

// Materials
const CloudMaterial = new THREE.MeshPhongMaterial({ color: 'white', flatShading: true, })
const GroundMaterial = new THREE.MeshLambertMaterial({map: GroundTexture })
const TreeMaterial = new THREE.MeshLambertMaterial({map: TreeTexture})
const TreeTopMaterial = new THREE.MeshPhongMaterial({ color: 'green', flatShading: true})

// Clouds

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

// Tree Population

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

// Ground

const groundGeometry = new THREE.PlaneGeometry(50,50)
groundGeometry.rotateX(Math.PI / 2 * -45)

const groundPlane = new THREE.Mesh(groundGeometry, GroundMaterial)


scene.add(groundPlane)

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

const light = new THREE.DirectionalLight( 0xffffff, .8 );

const sunsetLight = new THREE.DirectionalLight ( 0xff5566, 0.7)
sunsetLight.position.set(-3, -1, 0)

scene.add( light, sunsetLight );
scene.add(new THREE.AmbientLight(0xffffff,0.3))

// Camera
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, .0001, 10000)
camera.position.z = 15
camera.position.x = 0
camera.position.y = 5
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

    // Update Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



