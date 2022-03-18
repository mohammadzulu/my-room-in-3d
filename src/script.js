import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import panelVertexShader from './shaders/panel/vertex.glsl'
import panelFragmentShader from './shaders/panel/fragment.glsl'
import mirrorVertexShader from './shaders/mirror/vertex.glsl'
import mirrorFragmentShader from './shaders/mirror/fragment.glsl'
import coffeeSteamVertexShader from './shaders/coffeeSteam/vertex.glsl'
import coffeeSteamFragmentShader from './shaders/coffeeSteam/fragment.glsl'

const playButton = document.getElementById('playButton')
const pauseButton = document.getElementById('pauseButton')
const musicElement = document.querySelector('.music')
const point0 = document.querySelector('.point-0')
const point1 = document.querySelector('.point-1')
const point2 = document.querySelector('.point-2')
const text = document.getElementById('text')
const text1 = document.getElementById('text1')
const cursor =  document.getElementById('cursor')

//Functions for showing and hiding the cursor
//They are referenced the 
const showCursor = () => 
{
  //Function to show/hide the cursor
  if (cursor.classList.contains('rjs_cursor_hidden')) 
  {
    cursor.classList.remove('cursor_hidden')
  }
  cursor.classList.add('cursor_visible')
}

const hideCursor = () => 
{
  if (cursor.classList.contains('cursor_visible')) 
  {
    cursor.classList.remove('cursor_visible')
  }
  cursor.classList.add('cursor_hidden')
}

const mousemove = (e) => 
{
  //Function to correctly position the cursor
  showCursor() //Toggle show/hide
  const cursorWidth = cursor.offsetWidth * 0.5
  const cursorHeight = cursor.offsetHeight * 0.5
  const cursorX = e.clientX - cursorWidth //x-coordinate
  const cursorY = e.clientY - cursorHeight //y-coordinate
  const cursorPos = `translate(${cursorX}px, ${cursorY}px)`
  cursor.style.transform = cursorPos
}

//Eventlisteners
window.addEventListener('mousemove', mousemove) //Attach an event listener
document.body.addEventListener('mouseleave', hideCursor)

//Hover behaviour
const hoverCursor = () =>
{
  cursor.classList.add('cursor_hover')
}

const unhoverCursor = () =>
{
  cursor.classList.remove('cursor_hover')
}

document.querySelectorAll('a').forEach((item) => 
{
  item.addEventListener('mouseover', hoverCursor)
  item.addEventListener('mouseleave', unhoverCursor)
})

playButton.addEventListener('mouseover', hoverCursor)
playButton.addEventListener('mouseleave', unhoverCursor)

pauseButton.addEventListener('mouseover', hoverCursor)
pauseButton.addEventListener('mouseleave', unhoverCursor)

point0.addEventListener('mouseover', hoverCursor)
point0.addEventListener('mouseleave', unhoverCursor)

point1.addEventListener('mouseover', hoverCursor)
point1.addEventListener('mouseleave', unhoverCursor)

point2.addEventListener('mouseover', hoverCursor)
point2.addEventListener('mouseleave', unhoverCursor)


playButton.style.opacity = 0
playButton.style.transition = 'opacity 0.5s'
pauseButton.style.opacity = 0
pauseButton.style.transition = 'opacity 0.5s'
musicElement.style.opacity = 0
musicElement.style.transition = 'opacity 0.5s'
cursor.style.opacity = 0
cursor.style.transition = 'opacity 0.3s'


"mousemove click".split(" ").forEach((e) =>
{
    point0.addEventListener(e, () =>
    {
        text.style.opacity = 1

        setTimeout(() =>
        {
            text.style.opacity = 0
        }, 10000)
    })
})

"mousemove click".split(" ").forEach((e) =>
{
    point1.addEventListener(e, () =>
    {
        text1.style.opacity = 1
        text1.style.pointerEvents = 'initial'

        setTimeout(() =>
        {
            text1.style.opacity = 0
            text1.style.pointerEvents = 'none'
        }, 10000)
    })
})


/**
 * Sound
 */
const sound = new Audio('/sound/Harris Heller - Ambient Gold.mp3')
const sound1 = new Audio('/sound/music1.mp3')

playButton.addEventListener('click', () =>
{
    sound.play()
})
pauseButton.addEventListener('click', () =>
{
    sound.pause()
})

point2.addEventListener('click', () =>
{
    sound1.play()
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
* Loaders
*/
const onTransitionEnd = (event) =>
{
    event.target.remove()
}

let sceneReady = false
const loadingManager = new THREE.LoadingManager( () => 
{
    const loadingScreen = document.querySelector('.spinner-container')
    loadingScreen.classList.add('fade-out')
    
    // optional: remove loader from DOM via event listener
    loadingScreen.addEventListener('transitionend', onTransitionEnd)

    window.setTimeout(() =>
      {
          sceneReady = true
      }, 4000)
    
})
// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)

// panel material
const panelMaterial = new THREE.ShaderMaterial({
    uniforms:
    {  
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(0x5e6573) },
        uColorEnd: { value: new THREE.Color(0xbb4ccf) }
    },
    vertexShader: panelVertexShader,
    fragmentShader: panelFragmentShader
})

// Mirror material
const mirrorMaterial = new THREE.ShaderMaterial({
    uniforms:
    {  
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(0x5e6573) },
        uColorEnd: { value: new THREE.Color(0xeba834) }
    },
    vertexShader: mirrorVertexShader,
    fragmentShader: mirrorFragmentShader
})

// Text material
const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

// Eminem's Back poster material
const eminemBackMaterial = new THREE.MeshBasicMaterial({ color: 0x020202 })

const topBenchPressMaterial = new THREE.MeshBasicMaterial({ color: 0x141414 })

// Coffee steam
const coffeeSteamMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uTimeFrequency: { value: 0.0004 },
        vUvFrequency: { value: new THREE.Vector2(4, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xb0b0b0) }
    },
    vertexShader: coffeeSteamVertexShader,
    fragmentShader: coffeeSteamFragmentShader,
    transparent: true,
    depthWrite: false
})

/**
 * Textures
 */
const bakedTexture = textureLoader.load('bakedTexture.jpg')
const bakedTexture1 = textureLoader.load('bakedTexture1.jpg')
const bakedTexture2 = textureLoader.load('bakedTexture2.jpg')
const bakedTexture3 = textureLoader.load('bakedTexture3.jpg')
const bakedTexture4 = textureLoader.load('bakedTexture4.jpg')
const bakedTexture5 = textureLoader.load('bakedTexture5.jpg')

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
const bakedMaterial1 = new THREE.MeshBasicMaterial({ map: bakedTexture1 })
const bakedMaterial2 = new THREE.MeshBasicMaterial({ map: bakedTexture2 })
const bakedMaterial3 = new THREE.MeshBasicMaterial({ map: bakedTexture3 })
const bakedMaterial4 = new THREE.MeshBasicMaterial({ map: bakedTexture4 })
const bakedMaterial5 = new THREE.MeshBasicMaterial({ map: bakedTexture5 })
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding
bakedTexture1.flipY = false
bakedTexture1.encoding = THREE.sRGBEncoding
bakedTexture2.flipY = false
bakedTexture2.encoding = THREE.sRGBEncoding
bakedTexture3.flipY = false
bakedTexture3.encoding = THREE.sRGBEncoding
bakedTexture4.flipY = false
bakedTexture4.encoding = THREE.sRGBEncoding
bakedTexture5.flipY = false
bakedTexture5.encoding = THREE.sRGBEncoding

/**
 * Model
 */
let mixer = null
gltfLoader.load(
    'room.glb',
    (gltf) =>
    {
        const keyboard = gltf.scene.children.find(child => child.name === 'keyboard')
        keyboard.material = bakedMaterial5

        const eminemMesh = gltf.scene.children.find(child => child.name === 'eminem')
        eminemMesh.material = bakedMaterial4

        const eminemBackMesh = gltf.scene.children.find(child => child.name === 'eminemBack')
        eminemBackMesh.material = eminemBackMaterial
        eminemBackMesh.material.side = THREE.BackSide

        const topBenchPressMesh = gltf.scene.children.find(child => child.name === 'topbenchPress')
        topBenchPressMesh.material = topBenchPressMaterial
        topBenchPressMesh.material.side = THREE.DoubleSide
        

        const mogMesh = gltf.scene.children.find(child => child.name === 'mog')
        mogMesh.material = bakedMaterial3

        const coffeSteamMesh = gltf.scene.children.find(child => child.name === 'coffeSteam')
        coffeSteamMesh.material = coffeeSteamMaterial

        const WoodsBakeBlackMesh = gltf.scene.children.find(child => child.name === 'Cube')
        WoodsBakeBlackMesh.material = bakedMaterial1

        const chairTopMesh = gltf.scene.children.find(child => child.name === 'chairTop')
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()
        chairTopMesh.material = bakedMaterial1

        const flowerBakeMesh = gltf.scene.children.find(child => child.name === 'flowers')
        flowerBakeMesh.material = bakedMaterial1
        
        const woodsBakeMesh = gltf.scene.children.find(child => child.name === 'Cube008')
        woodsBakeMesh.material = bakedMaterial

        const panelLightMesh = gltf.scene.children.find(child => child.name === 'panel')
        const mirrorLightMesh = gltf.scene.children.find(child => child.name === 'mirror')
        const textLightMesh = gltf.scene.children.find(child => child.name === 'text')

        panelLightMesh.material = panelMaterial
        mirrorLightMesh.material = mirrorMaterial
        textLightMesh.material = textMaterial

        const wallBakeMesh = gltf.scene.children.find(child => child.name === 'Cube028')
        wallBakeMesh.material = bakedMaterial2

        const lastBakedMesh = gltf.scene.children.find(child => child.name === 'Cube001')
        lastBakedMesh.material = bakedMaterial3

        scene.add(gltf.scene)
    }
)

/**
 * Points of interest
 */
const raycaster = new THREE.Raycaster()
const points = [
    {
        position: new THREE.Vector3(- 1.0, 0.5, 3.3),
        element: document.querySelector('.point-0')
    },
    {
        position: new THREE.Vector3(2.5, 0.8, 4.5),
        element: document.querySelector('.point-1')
    },
    {
        position: new THREE.Vector3(- 2.23, 0.4, 3.025),
        element: document.querySelector('.point-2')
    }
]


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-8, 8, -20)
camera.updateMatrixWorld()

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.screenSpacePanning = true
controls.zoomSpeed = 0.8
controls.maxDistance = 40
controls.maxPolarAngle = 0.5 * Math.PI
controls.update()

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setClearColor('rgb(40, 40, 40)')

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update materials
    panelMaterial.uniforms.uTime.value = elapsedTime
    mirrorMaterial.uniforms.uTime.value = elapsedTime
    coffeeSteamMaterial.uniforms.uTime.value = elapsedTime

    // Update mixer
    if(mixer !== null)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    if (sceneReady)
    {
        playButton.style.opacity = 1
        pauseButton.style.opacity = 1
        musicElement.style.opacity = 1
        cursor.style.opacity = 1
        
    // Go through each point
    for(const point of points)
    {
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        raycaster.setFromCamera(screenPosition, camera)
        const intersects = raycaster.intersectObjects(scene.children, true)

        if(intersects.length === 0)
        {
            point.element.classList.add('visible')
        }
        else
        {
            const intersectionDistance = intersects[0].distance
            const pointDistance = point.position.distanceTo(camera.position)

            if(intersectionDistance < pointDistance)
            {
                point.element.classList.remove('visible')   
            }
            else
            {
                point.element.classList.add('visible') 
            }
        }
        
        const translateX = screenPosition.x * sizes.width * 0.5
        const translateY = - screenPosition.y * sizes.height * 0.5
        point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
    }
}

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
