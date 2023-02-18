import { ACTION } from './constant.mjs'
import { getRealTime } from './utils.mjs'

export class IP {
  constructor({ server, time, addr, received = 0, resolveTime, selected }) {
    this.addr = addr
    this.server = server
    this.time = time
    this.received = received
    this.resolveTime = resolveTime
    this.selected = selected
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

  selectIP(action) {
    const ips = this.sortByResolveTime()

    let index = ips.findIndex(ip => ip.selected)

    switch (action) {
      case ACTION.next:
        ips[(index + 1) % ips.length].selected = true

        if (index > -1) {
          ips[index].selected = false
        }
        break
      case ACTION.prev:
        ips[(index ? index : ips.length) - 1].selected = true

        if (index > -1) {
          ips[index].selected = false
        }
    }
  }

  getSelectedIP() {
    return this.getAllIPs().find(ip => ip.selected)
  }
}