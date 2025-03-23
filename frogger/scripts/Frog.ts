import Rectangle from "./Rectangle"
import AnimationsMap from "./interfaces/AnimationsMap"
import Flowers from "./Flowers"

class Frog extends Rectangle {
    currentAnimation: string = "frog_up"
    frameIndex: number = 0
    frameTimer: number = 0
    animations: AnimationsMap
    spritesheet: HTMLImageElement
    isAnimating: boolean = false

    isDead = false
    checkCollisions = true
    inWater: boolean = false
    onWood: boolean = false
    onFlower: boolean = false
    hitByCar: boolean = false
    constructor(x: number, y: number, w: number, h: number, color: string, animations: AnimationsMap, spritesheet: HTMLImageElement) {
        super(x, y, w, h, color)
        this.configureMovement()
        this.animations = animations
        this.spritesheet = spritesheet
    }
    configureMovement() {
        window.addEventListener("keydown", this.keyDown)
    }
    disableMovement() {
        window.removeEventListener("keydown", this.keyDown)
    }
    keyDown = (event: KeyboardEvent) => {
        let moved = false;

        if (event.key === "ArrowUp") {
            this.y = Math.max(0, this.y - 50);
            this.playAnimation("frog_up");
            moved = true;
        }
        if (event.key === "ArrowDown") {
            this.y = Math.min(650, this.y + 50);
            this.playAnimation("frog_down");
            moved = true;
        }
        if (event.key === "ArrowLeft") {
            this.x = Math.max(0, this.x - 50);
            this.playAnimation("frog_left");
            moved = true;
        }
        if (event.key === "ArrowRight") {
            this.x = Math.min(650, this.x + 50);
            this.playAnimation("frog_right");
            moved = true;
        }

        if (moved) {
            this.isAnimating = true;
            this.frameIndex = 0;
            this.frameTimer = this.animations[this.currentAnimation].times[0];
        }
    };
    follow(delta: number, direction: number, speed: number) {
        this.x += direction * speed * (delta / 1000)
        if (this.x == 0 || this.x == 650) {
            this.die()
        }
    }
    collidesWith(other: Rectangle): boolean {
        if (other instanceof Flowers && other.isHidden) {
            return false
        }
        return this.x < other.x + other.w &&
            this.x + this.w > other.x &&
            this.y < other.y + other.h &&
            this.y + this.h > other.y;
    }
    playAnimation(name: string) {
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
        if (!this.isAnimating) return;

        const animation = this.animations[this.currentAnimation];
        if (!animation) return;

        this.frameTimer -= delta;

        if (this.frameTimer <= 0) {
            this.frameIndex++;

            if (this.frameIndex >= animation.frames.length) {
                if (animation.repeat) {
                    this.frameIndex = 0;
                } else {
                    this.frameIndex = animation.frames.length - 1;
                    this.isAnimating = false;
                    return;
                }
            }

            this.frameTimer = animation.times[this.frameIndex];
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        const anim = this.animations[this.currentAnimation];
        if (!anim) return;

        const frame = anim.frames[this.frameIndex];

        ctx.drawImage(
            this.spritesheet,
            frame.x, frame.y, frame.w, frame.h,
            this.x, this.y, this.w, this.h
        );
    }
    playDeathAnimation(): Promise<void> {
        return new Promise((resolve) => {
            this.playAnimation("frog_death");
            this.isAnimating = true;
            this.frameIndex = 0;
            this.frameTimer = this.animations["frog_death"].times[0];
            const totalDuration = this.animations["frog_death"].times.reduce((sum, t) => sum + t, 0);

            setTimeout(() => {
                this.isAnimating = false;
                resolve();
            }, totalDuration);
        });
    }
    async die() {
        this.isDead = true
        this.checkCollisions = false
        this.disableMovement()

        await this.playDeathAnimation();

        this.x = 350;
        this.y = 650;

        this.checkCollisions = true
        this.isDead = false
        this.configureMovement()
        this.playAnimation("frog_up")
    }
}

export default Frog