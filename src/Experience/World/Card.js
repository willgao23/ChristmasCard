import * as THREE from 'three'
import Experience from '../Experience.js'
import cardVertexShader from '../../shaders/card/vertex.glsl'
import cardFragmentShader from '../../shaders/card/fragment.glsl'

export default class Card {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.resource = this.experience.resources
        this.canvas = this.experience.canvas
        this.mouse = new THREE.Vector2(0, 0)

        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        this.canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e)
        })
        this.canvas.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e)
        })
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(4, 4, 128, 128);
    }

    setMaterial() {
        this.uniforms = {
            u_time: { value: 1.0 },
            u_resolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height)},
            u_mouse: { value: new THREE.Vector2()},
            u_animation: { value: false }
        }
        this.material = new THREE.ShaderMaterial({
            vertexShader: cardVertexShader,
            fragmentShader: cardFragmentShader,
            uniforms: this.uniforms,
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    handleMouseMove(e) {
        this.uniforms.u_mouse.value.x = e.clientX / this.sizes.width
        this.uniforms.u_mouse.value.y = -1 * ((e.clientY / this.sizes.height) - 1)

        this.mouse.x = e.clientX / this.sizes.width * 2 - 1
        this.mouse.y = - (e.clientY / this.sizes.height) * 2 + 1
    }

    handleTouchMove(e) {
        e.preventDefault()
        this.uniforms.u_mouse.value.x = e.touches[0].clientX / this.sizes.width
        this.uniforms.u_mouse.value.y = -1 * ((e.touches[0].clientY  / this.sizes.height) - 1)

        this.mouse.x = e.touches[0].clientX / this.sizes.width * 2 - 1
        this.mouse.y = - (e.touches[0].clientY  / this.sizes.height) * 2 + 1
    }

    resize() {
        this.uniforms.u_resolution.value.set(this.sizes.width, this.sizes.height)
    }

    update() {
        this.uniforms.u_time.value = this.time.elapsed
    }
}