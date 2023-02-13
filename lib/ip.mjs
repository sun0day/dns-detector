import { getRealTime } from './utils.mjs'

export class IP {
  constructor({ server, time, addr, received = 0, resolveTime }) {
    this.addr = addr
    this.server = server
    this.time = time
    this.received = received
    this.resolveTime = resolveTime
  }
}

export class IPQueue extends Map {
  getAllIPs() {
    return Array.from(this.values())
  }

  sortByTime() {
    return this.getAllIPs().filter(ip => !!ip.time).sort((next, cur) => getRealTime(next.time) - getRealTime(cur.time))
  }

  sortByResolveTime() {
    return this.getAllIPs().sort((next, cur) => getRealTime(next.resolveTime) - getRealTime(cur.resolveTime))
  }

  groupByServer() {
    const group = {}

    this.sortByResolveTime().forEach(ip => {
      group[ip.server] ??= []
      group[ip.server].push(ip)
    })

    return group
  }
}