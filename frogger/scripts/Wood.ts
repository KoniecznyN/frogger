import Rectangle from "./Rectangle";

class Wood extends Rectangle {
    speed: number
    direction: number
    isAlive = true
    constructor(x: number, y: number, w: number, h: number, color: string, direction: number, speed: number) {
        super(x, y, w, h, color)
        this.direction = direction
        this.speed = speed
    }
    move(delta: number) {
        this.destroy()
        this.x += this.direction * this.speed * (delta / 1000)
    }
    destroy() {
        if (this.direction == 1) {
            if (this.x >= 700) {
                this.isAlive = false
            }
        } else {
            if (this.x <= -100) {
                this.isAlive = false
            }
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

export default Wood