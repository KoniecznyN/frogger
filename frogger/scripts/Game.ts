import Car from "./Car";
import Flowers from "./Flowers";
import Wood from "./Wood";
import { Map, map } from "./Map";
import Frog from "./Frog";

import Data from "./interfaces/Data";
import Counter from "./interfaces/Counter";
import AnimationsMap from "./interfaces/AnimationsMap";
import { spritesheet } from "./Spritesheet";

const leftContainer = document.getElementById("leftContainer")
const middleContainer = document.getElementById("middleContainer")
const rightContainer = document.getElementById("rightContainer")

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
const timer = document.getElementById("timer")
const filler = document.getElementById("filler")

const lifesCanvas = document.getElementById("lifes") as HTMLCanvasElement
const lifesCtx = lifesCanvas.getContext("2d") as CanvasRenderingContext2D

const points = document.getElementById("points")

const end = document.getElementById("end")
const score = document.getElementById("score")

class Game {
    //game variables
    frameRate = 1000 / 60
    lastFrame = 0
    startTime: number
    gameTime: number = 90000

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
    map: Map = map
    hedge = map.hedgeArr
    water = map.waterArr
    road = map.roadArr
    safeZones = map.safeZoneArr
    async init() {
        //create map
        map.init()

        //receive game data
        this.carsData = await this.receiveData("cars")
        this.flowersData = await this.receiveData("flowers")
        this.woodsData = await this.receiveData("woods")
        this.animationsData = await this.receiveData("animations")

        //load spritesheet
        await this.loadSpritesheet()

        //configure game
        this.createPlayer()
        this.configureCanvas(canvas, ctx, 700, 700)
        this.configureCanvas(lifesCanvas, lifesCtx, 125, 25)

        //start game
        requestAnimationFrame(this.gameLoop)
    }
    receiveData = async (name: string) => {
        const response = await fetch(`../data/${name}.json`)
        const data = await response.json()
        return data

    }
    loadSpritesheet = async () => {
        await spritesheet.loadSpritesheet()
        this.spritesheet = spritesheet.spritesheet
    }
    configureCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number) {
        canvas.width = width
        canvas.height = height

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    updateTimer(delta: number) {
        this.gameTime -= delta
        filler.style.width = `${(this.gameTime / 90000) * 100}%`
    }
    updatePoints() {
        this.frog.updatePoints()
        points.innerText = `${this.frog.points}`
    }
    updateLifes() {
        for (let i = 0; i < this.frog.lifes; i++) {
            lifesCtx.drawImage(
                this.spritesheet,
                0, 400, 25, 25,
                i * 25, 0, 25, 25
            );
        }
    }
    createPlayer() {
        this.frog = new Frog(350, 650, 50, 50, "green", this.animationsData, this.spritesheet)
    }
    spawnCars(row: string, position: { x: number, y: number }, size: number, direction: number, speed: number, carNumber: number) {
        if (this.carSpawnTimer[row] >= this.carsData[row][this.carSpawnIndex[row]]) {
            this.cars.push(new Car(position.x, position.y, size, 50, "white", direction, speed, this.spritesheet, carNumber))
            this.carSpawnTimer[row] -= this.carsData[row][this.carSpawnIndex[row]]

            this.carSpawnIndex[row] += 1
            if (this.carSpawnIndex[row] == 5) {
                this.carSpawnIndex[row] = 0
            }
        }
    }
    spawnFlowers(row: string, position: { x: number, y: number }, size: number, speed: number) {
        if (this.flowersSpawnTimer[row] >= this.flowersData[row][this.flowersSpawnIndex[row]]) {
            this.flowers.push(new Flowers(position.x, position.y, size, 50, "pink", -1, speed, this.animationsData, this.spritesheet))
            this.flowersSpawnTimer[row] -= this.flowersData[row][this.flowersSpawnIndex[row]]

            this.flowersSpawnIndex[row] += 1
            if (this.flowersSpawnIndex[row] == 4) {
                this.flowersSpawnIndex[row] = 0

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
            this.frog.onHedge = false
            this.frog.onWood = false;
            this.frog.onFlower = false;
            this.frog.inWater = false
            this.frog.hitByCar = false;

            for (let hedge of this.hedge) {
                if (this.frog.collidesWith(hedge)) {
                    this.frog.onHedge = true
                    break
                }
            }

            for (let flower of this.flowers) {
                if (this.frog.collidesWith(flower)) {
                    this.frog.onFlower = true
                    break
                }
            }

            for (let wood of this.woods) {
                if (this.frog.collidesWith(wood)) {
                    this.frog.onWood = true
                    break
                }
            }

            for (let car of this.cars) {
                if (this.frog.collidesWith(car)) {
                    this.frog.hitByCar = true
                    break
                }
            }

            for (let water of this.water) {
                if (this.frog.collidesWith(water)) {
                    this.frog.inWater = true
                    break
                }
            }

            if (this.frog.onHedge) {
                const hedge = this.hedge.find(h => this.frog.collidesWith(h))
                this.frog.reachHedge(hedge)
            }

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

    draw(ctx: CanvasRenderingContext2D) {
        map.draw(ctx)
        this.cars.forEach(car => { car.draw(ctx) });
        this.flowers.forEach(flowers => { flowers.draw(ctx) })
        this.woods.forEach(wood => { wood.draw(ctx) })
        this.frog.draw(ctx)
    }
    updateAnimations(delta: number) {
        this.frog.updateAnimation(delta)
        this.flowers.forEach(flowers => { flowers.updateAnimation(delta) });
        this.hedge.forEach(hedge => { hedge.updateAnimation(delta) })
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
        this.spawnCars('first', { x: -100, y: 600 }, 50, 1, 100, 100)
        this.spawnCars('second', { x: 700, y: 550 }, 50, -1, 120, 0)
        this.spawnCars('third', { x: -100, y: 500 }, 50, 1, 130, 150)
        this.spawnCars('fourth', { x: 700, y: 450 }, 50, -1, 100, 50)
        this.spawnCars('fifth', { x: 700, y: 400 }, 100, -1, 120, 200)
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
        lifesCtx.clearRect(0, 0, lifesCanvas.width, lifesCanvas.height)

        //check collisions
        this.checkCollisions(delta)

        //move objects
        this.cars.forEach(car => { car.move(delta) })
        this.flowers.forEach(flowers => { flowers.move(delta) })
        this.woods.forEach(wood => { wood.move(delta) })

        //draw
        this.updateAnimations(delta)
        this.draw(ctx)

        //update timer and points
        this.updateTimer(delta)
        this.updatePoints()
        this.updateLifes()

        //check if game ends
        if (this.gameTime <= 0 || this.frog.capturedFlies == 4 || this.frog.lifes == 0) {
            this.endGame()
        }

        requestAnimationFrame(this.gameLoop)
    }
    endGame() {
        this.frog.disableMovement()

        leftContainer.style.display = "none"
        middleContainer.style.display = "none"
        rightContainer.style.display = "none"

        end.style.display = "flex"
        score.innerHTML = `${this.frog.points}`
    }
}

const game = new Game()

export default game