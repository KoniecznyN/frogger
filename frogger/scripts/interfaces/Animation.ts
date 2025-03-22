import Frame from "./Frame";

interface Animation {
    frames: Frame[]
    times: number[]
    repeat: boolean
}

export default Animation