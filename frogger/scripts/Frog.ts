import Rectangle from "./Rectangle"

class Frog extends Rectangle {
    onPlatform = false
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
    follow(delta: number, direction: number, speed: number) {
        this.x += direction * speed * (delta / 1000)
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

const frog = new Frog(350, 650, 50, 50, "green")

export { frog, Frog }