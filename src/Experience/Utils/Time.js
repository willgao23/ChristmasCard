import EventEmitter from "./EventEmitter"
import * as THREE from 'three'

export default class Time extends EventEmitter {
    constructor() {
        super()
        this.clock = new THREE.Clock()
        this.elapsed = 0

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        this.elapsed = this.clock.getElapsedTime()

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}