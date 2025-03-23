class Spritesheet {
    spritesheet!: HTMLImageElement

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
}

const spritesheet = new Spritesheet()

export { Spritesheet, spritesheet }