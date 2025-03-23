import Rectangle from "./Rectangle";
import Frog from "./Frog";
import AnimationsMap from "./interfaces/AnimationsMap";

class Flowers extends Rectangle {
    currentAnimation: "flowers_idle" | "flowers_hide" | "flowers_hidden_idle" | "flowers_show" = "flowers_idle"
    animationState: "idle" | "hide" | "hidden_idle" | "show" = "idle"
    idleDuration: number = 1000 + Math.random() * 3000;
    stateTimer: number = 0
    frameIndex: number = 0
    frameTimer: number = 0
    animations: AnimationsMap
    spritesheet: HTMLImageElement
    isAnimating: boolean = false

    speed: number
    direction: number
    isHiding = false
    isHidden = false
    isAlive = true
    constructor(x: number, y: number, w: number, h: number, color: string, direction: number, speed: number, animations: AnimationsMap, spritesheet: HTMLImageElement) {
        super(x, y, w, h, color)
        this.direction = direction
        this.speed = speed
        this.isHiding = (Math.floor(Math.random() * 101) > 60)

        this.animations = animations
        this.spritesheet = spritesheet

        if (this.isHiding) {
            this.playAnimation("flowers_idle");
            this.animationState = "idle";
        } else {
            this.playAnimation("flowers_idle");
            this.isAnimating = true;
        }
    }
    move(delta: number) {
        this.destroy()
        this.x += this.direction * this.speed * (delta / 1000)
    }
    draw(ctx: CanvasRenderingContext2D) {
        const anim = this.animations[this.currentAnimation];
        if (!anim) return;

        const frame = anim.frames[this.frameIndex];
        const elements = this.w / 50
        for (let i = 0; i < elements; i++) {
            ctx.drawImage(
                this.spritesheet,
                frame.x, frame.y, frame.w, frame.h,
                this.x + (i * 50), this.y, 50, 50
            );
        }
    }
    destroy() {
        if (this.x <= -this.w) {
            this.isAlive = false
        }
    }
    playAnimation(name: "flowers_idle" | "flowers_hide" | "flowers_hidden_idle" | "flowers_show") {
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

        if (!this.isHiding) return;

        // Run hide/show animation cycle
        this.stateTimer += delta;
        switch (this.animationState) {
            case "idle":
                this.isHidden = false
                if (this.stateTimer >= this.idleDuration) {
                    this.playAnimation("flowers_hide");
                    this.animationState = "hide";
                    this.stateTimer = 0;
                    this.idleDuration = 1000 + Math.random() * 3000;
                }
                break;
            case "hide":
                if (!this.isAnimating) {
                    this.playAnimation("flowers_hidden_idle");
                    this.animationState = "hidden_idle";
                    this.stateTimer = 0;
                }
                break;
            case "hidden_idle":
                this.isHidden = true
                if (this.stateTimer >= 2000) {
                    this.playAnimation("flowers_show");
                    this.animationState = "show";
                    this.stateTimer = 0;
                }
                break;
            case "show":
                if (!this.isAnimating) {
                    this.playAnimation("flowers_idle");
                    this.animationState = "idle";
                    this.stateTimer = 0;
                }
                break;
        }
    }

}

export default Flowers