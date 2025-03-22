import Car from "./Car";
import Flowers from "./Flowers";
import Wood from "./Wood";
import { frog } from "./Frog";
import deadZone from "./DeadZone";

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

class Game {
    //game variables
    frameRate = 1000 / 60
    lastFrame = 0
    startTime: number

    //cars variables
    carsData: { [key: string]: [number] }
    carSpawnTimer: { [key: string]: number } = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    carSpawnIndex: { [key: string]: number } = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    cars: Car[] = []

    //flowers variables
    flowersData: { [key: string]: [number] }
    flowersSpawnTimer: { [key: string]: number } = {
        first: 0, second: 0
    }
    flowersSpawnIndex: { [key: string]: number } = {
        first: 0, second: 0
    }
    flowers: Flowers[] = []

    //wood variables
    woodsData: { [key: string]: [number] }
    woodSpawnTimer: { [key: string]: number } = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    woodSpawnIndex: { [key: string]: number } = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    woods: Wood[] = []

    //other
    frog = frog

    deadZone = deadZone
    async init() {
        console.log("start");
        this.carsData = await this.receiveData("cars")
        this.flowersData = await this.receiveData("flowers")
        this.woodsData = await this.receiveData("woods")

        this.configureCanvas()
        requestAnimationFrame(this.gameLoop)
    }
    receiveData = async (name: string) => {
        const response = await fetch(`../data/${name}.json`)
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

        //wood
        this.woods.forEach(wood => { wood.draw(ctx) })

        //frog
        this.frog.draw(ctx)
    }
    checkCollisions(delta: number) {
        this.cars.forEach(car => {
            car.checkCollisions(this.frog)
        })

        for (let i = 0; i < this.flowers.length; i++) {
            const flowers = this.flowers[i]
            if (flowers.checkCollisions(this.frog, delta)) {
                this.frog.onPlatform = true
                break
            }
            this.frog.onPlatform = false
        }

        if (!this.frog.onPlatform) {
            for (let i = 0; i < this.woods.length; i++) {
                const woods = this.woods[i]
                if (woods.checkCollisions(this.frog, delta)) {
                    this.frog.onPlatform = true
                    break
                }
                this.frog.onPlatform = false
            }
        }

        if (!this.frog.onPlatform) {
            this.deadZone.checkCollisions(this.frog)
        }
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
    spawnWood(row: string, position: { x: number, y: number }, size: number, speed: number) {
        if (this.woodSpawnTimer[row] >= this.woodsData[row][this.woodSpawnIndex[row]]) {
            this.woods.push(new Wood(position.x, position.y, size, 50, "brown", 1, speed))
            this.woodSpawnTimer[row] -= this.woodsData[row][this.woodSpawnIndex[row]]

            this.woodSpawnIndex[row] += 1
            if (this.woodSpawnIndex[row] == 3) {
                this.woodSpawnIndex[row] = 0
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

            //increase woods spawn counter
            for (const key in this.woodSpawnTimer) {
                this.woodSpawnTimer[key] += delta
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

        //spawn woods
        this.spawnWood('first', { x: -150, y: 250 }, 150, 150)
        this.spawnWood('second', { x: -350, y: 200 }, 350, 170)
        this.spawnWood('third', { x: -200, y: 100 }, 200, 150)
        this.flowers = this.flowers.filter(flowers => flowers.isAlive)

        //clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //check collisions
        this.checkCollisions(delta)

        //move objects
        this.cars.forEach(car => { car.move(delta) })
        this.flowers.forEach(flowers => { flowers.move(delta) })
        this.woods.forEach(wood => { wood.move(delta) })

        //draw
        this.draw()

        requestAnimationFrame(this.gameLoop)
    }
}

const game = new Game()

export default game