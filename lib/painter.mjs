import { Readline } from 'node:readline/promises'
import { stdout } from 'node:process'

function interval(callback, delay) {
  setTimeout(() => {
    callback()
    interval(callback, delay)
  }, delay)
}

export class Painter {
  constructor(host) {
    this.host = host
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
    this.title = `Ping ${host} IP...`

    this.setHeader()
    stdout.on('resize', () => {
      stdout.write('\x1Bc')
      this.setHeader()
    })
  }

  print(ips) {
    const rl = new Readline(stdout)
    let lines = 0

    interval(() => {
      ips = ips.filter(ip => ip.time).sort((next, cur) => {
        return this.getRealTime(next.time) - this.getRealTime(cur.time)
      })
      if (ips.length < 1) {
        return
      }
      this.columns[4].render = (time, index) => {
        return new Array(Math.min(Math.round(this.getRealTime(time) / 10), this.cellWidth)).fill('|').join('')
      }

      if (lines > 0) {
        rl.moveCursor(0, -lines)
        rl.commit()
      }

      const output = ['', this.title, '', this.tHeader, this.tDivider, ...ips.map((ip, index) => this.renderRow(ip, index))]
      lines = output.length
      stdout.write(output.join('\n') + '\n')

    }, 1000)
  }

  setHeader() {
    this.cellWidth = parseInt(stdout.columns / this.columns.length)
    this.tHeader = this.columns.reduce((str, col) => str + this.renderCell(col.title), '')
    this.tDivider = this.columns.reduce((acc, col) => acc + new Array(this.cellWidth).fill('─').join(''), '')
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

  getRealTime(time) {
    return time === 'timeout' ? Infinity : time
  }
}