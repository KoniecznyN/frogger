import Rectangle from "./Rectangle"
import AnimationsMap from "./interfaces/AnimationsMap"
import Flowers from "./Flowers"
import Hedge from "./Hedge"
import { map } from "./Map"

class Frog extends Rectangle {
    currentAnimation: string = "frog_up"
    frameIndex: number = 0
    frameTimer: number = 0
    animations: AnimationsMap
    spritesheet: HTMLImageElement
    isAnimating: boolean = false

    lifes: number = 5
    isDead: boolean = false
    checkCollisions: boolean = true
    onHedge: boolean = false
    inWater: boolean = false
    onWood: boolean = false
    onFlower: boolean = false
    hitByCar: boolean = false

    passedRows: { [key: number]: boolean } = {
        600: false, 550: false, 500: false, 450: false, 400: false, 300: false, 250: false, 200: false, 150: false, 100: false
    }
    capturedFlies: number = 0
    points: number = 0
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
        if (this.x < 0 || this.x > 650) {
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
    reachHedge(hedge: Hedge) {
        const isColliding = (this.x < hedge.actualX + hedge.actualW &&
            this.x + this.w > hedge.actualX &&
            this.y < hedge.actualY + hedge.actualH &&
            this.y + this.h > hedge.actualY)
        if (isColliding && hedge.isFly) {
            for (const key in this.passedRows) {
                this.passedRows[key] = false
            }
            this.capturedFlies += 1
            this.points += 500
            hedge.isFly = false
            hedge.isCaptured = true

            if (this.capturedFlies != 4) {
                let end = false
                while (!end) {
                    let index = Math.floor(Math.random() * 4)
                    if (map.hedgeArr[index].isCaptured) {
                        continue
                    } else {
                        map.hedgeArr[index].isFly = true
                        this.x = 350;
                        this.y = 650;
                        end = true
                    }
                }
            }
        } else this.die()
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
        this.lifes--
        console.log(this.lifes);


        this.isDead = false
        this.checkCollisions = true
        this.configureMovement()

        this.playAnimation("frog_up")
    }
    updatePoints() {
        if (!this.passedRows[this.y] && this.passedRows[this.y] != undefined) {
            this.passedRows[this.y] = true
            this.points += 100
            console.log(this.passedRows);

        }
    }
}

export default Frog