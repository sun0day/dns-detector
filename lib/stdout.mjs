import { stdout } from "node:process"
import { Readline } from 'node:readline/promises'

const rl = new Readline(stdout)

stdout.clearAll = () => stdout.write('\x1Bc')
stdout.hideCursor = () => stdout.write('\u001B[?25l')
stdout.clearLines = (dy) => {
  rl.cursorTo(0)
  rl.moveCursor(0, -dy)
  // rl.clearScreenDown();
  rl.commit()
}

export { stdout }