import Car from "./Car";
import Frog from "./Frog";

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

class Game {
    frameRate = 1000 / 60
    lastFrame = 0
    startTime: number
    carSpawnTimer = 0
    frog: Frog
    cars: Car[] = []
    init() {
        console.log("start");
        this.configureCanvas()
        this.frog = this.createPlayer()
        requestAnimationFrame(this.gameLoop)
    }
    configureCanvas() {
        canvas.width = 700
        canvas.height = 700

        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    createPlayer() {
        return new Frog(350, 650, 50, 50, "green")
    }
    draw() {
        //cars
        this.cars.forEach(car => {
            car.draw(ctx)
        });

        //frog
        this.frog.draw(ctx)
    }
    checkCollisions() {
        this.cars.forEach(car => {
            if (
                this.frog.x < car.x + car.w && this.frog.x + this.frog.w > car.x && this.frog.y < car.y + car.h && this.frog.y + this.frog.h > car.y
            ) {
                this.frog.die()
            }
        })
    }
    gameLoop = (timestamp: DOMHighResTimeStamp) => {
        let delta = 0
        if (this.startTime === undefined) {
            this.startTime = timestamp
        } else {
            const currentFrame = Math.round((timestamp - this.startTime) / this.frameRate)
            delta = (currentFrame - this.lastFrame) * this.frameRate
            this.carSpawnTimer += delta
            this.lastFrame = currentFrame
        }

        if (this.carSpawnTimer >= 3000) {
            this.cars.push(new Car(-100, 600, 100, 50, "black", 1, 100))
            this.cars.push(new Car(700, 550, 100, 50, "black", -1, 120))
            this.cars.push(new Car(-100, 500, 100, 50, "black", 1, 130))
            this.cars.push(new Car(700, 450, 100, 50, "black", -1, 140))
            this.cars.push(new Car(-100, 400, 100, 50, "black", 1, 150))
            this.carSpawnTimer -= 3000
        }
        this.cars = this.cars.filter(car => car.isAlive)

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.cars.forEach(car => { car.move(delta) })
        this.checkCollisions()

        this.draw()

        requestAnimationFrame(this.gameLoop)
    }
}

const game = new Game()

export default game