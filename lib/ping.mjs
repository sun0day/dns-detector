import { platform } from 'node:os'
import { spawn } from 'node:child_process'

export class Ping {
  constructor(ip) {
    this.ping = spawn('ping', [ip])

    this.ping.stderr.on('data', data => {
      this.exit()
    })
  }

  onResponse(callback) {
    this.ping.stdout.on('data', data => {
      callback(this.parse(data.toString()))
    })
  }

  parse(out) {
    let reg = platform() === 'win32' ? /bytes=(\d+).+time=(\d+)/ : /(\d+)\s*bytes.+time\=(.+)\s*ms/
    const [, received, time] = out.match(reg) || [, '0', 'timeout']
    return { received, time }
  }

  exit() {
    this.ping.kill('SIGINT')
  }

}

export class PingQueue extends Map {
  exit() {
    this.forEach(ping => ping.exit())
  }
}