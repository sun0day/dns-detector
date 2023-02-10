import { getRealTime } from './utils.mjs'

export class IP {
  constructor({ server, time, addr, received = 0, resolvedTime }) {
    this.addr = addr
    this.server = server
    this.time = time
    this.received = received
    this.resolvedTime = resolvedTime
  }
}

export class IPQueue extends Map {
  getAllIPs() {
    return Array.from(this.values())
  }

  getIPs() {
    return this.getAllIPs().filter(ip => ip.time).sort((next, cur) => getRealTime(next.time) - getRealTime(cur.time))
  }
}