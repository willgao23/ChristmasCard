import * as THREE from 'three'
import * as dat from 'lil-gui'
import cardVertexShader from './shaders/card/vertex.glsl'
import cardFragmentShader from './shaders/card/fragment.glsl'

THREE.ColorManagement.enabled = false

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Card
 */
//Geometry
const cardGeometry = new THREE.PlaneGeometry(4, 4, 128, 128);

// Material
const uniforms = {
    u_time: { value: 1.0 },
    u_mouse: { value: new THREE.Vector2()},
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
 * Mouse
 */
document.addEventListener('mousemove', (e) =>{
    uniforms.u_mouse.value.x = e.clientX;
    uniforms.u_mouse.value.y = e.clientY;
})

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
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10)
camera.position.set(0, 0, 1);
scene.add(camera)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    uniforms.u_time.value = elapsedTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()