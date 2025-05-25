import Rectangle from "./Rectangle";

class Road extends Rectangle {
    constructor(x: number, y: number, w: number, h: number, color: string) {
        super(x, y, w, h, color)
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

export default Road