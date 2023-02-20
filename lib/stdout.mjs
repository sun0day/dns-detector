import { stdout } from "node:process"
import { Readline } from 'node:readline/promises'
import { emitKeypressEvents } from 'node:readline'
import { COLORS } from "./constant.mjs"

const rl = new Readline(stdout)

stdout.clearAll = () => stdout.write('\x1Bc')
stdout.showCursor = () => stdout.write('\u001B[?25h')
stdout.hideCursor = () => stdout.write('\u001B[?25l')
stdout.clearLines = (dy) => {
  rl.cursorTo(0)
  rl.moveCursor(0, -dy)
  // rl.clearScreenDown();
  return rl.commit()
}

stdout.error = (err) => stdout.write('dns-detector: ' + COLORS.red + err)

export const watchKeypress = (callback) => {
  emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  process.stdin.on('keypress', callback)
}

export { stdout }