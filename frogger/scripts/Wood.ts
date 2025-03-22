import Rectangle from "./Rectangle";
import Frog from "./Frog";

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
    checkCollisions(object: Frog, delta: number): boolean {
        const isColliding = (object.x < this.x + this.w && object.x + object.w > this.x && object.y < this.y + this.h && object.y + object.h > this.y)
        if (isColliding) {
            object.follow(delta, this.direction, this.speed)
        }
        return isColliding
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