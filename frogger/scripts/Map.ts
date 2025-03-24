import Hedge from "./Hedge"
import Water from "./Water"
import Road from "./Road"
import SafeZone from "./SafeZone"

import { spritesheet } from "./Spritesheet"
import AnimationsMap from "./interfaces/AnimationsMap"

type Cell = Road | Water | SafeZone | null

class Map {
    w: number
    h: number
    unit: number
    layout: Cell[][] = []
    animations: AnimationsMap

    hedgeArr: Hedge[] = []
    waterArr: Water[] = []
    roadArr: Road[] = []
    safeZoneArr: SafeZone[] = []
    constructor(w: number, h: number, unit: number) {
        this.w = w
        this.h = h
        this.unit = unit
    }
    async init() {
        await this.loadSpritesheet()
        this.animations = await this.receiveData("animations")
        this.createBlankMap(this.w, this.h, this.unit)
        this.fillMap()
        console.log(this.hedgeArr);

    }
    receiveData = async (name: string) => {
        const response = await fetch(`../data/${name}.json`)
        const data = await response.json()
        return data

    }
    loadSpritesheet = async () => {
        await spritesheet.loadSpritesheet()
    }
    createBlankMap(w: number, h: number, unit: number) {
        w /= unit
        h /= unit
        for (let i = 0; i < h; i++) {
            let arr = []
            for (let j = 0; j < w; j++) {
                arr.push(null)
            }
            this.layout.push(arr)
        }
    }
    fillMap() {
        for (let i = 0; i < this.layout.length; i++) {
            const column = this.layout[i]
            const flyOn = Math.floor(Math.random() * 5)
            for (let j = 0; j < column.length; j++) {
                if (i == 0 && j * 168 < 700) {
                    const h = new Hedge(j * 168, i, 168, 100, "green", this.animations, spritesheet.spritesheet, j == flyOn)
                    this.hedgeArr.push(h)
                    column[j] = h
                }
                if (i == 7 || i == 13) {
                    const s = new SafeZone(j * this.unit, i * this.unit, 50, 50, "purple", spritesheet.spritesheet)
                    this.safeZoneArr.push(s)
                    column[j] = s
                }
                if (i == 2 || i == 3 || i == 4 || i == 5 || i == 6) {
                    const w = new Water(j * this.unit, i * this.unit, 50, 50, "#000047")
                    this.waterArr.push(w)
                    column[j] = w
                }
                if (i == 8 || i == 9 || i == 10 || i == 11 || i == 12) {
                    const r = new Road(j * this.unit, i * this.unit, 50, 50, "black")
                    this.roadArr.push(r)
                    column[j] = r
                }
            }
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        for (let i = 0; i < this.layout.length; i++) {
            const column = this.layout[i]
            for (let j = 0; j < column.length; j++) {
                if (column[j] instanceof Road || column[j] instanceof Water || column[j] instanceof SafeZone || column[j] instanceof Hedge) {
                    column[j].draw(ctx)
                }
            }

        }
    }
}

const map = new Map(700, 700, 50)

export { Map, map }