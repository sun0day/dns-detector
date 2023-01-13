import ora from 'ora'
import { getRealTime } from './utils.mjs'
import { stdout } from './stdout.mjs'
import { Spinner } from './spinner.mjs'

export class Painter {
  constructor(host) {
    this.host = host
    this.lines = 0
    this.divider = new Array(stdout.columns).fill(' ').join('')
    this.columns = [{
      title: 'IP',
      dataIndex: 'ip',
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
      dataIndex: 'time'
    }]

    this.resolveTitle = `Resolving <${host}> IP...`
    this.resolveSpinner = new Spinner('bouncingBar')

    this.pingTitle = `Querying <${host}> IP...`
    this.pingSpinner = new Spinner('bouncingBall')

    this.setHeader()

    stdout.on('resize', () => {
      stdout.clearAll()
      this.divider = new Array(stdout.columns).fill(' ').join('')
      this.setHeader()
    })
  }

  print(ips) {
    if (!ips.length) {
      return
    }

    stdout.hideCursor()

    if (this.lines > 0) {
      stdout.clearLines(this.lines)
    }

    const output = this.renderResolve(ips).concat(this.renderPing(ips))
    this.lines = output.length
    stdout.write(output.join('\n') + '\n')
  }

  setHeader() {
    this.cellWidth = parseInt(stdout.columns / this.columns.length)
    this.tHeader = this.columns.reduce((str, col) => str + this.renderCell(col.title), '')
    this.tDivider = this.columns.reduce((acc, col) => acc + new Array(this.cellWidth).fill('─').join(''), '')
  }

  renderResolve(ips) {
    let prevLen = 0
    let prevIndex = 0
    return [this.divider, `${this.resolveSpinner.text()} ${this.resolveTitle}`, this.divider, ...ips.reduce((acc, { ip }, index) => {
      let nextAcc = (acc[prevIndex] || '') + ip + '  '
      if (nextAcc.length > stdout.columns) {
        nextAcc = '>>>>>> ' + ip + '  '
        acc[++prevIndex] = nextAcc
      } else {
        acc[prevIndex] = nextAcc
      }

      return acc
    }, ['>>>>>> '])]
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
      return str + this.renderCell(col.render ? col.render(value, index) : value)
    }, '')
  }

  renderCell(str) {
    str = str.toString()
    return `${str}${new Array(Math.abs(this.cellWidth - str.length)).fill(' ').join('')}`
  }
}