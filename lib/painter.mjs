import { getRealTime, sleep } from './utils.mjs'
import { stdout } from './stdout.mjs'
import { Spinner } from './spinner.mjs'
import { COLORS, RESOLVE_STATUS, CHAR } from './constant.mjs'

export class Painter {
  constructor(host) {
    this.host = host
    this.lines = 0
    this.divider = new Array(stdout.columns).fill(' ').join('')
    this.columns = [{
      title: 'IP',
      dataIndex: 'addr',
      render: (addr, ip) => this.color(addr, COLORS.cyan) + (ip.selected ? this.color(`${CHAR.star}`, COLORS.green) : '')
    }, {
      title: 'DNS Server',
      dataIndex: 'server',
    }, {
      title: 'Received(B)',
      dataIndex: 'received',
    }, {
      title: 'Time(ms)↑',
      dataIndex: 'time',
    }, {
      title: 'Latency↑',
      dataIndex: 'time'
    }]

    this.resolveTitle = `${this.color('Resolving <')}${this.color(host, COLORS.yellow)}${this.color('> IP...')}`
    this.resolveSpinner = new Spinner('bouncingBar')

    this.pingTitle = `${this.color('Querying <')}${this.color(host, COLORS.yellow)}${this.color('> IP...')}`
    this.pingSpinner = new Spinner('bouncingBall')

    this.setHeader()

    stdout.on('resize', () => {
      stdout.clearAll()
      this.divider = new Array(stdout.columns).fill(' ').join('')
      this.setHeader()
    })
  }

  async print(ipQueue, resolveStatus, hostSetting) {
    stdout.hideCursor()

    if (this.lines > 0) {
      await stdout.clearLines(this.lines)
    }

    const output = ipQueue.size ? this.renderResolve(ipQueue, resolveStatus).concat(this.renderPing(ipQueue)).concat(this.renderHostSetting(hostSetting)) : this.renderResolve(ipQueue, resolveStatus)
    this.lines = output.length

    stdout.write(output.map(out => this.pad(out, stdout.columns)).join('\n') + '\n' + COLORS.cyan)
  }

  setHeader() {
    this.cellWidth = parseInt(stdout.columns / this.columns.length)
    this.tHeader = this.color(this.columns.reduce((str, col) => str + this.renderCell(col.title), ''))
    this.tDivider = this.color(this.columns.reduce((acc, col) => acc + new Array(this.cellWidth).fill('─').join(''), ''))
  }

  renderResolve(ipQueue, resolveStatus) {
    const serverGroup = ipQueue.groupByServer()
    let titlePrefix = this.color(this.resolveSpinner.text())

    switch (resolveStatus) {
      case RESOLVE_STATUS.SUCCESS:
        titlePrefix = this.color(`[${new Array(4).fill(CHAR.check).join('')}]`, COLORS.green)
        break;
      case RESOLVE_STATUS.FAIL:
        titlePrefix = this.color(`[${new Array(4).fill(CHAR.close).join('')}]`, COLORS.red)
    }

    return [this.divider, `${titlePrefix} ${this.resolveTitle}`, this.divider, ...Object.keys(serverGroup).reduce((acc, server) => {
      const { resolveTime } = serverGroup[server][0]
      const prefix = this.color(`+ ${server} > ${this.color(resolveTime + 'ms', this.getTimeColor(resolveTime))}${this.color(' >>')}`)
      serverGroup[server].reduce((prev, ip, index) => {
        const addr = ip.selected ? this.highlight(ip.addr) : this.color(ip.addr)
        let str = prev + '  ' + addr
        if (this.removeColor(str).length <= stdout.columns) {
          index === serverGroup[server].length - 1 && acc.push(str)
          return str
        } else {
          acc.push(prev)
          return prefix + '  ' + addr
        }
      }, prefix)

      return acc
    }, [])]
  }

  renderPing(ipQueue) {
    this.columns[4].render = (time) => {
      const len = Math.min(Math.round(getRealTime(time) / 10), this.cellWidth - 2)
      return this.color(this.pad('[' + new Array(len).fill(CHAR.block).join(''), this.cellWidth - 1) + ']', this.getTimeColor(time))
    }

    return [this.divider, `${this.color(this.pingSpinner.text())} ${this.pingTitle}`, this.divider, this.tHeader, this.tDivider, ...ipQueue.sortByTime().map((ip, index) => this.renderRow(ip, index))]
  }

  renderHostSetting(hostSetting) {
    return hostSetting.ip ? ['', `${this.color(CHAR.check + ' <')}${this.color(hostSetting.host, COLORS.yellow)}${this.color(`> IP is set to `)}${this.color(hostSetting.ip.addr, COLORS.yellow)} ${this.color('now')}`] : []
  }

  renderRow(ip, index) {
    return this.columns.reduce((str, col) => {
      const value = ip[col.dataIndex]
      return str + this.renderCell(col.render ? col.render(value, ip, index) : this.color(value, COLORS.cyan))
    }, '')
  }

  renderCell(str) {
    return this.pad(str, this.cellWidth)
  }

  pad(str, width, char = ' ') {
    const plainStr = this.removeColor(str.toString())

    return `${str}${new Array(Math.abs(width - plainStr.length)).fill(char).join('')}`
  }

  color(text, colors = COLORS.cyan) {
    const realColors = colors instanceof Array ? colors : [colors]
    realColors.push(COLORS.bright)

    return `${realColors.join('')}${text}${COLORS.reset}`
  }

  removeColor(text) {
    function escape(s) {
      return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    };

    function replaceAll(str, pattern, replacement) {
      return str.replace(new RegExp(escape(pattern), "g"), replacement);
    }

    return Object.values(COLORS).reduce((text, color) => {
      return replaceAll(text, color, '')
    }, text)
  }

  getTimeColor(time) {
    let color = COLORS.green
    const realTime = getRealTime(time)

    if (realTime > 100 && realTime < 200) {
      color = COLORS.yellow
    } else if (realTime > 200) {
      color = COLORS.magenta
    }

    return color
  }

  highlight(text) {
    return this.color(text, [COLORS.reverse, COLORS.cyan])
  }
}