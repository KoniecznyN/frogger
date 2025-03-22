import Rectangle from "./Rectangle"

class Frog extends Rectangle {
    onPlatform = false
    constructor(x: number, y: number, w: number, h: number, color: string,) {
        super(x, y, w, h, color)
        this.configureMove()
    }
    configureMove() {
        window.addEventListener("keydown", (event) => {
            if (event.key == "ArrowUp") {
                if (this.y - 50 > 0) {
                    this.y -= 50
                } else {
                    this.y = 0
                }
            }
            if (event.key == "ArrowDown") {
                if (this.y + 50 < 650) {
                    this.y += 50
                } else {
                    this.y = 650
                }
            }
            if (event.key == "ArrowRight") {
                if (this.x + 50 < 650) {
                    this.x += 50
                } else {
                    this.x = 650
                }
            }
            if (event.key == "ArrowLeft") {
                if (this.x - 50 > 0) {
                    this.x -= 50
                } else {
                    this.x = 0
                }
            }
        })
    }
    follow(delta: number, direction: number, speed: number) {
        this.x += direction * speed * (delta / 1000)
        if (this.x == 0 || this.x == 650) {
            this.die()
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    die() {
        this.x = 350
        this.y = 650
    }
}

export default Frog