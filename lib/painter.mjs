import { getRealTime, sleep } from './utils.mjs'
import { stdout } from './stdout.mjs'
import { Spinner } from './spinner.mjs'
import { COLORS, RESOLVE_STATUS } from './constant.mjs'

export class Painter {
  constructor(host) {
    this.host = host
    this.lines = 0
    this.divider = new Array(stdout.columns).fill(' ').join('')
    this.columns = [{
      title: 'IP',
      dataIndex: 'addr',
      color: COLORS.cyan
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
      dataIndex: 'time',
      color: this.getTimeColor
    }]

    this.resolveTitle = `${COLORS.bright}${COLORS.cyan}Resolving <${this.renderColor(host, COLORS.yellow)}> IP...`
    this.resolveSpinner = new Spinner('bouncingBar')

    this.pingTitle = `Querying <${this.renderColor(host, COLORS.yellow)}> IP...`
    this.pingSpinner = new Spinner('bouncingBall')

    this.setHeader()

    stdout.on('resize', () => {
      stdout.clearAll()
      this.divider = new Array(stdout.columns).fill(' ').join('')
      this.setHeader()
    })
  }

  async print(ipQueue, resolveStatus) {
    stdout.hideCursor()

    if (this.lines > 0) {
      await stdout.clearLines(this.lines)
    }

    const output = ipQueue.size ? this.renderResolve(ipQueue, resolveStatus).concat(this.renderPing(ipQueue)) : this.renderResolve(ipQueue, resolveStatus)
    this.lines = output.length
    stdout.write(output.join('\n') + '\n' + COLORS.cyan)
  }

  setHeader() {
    this.cellWidth = parseInt(stdout.columns / this.columns.length)
    this.tHeader = this.columns.reduce((str, col) => str + this.renderCell(col.title), '')
    this.tDivider = this.columns.reduce((acc, col) => acc + new Array(this.cellWidth).fill('─').join(''), '')
  }

  renderResolve(ipQueue, resolveStatus) {
    const serverGroup = ipQueue.groupByServer()
    let titlePrefix = this.resolveSpinner.text()

    switch (resolveStatus) {
      case RESOLVE_STATUS.SUCCESS:
        titlePrefix = this.renderColor('[✔✔✔✔]', COLORS.green)
        break;
      case RESOLVE_STATUS.FAIL:
        titlePrefix = this.renderColor('[××××]', COLORS.red)
    }

    return [this.divider, `${titlePrefix} ${this.resolveTitle}`, this.divider, ...Object.keys(serverGroup).reduce((acc, server) => {
      const { resolveTime } = serverGroup[server][0]
      acc.push(`+ ${server} > ${this.renderColor(resolveTime + 'ms', this.getTimeColor(resolveTime))} >> ` + serverGroup[server].map(ip => ip.addr).join('  '))

      return acc
    }, [])]
  }

  renderPing(ipQueue) {
    this.columns[4].render = (time, index) => {
      const len = Math.min(Math.round(getRealTime(time) / 10), this.cellWidth - 2)
      return this.pad('[' + new Array(len).fill('◼').join(''), this.cellWidth - 1) + ']'
    }

    return [this.divider, `${this.pingSpinner.text()} ${this.pingTitle}`, this.divider, this.tHeader, this.tDivider, ...ipQueue.sortByTime().map((ip, index) => this.renderRow(ip, index))]
  }

  renderRow(ip, index) {
    return this.columns.reduce((str, col) => {
      const value = ip[col.dataIndex]
      let color = col.color || ''
      if (typeof color === 'function') {
        color = col.color(value)
      }
      return str + color + this.renderCell(col.render ? col.render(value, index) : value)
    }, '')
  }

  renderCell(str) {
    return this.pad(str, this.cellWidth)
  }

  pad(str, width, char = ' ') {
    str = str.toString()

    return `${str}${new Array(Math.abs(width - str.length)).fill(char).join('')}`
  }

  renderColor(text, color) {
    return `${color}${text}${COLORS.cyan}`
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
}