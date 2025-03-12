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
    cars: Car[]
    init() {
        console.log("start");
        this.configureCanvas()
        this.frog = this.createPlayer()
        this.cars = this.createCars()
        requestAnimationFrame(this.gameLoop)
    }
    configureCanvas() {
        canvas.width = 700
        canvas.height = 700

        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    createPlayer() {
        return new Frog(0, 0, 50, 50, "green")
    }
    createCars() {
        const carOne = new Car(-100, 650, 100, 50, "black", 1, 200)
        const carTwo = new Car(700, 600, 100, 50, "black", -1, 180)
        return [carOne, carTwo]
    }
    draw() {
        //cars
        this.cars.forEach(car => {
            ctx.fillStyle = car.color;
            ctx.fillRect(car.x, car.y, car.w, car.h);
        });

        //frog
        ctx.fillStyle = this.frog.color;
        ctx.fillRect(this.frog.x, this.frog.y, this.frog.w, this.frog.h);
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

        this.cars = this.cars.filter(car => car.isAlive)
        if (this.carSpawnTimer >= 1500) {
            this.cars.push(new Car(-100, 650, 100, 50, "black", 1, 200))
            this.cars.push(new Car(700, 600, 100, 50, "black", -1, 180))
            this.carSpawnTimer -= 1500
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.cars.forEach(car => { car.move(delta) })
        this.draw()

        requestAnimationFrame(this.gameLoop)
    }
}

const game = new Game()

export default game