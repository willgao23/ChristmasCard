import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'

let instance = null
export default class Experience {
    constructor(canvas) {
        if (instance) {
            return instance
        }

        instance = this

        this.canvas = canvas

        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.resources = new Resources(sources)
        this.world = new World()

        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            this.update()
        })

    }

    resize() {
        this.camera.resize()
        this.world.resize()
        this.renderer.resize()
    }

    update() {
        this.world.update()
        this.renderer.update()
    }   
}