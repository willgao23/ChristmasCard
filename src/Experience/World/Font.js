import Experience from "../Experience"
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as THREE from 'three'

export default class Font {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.mouse = this.experience.world.card.mouse
        this.raycaster = new THREE.Raycaster()
        this.textIsIntersected = false

        this.font = this.resources.items.scriptFont
        this.matcap = this.resources.items.silverMatcap
        this.audio = new Audio('/audio/xmasBellSFX.mp3')

        this.setText()
        this.canvas.addEventListener('click', () => {
            this.handleClick()
        })
        this.audio.addEventListener('ended', () => {
            this.handleAudioEnd()
        })
    }

    handleClick() {
        if (this.textIsIntersected) {
            this.experience.world.card.uniforms.u_animation.value = true
            this.audio.play()
        }
    }
    
    handleAudioEnd() {
        this.audio.currentTime = 0
        this.experience.world.card.uniforms.u_animation.value = false
    }

    setText() {
        this.matcap.colorSpace = THREE.SRGBColorSpace
        const textMaterial = new THREE.MeshMatcapMaterial()
        textMaterial.matcap = this.matcap

        if (this.sizes.width >= this.sizes.height) {
            const textGeometry1 = new TextGeometry(
                'Happy',
                {
                    font: this.font,
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
                    font: this.font,
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
            this.text1 = new THREE.Mesh(textGeometry1, textMaterial)
            this.text1.position.set(-0.73, 0.15, 0)
    
            this.text2 = new THREE.Mesh(textGeometry2, textMaterial)
            this.text2.position.set(-0.55, -0.35, 0)
        } else {
            const textGeometry1 = new TextGeometry(
                'Happy',
                {
                    font: this.font,
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
                    font: this.font,
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

            this.text1 = new THREE.Mesh(textGeometry1, textMaterial)
            this.text1.position.set(-0.22, 0.08, 0)
    
            this.text2 = new THREE.Mesh(textGeometry2, textMaterial)
            this.text2.position.set(-0.33, -0.15, 0)
        }
        this.scene.add(this.text1)
        this.scene.add(this.text2)   
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera.instance)

        if (this.text1 && this.text2) {
            const text1Intersects = this.raycaster.intersectObject(this.text1)
            const text2Intersects = this.raycaster.intersectObject(this.text2)

            if(text1Intersects.length || text2Intersects.length) {
                this.text1.position.z = 0.01
                this.text2.position.z = 0.01
                this.textIsIntersected = true
            } else {
                this.text1.position.z = 0
                this.text2.position.z = 0
                this.textIsIntersected = false
            }
        }
    }
}