import { COLORS, RESOLVE_EVENT, RESOLVE_STATUS } from './lib/constant.mjs'
import { DnsServer } from './lib/server.mjs'
import { IP, IPQueue } from './lib/ip.mjs'
import { Ping, PingQueue } from './lib/ping.mjs'
import { Painter } from './lib/painter.mjs'
import { interval, sleep } from './lib/utils.mjs'
import { stdout } from './lib/stdout.mjs'

export { COLORS }

export { stdout }

export async function resolve(options) {
  const { host } = options
  const startTime = new Date()
  const ipQueue = new IPQueue()
  const pingQueue = new PingQueue()
  let resolveStatus = RESOLVE_STATUS.PENDING

  const server = new DnsServer(options)
  const painter = new Painter(host)

  server.resolve(host)
  painter.print(ipQueue, resolveStatus)

  interval(() => painter.print(ipQueue, resolveStatus), 100)

  server.on(RESOLVE_EVENT.FULFILLED, data => {
    data.ips.forEach(addr => {
      let ip = ipQueue.get(addr)

      if (ip) {
        return
      }

      ip = new IP({ server: data.server, addr, resolveTime: new Date() - startTime })

      ipQueue.set(addr, ip)

      const ping = new Ping(addr)

      ping.onResponse(res => {
        ip.received ||= 0
        ip.received += +res.received
        ip.time = res.time
      })

      pingQueue.set(addr, ping)
    })
  })

  server.on(RESOLVE_EVENT.FINISHED, async data => {
    resolveStatus = RESOLVE_STATUS.SUCCESS

    if (!ipQueue?.size) {
      resolveStatus = RESOLVE_STATUS.FAIL
      await sleep(100)
      stdout.error(`can not resolve ${host}, please make sure host exists and is reachable\n`)
      process.exit(1)
    }
  })

  function onExit(code) {
    stdout.showCursor()
    pingQueue.exit()

    process.exit(typeof code === 'number' ? code : 0)
  }

  process.on('exit', onExit)
  process.on('SIGINT', onExit)
  process.on('uncaughtException', err => {
    console.error(err)
    onExit(1)
  })
}
