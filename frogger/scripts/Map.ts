import { Water, water } from "./Water"
import { Road, road } from "./Road"
import SafeZone from "./SafeZone"

import { spritesheet } from "./Spritesheet"

type Cell = Road | Water | SafeZone | null

class Map {
    w: number
    h: number
    unit: number
    layout: Cell[][] = []

    roadArr: Road[] = []
    waterArr: Water[] = []
    safeZoneArr: SafeZone[] = []
    constructor(w: number, h: number, unit: number) {
        this.w = w
        this.h = h
        this.unit = unit
    }
    async init() {
        await this.loadSpritesheet()
        this.createBlankMap(this.w, this.h, this.unit)
        this.fillMap()
        console.log(this.layout);

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
            for (let j = 0; j < column.length; j++) {
                if (i == 7 || i == 13) {
                    const s = new SafeZone(j * this.unit, i * this.unit, 50, 50, "purple", spritesheet.spritesheet)
                    this.safeZoneArr.push(s)
                    column[j] = s
                }
                if (i == 0 || i == 1 || i == 2 || i == 3 || i == 4 || i == 5 || i == 6) {
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
                if (column[j] instanceof Road || column[j] instanceof Water || column[j] instanceof SafeZone) {
                    column[j].draw(ctx)
                }
            }

        }
    }
}

const map = new Map(700, 700, 50)

export { Map, map }