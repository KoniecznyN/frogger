import Rectangle from "./Rectangle";

class SafeZone extends Rectangle {
    spritesheet: HTMLImageElement
    constructor(x: number, y: number, w: number, h: number, color: string, spritesheet: HTMLImageElement) {
        super(x, y, w, h, color)
        this.spritesheet = spritesheet
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
            this.spritesheet,
            0, 250, this.w, this.h,
            this.x, this.y, this.w, this.h
        );
    }
}

export default SafeZone