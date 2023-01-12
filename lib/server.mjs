import { EventEmitter } from 'node:events'
import { Resolver } from 'node:dns/promises'
import { DNS_SERVER, RESOLVE_STATUS, RESOLVE_EVENT } from './constant.mjs'

export class DnsServer extends EventEmitter {
  constructor({ server, timeout = 2000, tries } = {}) {
    super();
    this.timeout = timeout
    this.tries = tries
    this.servers = server ? DNS_SERVER.concat(server) : DNS_SERVER

    this.emit(RESOLVE_EVENT.INIT)
  }

  async resolve(host) {
    const ips = await Promise.allSettled(this.servers.map(async server => {
      const baseParams = { server, host }

      this.emit(RESOLVE_EVENT.PENDING,)

      const resolver = new Resolver({ timeout: this.timeout, tries: this.tries })
      resolver.setServers([server])

      try {
        const ips = await resolver.resolve(host)
        const data = { ...baseParams, ips, error: null }

        this.emit(RESOLVE_EVENT.FULFILLED, data)

        return data
      } catch (error) {
        const data = { ...baseParams, ips: [], error }

        this.emit(RESOLVE_EVENT.REJECT, data)
        return data
      }
    }))

    const data = ips.map(({ value }) => value)

    this.emit(RESOLVE_EVENT.FINISHED, data)

    return data
  }
}