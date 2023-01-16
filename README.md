<p align='center'>
  <img width="364" alt="image" src="https://user-images.githubusercontent.com/102238922/212551667-435005a1-a9bb-4dab-80e0-47fb832854ad.png">

  <br>
    A tiny nodejs cli tool to resolve host's IPs via DNS protocol and find the lowest latency IP via ping.
  <br>
  <br>
  <img src="https://img.shields.io/npm/v/dns-detector">
  <img alt="node-current" src="https://img.shields.io/node/v/dns-detector">
  <img src="https://img.shields.io/bundlephobia/minzip/dns-detector?label=minzip">
  <img src="https://img.shields.io/badge/platform-darwin%7Clinux%7Cwin32-black" />
  


</p>


## Screenshot


![dns](https://user-images.githubusercontent.com/102238922/212589071-195bffdf-e6a6-499a-b0de-18ebc9cd732e.gif)


## Install

```shell
$ npm i -g dns-detector
```

## Usage

```shell
$ dns --host {your host} --server {DNS server} --timeout {query timeout} --tries {query retry times}
```

## Options

|option|required|default|description
|-----|-----|-----|------|
|--host|:heavy_check_mark:||host you want to resolve|
|--server|||DNS server IP to resolve host
|--timeout||2000|query timeout, same as [nodejs dns resolveroptions.timeout](https://nodejs.org/dist/latest-v18.x/docs/api/dns.html#resolveroptions)
|--tries||4|query timeout, same as [nodejs dns resolveroptions.tries](https://nodejs.org/dist/latest-v18.x/docs/api/dns.html#resolveroptions)

## Embedded DNS Server

`dns-detector` also embeds some famous DNS servers to help resolve IP address.

- 1.1.1.1
- 8.8.8.8
- 199.85.126.10
- 208.67.222.222
- 84.200.69.80
- 8.26.56.26
- 64.6.64.6
- 192.95.54.3
- 81.218.119.11
- 114.114.114.114
- 119.29.29.29
- 223.5.5.5
