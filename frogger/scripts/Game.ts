import Car from "./Car";
import frog from "./Frog";

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

class Game {
    frameRate = 1000 / 60
    lastFrame = 0
    startTime: number
    carsData: { [key: string]: [number] }
    carSpawnTimer: { [key: string]: number } = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    spawnIndex: { [key: string]: number } = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    cars: Car[] = []
    frog = frog
    async init() {
        console.log("start");
        this.carsData = await this.receiveCarsData()

        this.configureCanvas()
        requestAnimationFrame(this.gameLoop)
    }
    receiveCarsData = async () => {
        const response = await fetch("../scripts/rows.json")
        const data = await response.json()
        return data
    }
    configureCanvas() {
        canvas.width = 700
        canvas.height = 700

        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    spawnCars(row: string, position: { x: number, y: number }, direction: number, speed: number) {
        if (this.carSpawnTimer[row] >= this.carsData[row][this.spawnIndex[row]]) {
            this.cars.push(new Car(position.x, position.y, 100, 50, "black", direction, speed))
            this.carSpawnTimer[row] -= this.carsData[row][this.spawnIndex[row]]

            this.spawnIndex[row] += 1
            if (this.spawnIndex[row] == 5) {
                this.spawnIndex[row] = 0
            }
        }
    }
    gameLoop = (timestamp: DOMHighResTimeStamp) => {
        //time management
        let delta = 0
        if (this.startTime === undefined) {
            this.startTime = timestamp
        } else {
            const currentFrame = Math.round((timestamp - this.startTime) / this.frameRate)
            delta = (currentFrame - this.lastFrame) * this.frameRate
            for (const key in this.carSpawnTimer) {
                this.carSpawnTimer[key] += delta
            }
            this.lastFrame = currentFrame
        }

        //spawn cars
        this.spawnCars('first', { x: -100, y: 600 }, 1, 100)
        this.spawnCars('second', { x: 700, y: 550 }, -1, 120)
        this.spawnCars('third', { x: -100, y: 500 }, 1, 130)
        this.spawnCars('fourth', { x: 700, y: 450 }, -1, 100)
        this.spawnCars('fifth', { x: -100, y: 400 }, 1, 120)
        this.cars = this.cars.filter(car => car.isAlive)

        //clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //check collisions
        this.cars.forEach(car => { car.move(delta) })
        this.checkCollisions()

        //draw
        this.draw()

        requestAnimationFrame(this.gameLoop)
    }
}

const game = new Game()

export default game