import Experience from "../Experience";
import Card from "./Card";
import Font from "./Font";


export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            this.card = new Card()
            this.font = new Font()
        })

    }

    resize() {
        if(this.card) {
            this.card.resize()
        }
    }

    update() {
        if(this.card && this.font) {
            this.card.update()
            this.font.update()
        }
    }
}