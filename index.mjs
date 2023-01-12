import { RESOLVE_EVENT } from './lib/constant.mjs'
import { DnsServer } from './lib/server.mjs'
import { Ping, PingQueue } from './lib/ping.mjs'
import { Painter } from './lib/painter.mjs'

async function main() {
  const ips = []
  const pingQueue = new PingQueue()

  const host = 'www.baidu.com'
  const server = new DnsServer()

  server.resolve(host)
  new Painter(host).print(ips)

  server.on(RESOLVE_EVENT.INIT, data => console.log(data))
  server.on(RESOLVE_EVENT.PENDING, data => console.log(data))
  server.on(RESOLVE_EVENT.FULFILLED, data => {
    data.ips.forEach(ip => {
      let ipData = ips.find(ipData => ipData.ip === ip)

      if (ipData) {
        return
      }

      ipData = { server: data.server, ip }

      ips.push(ipData)

      const ping = new Ping(ip)

      ping.onResponse(res => {
        ipData.received ||= 0
        ipData.received += +res.received
        ipData.time = res.time
      })

      pingQueue.add(ping)
    })
  })

  function onExit() {
    pingQueue.exit()
    process.exit(0)
  }

  process.on('exit', onExit)
  process.on('SIGINT', onExit)
  process.on('uncaughtException', err => console.error(err))
}

main()