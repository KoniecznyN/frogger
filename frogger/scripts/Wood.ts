import Rectangle from "./Rectangle";
import Frog from "./Frog";

class Wood extends Rectangle {
    speed: number
    direction: number
    spritesheet: HTMLImageElement
    isAlive = true
    constructor(x: number, y: number, w: number, h: number, color: string, direction: number, speed: number, spritesheet: HTMLImageElement) {
        super(x, y, w, h, color)
        this.direction = direction
        this.speed = speed
        this.spritesheet = spritesheet
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
        const elements = this.w / 50
        for (let i = 0; i < elements; i++) {
            if (i == 0) {
                ctx.drawImage(
                    this.spritesheet,
                    0, 150, 50, 50,
                    this.x, this.y, 50, 50
                );
            } else if (i == elements - 1) {
                ctx.drawImage(
                    this.spritesheet,
                    100, 150, 50, 50,
                    this.x + (i * 50), this.y, 50, 50
                );
            } else {
                ctx.drawImage(
                    this.spritesheet,
                    50, 150, 50, 50,
                    this.x + (i * 50), this.y, 50, 50
                );
            }
        }
    }
}

export default Wood