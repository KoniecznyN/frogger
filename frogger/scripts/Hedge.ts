import Rectangle from "./Rectangle";
import AnimationsMap from "./interfaces/AnimationsMap";

class Hedge extends Rectangle {
    currentAnimation: "hedge_blank" | "hedge_captured" | "hedge_fly" = "hedge_blank"
    animationState: "idle" | "hide" | "hidden_idle" | "show" = "idle"
    idleDuration: number = 1000 + Math.random() * 3000;
    stateTimer: number = 0
    frameIndex: number = 0
    frameTimer: number = 0
    animations: AnimationsMap
    spritesheet: HTMLImageElement
    isAnimating: boolean = false

    isFly: boolean = false
    isCaptured: boolean = false
    constructor(x: number, y: number, w: number, h: number, color: string, animations: AnimationsMap, spritesheet: HTMLImageElement, isFly?: boolean) {
        super(x, y, w, h, color)
        this.spritesheet = spritesheet
        this.animations = animations
        this.isFly = isFly
        console.log(animations);

        this.playAnimation("hedge_blank")
    }
    draw(ctx: CanvasRenderingContext2D) {
        const anim = this.animations[this.currentAnimation];
        if (!anim) return;

        const frame = anim.frames[this.frameIndex];
        const elements = Math.floor(this.w / 168)
        for (let i = 0; i < elements; i++) {
            ctx.drawImage(
                this.spritesheet,
                frame.x, frame.y, frame.w, frame.h,
                this.x + (i * 168), this.y, 168, 100
            );
        }
    }
    playAnimation(name: "hedge_blank" | "hedge_captured" | "hedge_fly") {
        const anim = this.animations[name];
        if (!anim || !anim.frames || !anim.times) {
            console.warn(`Invalid animation "${name}"`);
            return;
        }
        this.currentAnimation = name;
        this.frameIndex = 0;
        this.frameTimer = anim.times[0];
        this.isAnimating = true;
    }
    updateAnimation(delta: number) {
        if (this.isFly && this.currentAnimation !== "hedge_fly") {
            this.playAnimation("hedge_fly");
        } else if (this.isCaptured && this.currentAnimation !== "hedge_captured") {
            this.playAnimation("hedge_captured");
        }

        const animation = this.animations[this.currentAnimation];
        if (!animation) return;

        // Frame updates
        this.frameTimer -= delta;
        if (this.frameTimer <= 0) {
            this.frameIndex++;
            if (this.frameIndex >= animation.frames.length) {
                if (animation.repeat) {
                    this.frameIndex = 0;
                } else {
                    this.frameIndex = animation.frames.length - 1;
                    this.isAnimating = false;
                }
            }
            this.frameTimer = animation.times[this.frameIndex];
        }
    }
}

export default Hedge