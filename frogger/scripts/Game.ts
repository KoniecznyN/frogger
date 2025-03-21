import Car from "./Car";
import Flowers from "./Flowers";
import { frog } from "./Frog";
import deadZone from "./DeadZone";

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
    carSpawnIndex: { [key: string]: number } = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    cars: Car[] = []

    flowersData: { [key: string]: [number] }
    flowersSpawnTimer: { [key: string]: number } = {
        first: 0, second: 0
    }
    flowersSpawnIndex: { [key: string]: number } = {
        first: 0, second: 0
    }
    flowers: Flowers[] = []

    frog = frog
    frogOnPlatform = false

    deadZone = deadZone
    async init() {
        console.log("start");
        this.carsData = await this.receiveCarsData()
        this.flowersData = await this.receiveFlowersData()

        this.configureCanvas()
        requestAnimationFrame(this.gameLoop)
    }
    receiveCarsData = async () => {
        const response = await fetch("../data/cars.json")
        const data = await response.json()
        return data
    }
    receiveFlowersData = async () => {
        const response = await fetch("../data/flowers.json")
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
        //water
        this.deadZone.draw(ctx)

        //cars
        this.cars.forEach(car => {
            car.draw(ctx)
        });

        //flowers
        this.flowers.forEach(flowers => { flowers.draw(ctx) })

        //frog
        this.frog.draw(ctx)
    }
    checkCollisions(delta: number) {
        this.cars.forEach(car => {
            car.checkCollisions(this.frog)
        })

        this.flowers.forEach(flowers => {
            flowers.checkCollisions(this.frog, delta)
        })


        // if (!this.frogOnPlatform) {
        //     this.deadZone.checkCollisions(this.frog)
        // }
    }
    spawnCars(row: string, position: { x: number, y: number }, direction: number, speed: number) {
        if (this.carSpawnTimer[row] >= this.carsData[row][this.carSpawnIndex[row]]) {
            this.cars.push(new Car(position.x, position.y, 100, 50, "black", direction, speed))
            this.carSpawnTimer[row] -= this.carsData[row][this.carSpawnIndex[row]]

            this.carSpawnIndex[row] += 1
            if (this.carSpawnIndex[row] == 5) {
                this.carSpawnIndex[row] = 0
            }
        }
    }
    spawnFlowers(row: string, position: { x: number, y: number }, size: number, speed: number) {
        if (this.flowersSpawnTimer[row] >= this.flowersData[row][this.flowersSpawnIndex[row]]) {
            this.flowers.push(new Flowers(position.x, position.y, size, 50, "pink", -1, speed))
            this.flowersSpawnTimer[row] -= this.flowersData[row][this.flowersSpawnIndex[row]]

            this.flowersSpawnIndex[row] += 1
            if (this.flowersSpawnIndex[row] == 4) {
                this.flowersSpawnIndex[row] = 0
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

            //increase cars spawn counter
            for (const key in this.carSpawnTimer) {
                this.carSpawnTimer[key] += delta
            }

            //increase flowers spawn counter
            for (const key in this.flowersSpawnTimer) {
                this.flowersSpawnTimer[key] += delta
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

        //spawn flowers
        this.spawnFlowers('first', { x: 700, y: 300 }, 150, 150)
        this.spawnFlowers('second', { x: 700, y: 150 }, 100, 150)
        this.flowers = this.flowers.filter(flowers => flowers.isAlive)

        //clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //check collisions
        this.checkCollisions(delta)

        //move objects
        this.cars.forEach(car => { car.move(delta) })
        this.flowers.forEach(flowers => { flowers.move(delta) })

        //draw
        this.draw()

        requestAnimationFrame(this.gameLoop)
    }
}

const game = new Game()

export default game