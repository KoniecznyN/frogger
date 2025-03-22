import Rectangle from "./Rectangle";
import Frog from "./Frog";

class DeadZone extends Rectangle {
    constructor(x: number, y: number, w: number, h: number, color: string) {
        super(x, y, w, h, color)
    }
    checkCollisions(object: Frog) {
        if (
            object.x < this.x + this.w && object.x + object.w > this.x && object.y < this.y + this.h && object.y + object.h > this.y
        ) {
            object.die()
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

const water = new DeadZone(0, 100, 700, 250, "blue")

export default water