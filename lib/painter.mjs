import { getRealTime } from './utils.mjs'
import { stdout } from './stdout.mjs'
import { Spinner } from './spinner.mjs'
import { COLORS } from './constant.mjs'

export class Painter {
  constructor(host) {
    this.host = host
    this.lines = 0
    this.divider = new Array(stdout.columns).fill(' ').join('')
    this.columns = [{
      title: 'IP',
      dataIndex: 'ip',
      color: COLORS.cyan
    }, {
      title: 'DNS Server',
      dataIndex: 'server',
    }, {
      title: 'Received(B)',
      dataIndex: 'received',
    }, {
      title: 'Time(ms)',
      dataIndex: 'time',
    }, {
      title: 'Latency',
      dataIndex: 'time',
      color: time => {
        let color = COLORS.green
        const realTime = getRealTime(time)

        if (realTime > 100 && realTime < 200) {
          color = COLORS.yellow
        } else if (realTime > 200) {
          color = COLORS.magenta
        }

        return color
      }
    }]

    this.resolveTitle = `${COLORS.bright}${COLORS.cyan}Resolving <${COLORS.yellow}${host}${COLORS.cyan}> IP...`
    this.resolveSpinner = new Spinner('bouncingBar')

    this.pingTitle = `Querying <${COLORS.yellow}${host}${COLORS.cyan}> IP...`
    this.pingSpinner = new Spinner('bouncingBall')

    this.setHeader()

    stdout.on('resize', () => {
      stdout.clearAll()
      this.divider = new Array(stdout.columns).fill(' ').join('')
      this.setHeader()
    })
  }

  print(ips) {
    stdout.hideCursor()

    if (this.lines > 0) {
      stdout.clearLines(this.lines)
    }

    const output = ips.length ? this.renderResolve(ips).concat(this.renderPing(ips)) : this.renderResolve(ips)
    this.lines = output.length
    stdout.write(output.join('\n') + '\n' + COLORS.cyan)
  }

  setHeader() {
    this.cellWidth = parseInt(stdout.columns / this.columns.length)
    this.tHeader = this.columns.reduce((str, col) => str + this.renderCell(col.title), '')
    this.tDivider = this.columns.reduce((acc, col) => acc + new Array(this.cellWidth).fill('─').join(''), '')
  }

  renderResolve(ips) {
    let prevIndex = 0
    return [this.divider, `${this.resolveSpinner.text()} ${this.resolveTitle}`, this.divider, ...ips.reduce((acc, { ip }, index) => {
      let nextAcc = (acc[prevIndex] || '>>>>>> ') + ip + '  '
      if (nextAcc.length > stdout.columns) {
        nextAcc = '>>>>>> ' + ip + '  '
        acc[++prevIndex] = nextAcc
      } else {
        acc[prevIndex] = nextAcc
      }

      return acc
    }, [''])]
  }

  renderPing(ips) {
    this.columns[4].render = (time, index) => {
      return new Array(Math.min(Math.round(getRealTime(time) / 10), this.cellWidth)).fill('|').join('')
    }

    return [this.divider, `${this.pingSpinner.text()} ${this.pingTitle}`, this.divider, this.tHeader, this.tDivider, ...ips.map((ip, index) => this.renderRow(ip, index))]
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
    str = str.toString()
    return `${str}${new Array(Math.abs(this.cellWidth - str.length)).fill(' ').join('')}`
  }
}