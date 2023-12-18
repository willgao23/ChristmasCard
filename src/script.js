import * as THREE from 'three'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import cardVertexShader from './shaders/card/vertex.glsl'
import cardFragmentShader from './shaders/card/fragment.glsl'

THREE.ColorManagement.enabled = false

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Loader
const textureLoader = new THREE.TextureLoader()

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

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

    uniforms.u_resolution.value.x = sizes.width;
    uniforms.u_resolution.value.y = sizes.height;
})

/**
 * Card
 */
//Geometry
const cardGeometry = new THREE.PlaneGeometry(4, 4, 128, 128);

// Material
const uniforms = {
    u_time: { value: 1.0 },
    u_resolution: { value: new THREE.Vector2(sizes.width, sizes.height)},
    u_mouse: { value: new THREE.Vector2()},
    u_animation: { value: false }
}

const cardMaterial = new THREE.ShaderMaterial({
    vertexShader: cardVertexShader,
    fragmentShader: cardFragmentShader,
    uniforms,
});

// Mesh
const mesh = new THREE.Mesh(cardGeometry, cardMaterial)
scene.add(mesh)

/**
 * Fonts
 */
const fontLoader = new FontLoader()
let text1;
let text2;

fontLoader.load(
    '/fonts/Style Script_Regular.json',
    (font) => {
        const matcapTexture = textureLoader.load('/matcaps/silver.png')
        matcapTexture.colorSpace = THREE.SRGBColorSpace
        const textMaterial = new THREE.MeshMatcapMaterial()
        textMaterial.matcap = matcapTexture

        if (sizes.width >= sizes.height) {
            const textGeometry1 = new TextGeometry(
                'Happy',
                {
                    font: font,
                    size: 0.3,
                    height: 0.03,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.05,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5,
                }
            )
    
            const textGeometry2 = new TextGeometry(
                'Holidays!',
                {
                    font: font,
                    size: 0.3,
                    height: 0.03,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.05,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5,
                }
            )
            text1 = new THREE.Mesh(textGeometry1, textMaterial)
            text1.position.set(-0.73, 0.15, 0)
    
            text2 = new THREE.Mesh(textGeometry2, textMaterial)
            text2.position.set(-0.55, -0.35, 0)
        } else {
            const textGeometry1 = new TextGeometry(
                'Happy',
                {
                    font: font,
                    size: 0.15,
                    height: 0.015,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.025,
                    bevelSize: 0.01,
                    bevelOffset: 0,
                    bevelSegments: 5,
                }
            )
    
            const textGeometry2 = new TextGeometry(
                'Holidays!',
                {
                    font: font,
                    size: 0.15,
                    height: 0.015,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.025,
                    bevelSize: 0.01,
                    bevelOffset: 0,
                    bevelSegments: 5,
                }
            )

            text1 = new THREE.Mesh(textGeometry1, textMaterial)
            text1.position.set(-0.22, 0.08, 0)
    
            text2 = new THREE.Mesh(textGeometry2, textMaterial)
            text2.position.set(-0.33, -0.15, 0)
        }
        scene.add(text1)
        scene.add(text2)   
    }
)

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

canvas.addEventListener('mousemove', (e) =>{
    uniforms.u_mouse.value.x = e.clientX / sizes.width;
    uniforms.u_mouse.value.y = -1 * ((e.clientY / sizes.height) - 1);

    mouse.x = e.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10)
camera.position.set(0, 0, 1.27);
scene.add(camera)

/**
 * Animate
 */
const clock = new THREE.Clock()
let textIsIntersected = false
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    uniforms.u_time.value = elapsedTime;

    raycaster.setFromCamera(mouse, camera)

    if (text1 && text2) {
        const text1Intersects = raycaster.intersectObject(text1)
        const text2Intersects = raycaster.intersectObject(text2)

        if(text1Intersects.length || text2Intersects.length) {
            text1.position.z = 0.01
            text2.position.z = 0.01
            textIsIntersected = true
        } else {
            text1.position.z = 0
            text2.position.z = 0
            textIsIntersected = false
        }
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Audio
 */
const xmasChimes = new Audio('/audio/xmasBellSFX.mp3')
xmasChimes.addEventListener('ended', () => {
    xmasChimes.currentTime = 0
    uniforms.u_animation.value = false
})

/**
 * Click event
 */
canvas.addEventListener('click', () => {
    if (textIsIntersected) {
        uniforms.u_animation.value = true
        xmasChimes.play()
    }
})