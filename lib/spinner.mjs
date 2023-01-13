import { SPINNER_FRAME } from "./constant.mjs"

export class Spinner {
  constructor(type) {
    this.tick = 0
    this.frames = SPINNER_FRAME[type]
  }

  text() {
    if (this.tick >= this.frames.length) {
      this.tick = 0
    }
    return this.frames[this.tick++]
  }
}