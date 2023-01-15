import { stdout } from "node:process"
import { Readline } from 'node:readline/promises'
import { COLORS } from "./constant.mjs"

const rl = new Readline(stdout)

stdout.clearAll = () => stdout.write('\x1Bc')
stdout.showCursor = () => stdout.write('\u001B[?25h')
stdout.hideCursor = () => stdout.write('\u001B[?25l')
stdout.clearLines = (dy) => {
  rl.cursorTo(0)
  rl.moveCursor(0, -dy)
  // rl.clearScreenDown();
  rl.commit()
}

stdout.error = (err) => stdout.write('dns-detector: ' + COLORS.red + err)

export { stdout }