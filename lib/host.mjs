import { readFile, writeFile } from "node:fs/promises";


export class HostSetting {
  constructor(host) {
    this.host = host
    this.hostFile = '/etc/hosts'
  }

  async getContent() {
    const content = await readFile(this.hostFile);

    this.content = content.toString().split('\n')
  }

  setHostIP(ip) {
    this.ip = ip;
    this.line = this.content.findIndex(str => !/^\s*#/.test(str) && str.includes(this.host))
    const settingStr = `${ip.addr} ${this.host}`
    if (this.line > -1) {
      this.content[this.line] = settingStr
    } else {
      this.content.push(settingStr)
    }

    return writeFile(this.hostFile, this.content.join('\n'), { mode: 0o777 })
  }
}