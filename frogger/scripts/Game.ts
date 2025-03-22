import Car from "./Car";
import Flowers from "./Flowers";
import Wood from "./Wood";
import Frog from "./Frog";
import { road } from "./Road"
import water from "./Water";
import SafeZone from "./SafeZone";

import Data from "./interfaces/Data";
import Counter from "./interfaces/Counter";
import AnimationsMap from "./interfaces/AnimationsMap";

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

class Game {
    //game variables
    frameRate = 1000 / 60
    lastFrame = 0
    startTime: number

    //animations
    animationsData: AnimationsMap
    spritesheet: HTMLImageElement

    //cars variables
    carsData: Data
    carSpawnTimer: Counter = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    carSpawnIndex: Counter = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    cars: Car[] = []

    //flowers variables
    flowersData: Data
    flowersSpawnTimer: Counter = {
        first: 0, second: 0
    }
    flowersSpawnIndex: Counter = {
        first: 0, second: 0
    }
    flowers: Flowers[] = []

    //wood variables
    woodsData: Data
    woodSpawnTimer: Counter = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    woodSpawnIndex: Counter = {
        first: 0, second: 0, third: 0, fourth: 0, fifth: 0
    }
    woods: Wood[] = []

    //other
    frog: Frog
    water = water
    road = road
    safeZones: SafeZone[] = []
    async init() {
        console.log("start");
        this.carsData = await this.receiveData("cars")
        this.flowersData = await this.receiveData("flowers")
        this.woodsData = await this.receiveData("woods")
        this.animationsData = await this.receiveData("animations")

        await this.loadSpritesheet()

        this.createPlayer()
        this.createSafeZones()
        this.configureCanvas()
        requestAnimationFrame(this.gameLoop)
    }
    receiveData = async (name: string) => {
        const response = await fetch(`../data/${name}.json`)
        const data = await response.json()
        return data

    }
    loadSpritesheet = (): Promise<void> => {
        return new Promise((resolve) => {
            const img = new Image()
            img.src = "../src/frogger_spritesheet.png"
            img.onload = () => {
                this.spritesheet = img
                resolve()
            }
        })
    }
    configureCanvas() {
        canvas.width = 700
        canvas.height = 700

        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    createPlayer() {
        this.frog = new Frog(350, 650, 50, 50, "green", this.animationsData, this.spritesheet)
    }
    createSafeZones() {
        this.safeZones.push(new SafeZone(0, 650, 700, 50, "purple", this.spritesheet))
        this.safeZones.push(new SafeZone(0, 350, 700, 50, "purple", this.spritesheet))
    }
    spawnCars(row: string, position: { x: number, y: number }, size: number, direction: number, speed: number, spritesheet: HTMLImageElement, carNumber: number) {
        if (this.carSpawnTimer[row] >= this.carsData[row][this.carSpawnIndex[row]]) {
            this.cars.push(new Car(position.x, position.y, size, 50, "white", direction, speed, spritesheet, carNumber))
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
            if (this.flowersSpawnIndex[row] == 1) {
                this.flowers.forEach(flowers => { flowers.dissapear() })
            } else {
                this.flowers.forEach(flowers => { flowers.appear() })
            }
        }
    }
    spawnWood(row: string, position: { x: number, y: number }, size: number, speed: number) {
        if (this.woodSpawnTimer[row] >= this.woodsData[row][this.woodSpawnIndex[row]]) {
            this.woods.push(new Wood(position.x, position.y, size, 50, "brown", 1, speed, this.spritesheet))
            this.woodSpawnTimer[row] -= this.woodsData[row][this.woodSpawnIndex[row]]

            this.woodSpawnIndex[row] += 1
            if (this.woodSpawnIndex[row] == 3) {
                this.woodSpawnIndex[row] = 0
            }
        }
    }
    checkCollisions(delta: number) {
        if (this.frog.checkCollisions) {
            this.frog.onWood = false;
            this.frog.onFlower = false;
            this.frog.hitByCar = false;

            for (let flower of this.flowers) {
                if (this.frog.collidesWith(flower)) {
                    this.frog.onFlower = true;
                    break;
                }
            }

            for (let wood of this.woods) {
                if (this.frog.collidesWith(wood)) {
                    this.frog.onWood = true;
                    break;
                }
            }

            for (let car of this.cars) {
                if (this.frog.collidesWith(car)) {
                    this.frog.hitByCar = true;
                    break;
                }
            }

            this.frog.inWater = this.frog.collidesWith(this.water)

            if (!this.frog.isDead && (this.frog.hitByCar || (this.frog.inWater && (!this.frog.onWood && !this.frog.onFlower)))) {
                this.frog.die();
            }

            if (this.frog.onWood) {
                const wood = this.woods.find(w => this.frog.collidesWith(w));
                this.frog.follow(delta, wood.direction, wood.speed);
            }

            if (this.frog.onFlower) {
                const flowers = this.flowers.find(f => this.frog.collidesWith(f));
                this.frog.follow(delta, flowers.direction, flowers.speed);
            }
        }
    }

    draw() {
        //water
        this.water.draw(ctx)

        //road
        this.road.draw(ctx)

        //safezones
        this.safeZones.forEach(safeZone => {
            safeZone.draw(ctx)
        })

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
    gameLoop = (timestamp: DOMHighResTimeStamp) => {
        //time management
        let delta = 0
        if (this.startTime === undefined) {
            this.startTime = timestamp
        } else {
            const currentFrame = Math.round((timestamp - this.startTime) / this.frameRate)
            delta = (currentFrame - this.lastFrame) * this.frameRate
            this.lastFrame = currentFrame

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
        }

        //spawn cars
        this.spawnCars('first', { x: -100, y: 600 }, 50, 1, 100, this.spritesheet, 100)
        this.spawnCars('second', { x: 700, y: 550 }, 50, -1, 120, this.spritesheet, 0)
        this.spawnCars('third', { x: -100, y: 500 }, 50, 1, 130, this.spritesheet, 150)
        this.spawnCars('fourth', { x: 700, y: 450 }, 50, -1, 100, this.spritesheet, 50)
        this.spawnCars('fifth', { x: 700, y: 400 }, 100, -1, 120, this.spritesheet, 200)
        this.cars = this.cars.filter(car => car.isAlive)

        //spawn flowers
        this.spawnFlowers('first', { x: 700, y: 300 }, 150, 150)
        this.spawnFlowers('second', { x: 700, y: 150 }, 100, 150)
        this.flowers = this.flowers.filter(flowers => flowers.isAlive)


        //spawn woods
        this.spawnWood('first', { x: -150, y: 250 }, 150, 150)
        this.spawnWood('second', { x: -350, y: 200 }, 350, 170)
        this.spawnWood('third', { x: -200, y: 100 }, 200, 150)
        this.woods = this.woods.filter(wood => wood.isAlive)

        //clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //check collisions
        this.checkCollisions(delta)

        //move objects
        this.cars.forEach(car => { car.move(delta) })
        this.flowers.forEach(flowers => { flowers.move(delta) })
        this.woods.forEach(wood => { wood.move(delta) })


        //draw
        this.frog.updateAnimation(delta)
        this.draw()

        requestAnimationFrame(this.gameLoop)
    }
}

const game = new Game()

export default game