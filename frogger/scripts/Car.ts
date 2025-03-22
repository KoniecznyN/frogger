import Rectangle from "./Rectangle";
import Frog from "./Frog";

class Car extends Rectangle {
    speed: number
    direction: number
    spritesheet: HTMLImageElement
    carNumber: number
    isAlive = true
    constructor(x: number, y: number, w: number, h: number, color: string, direction: number, speed: number, spritesheet: HTMLImageElement, carNumber: number) {
        super(x, y, w, h, color)
        this.direction = direction
        this.speed = speed
        this.spritesheet = spritesheet
        this.carNumber = carNumber
    }
    move(delta: number) {
        this.destroy()
        this.x += this.direction * this.speed * (delta / 1000)
    }
    checkCollisions(object: Frog) {
        const isColliding = (
            object.x < this.x + this.w && object.x + object.w > this.x && object.y < this.y + this.h && object.y + object.h > this.y
        )
        return isColliding
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
            this.spritesheet,
            this.carNumber, 100, this.w, this.h,
            this.x, this.y, this.w, this.h
        );
    }
    destroy() {
        if (this.direction == 1) {
            if (this.x >= 700) {
                this.isAlive = false
            }
        } else {
            if (this.x <= -this.w) {
                this.isAlive = false
            }
        }
    }
}

export default Car