import Rectangle from "./Rectangle"

class Frog extends Rectangle {
    constructor(x: number, y: number, w: number, h: number, color: string) {
        super(x, y, w, h, color)
        this.configureMove()
    }
    configureMove() {
        window.addEventListener("keydown", (event) => {
            if (event.key == "ArrowUp") {
                if (this.y > 0) {
                    this.y -= 50
                }
            }
            if (event.key == "ArrowDown") {
                if (this.y < 650) {
                    this.y += 50
                }
            }
            if (event.key == "ArrowRight") {
                if (this.x < 650) {
                    this.x += 50
                }
            }
            if (event.key == "ArrowLeft") {
                if (this.x > 0) {
                    this.x -= 50
                }
            }
        })
    }
}

export default Frog