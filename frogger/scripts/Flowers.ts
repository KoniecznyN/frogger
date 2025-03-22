import Rectangle from "./Rectangle";
import Frog from "./Frog";

class Flowers extends Rectangle {
    speed: number
    direction: number
    isDissapearing = false
    isHidden = false
    isAlive = true
    constructor(x: number, y: number, w: number, h: number, color: string, direction: number, speed: number) {
        super(x, y, w, h, color)
        this.direction = direction
        this.speed = speed

        this.isDissapearing = (Math.floor(Math.random() * 101) > 60)
    }
    move(delta: number) {
        this.destroy()
        this.x += this.direction * this.speed * (delta / 1000)
    }
    appear() {
        if (this.isDissapearing) {
            this.color = "pink"
            this.isHidden = false
        }
    }
    dissapear() {
        if (this.isDissapearing) {
            this.color = "red"
            this.isHidden = true
        }
    }
    checkCollisions(object: Frog, delta: number): boolean {
        const isColliding = (object.x < this.x + this.w && object.x + object.w > this.x && object.y < this.y + this.h && object.y + object.h > this.y)
        if (this.isHidden) {
            return false
        } else {
            if (isColliding) {
                object.follow(delta, this.direction, this.speed)
            }
            return isColliding
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    destroy() {
        if (this.x <= -this.w) {
            this.isAlive = false
        }
    }
}

export default Flowers