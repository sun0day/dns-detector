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
    let reg = /(\d+)\s*bytes.+time\=(.+)\s*ms/
    const [, received, time] = out.match(reg) || [, '0', 'timeout']
    return { received, time }
  }

  exit() {
    this.ping.kill('SIGINT')
  }

}

export class PingQueue {
  constructor() {
    this.queue = []
  }

  add(ping) {
    this.queue.push(ping)
  }

  exit() {
    this.queue.forEach(ping => ping.exit())
  }
}