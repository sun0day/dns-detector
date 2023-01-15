# dns-selector

<img src="https://img.shields.io/npm/v/dori.linkedlist"> <img src="https://img.shields.io/npm/dw/dori.linkedlist" > <img src="https://img.shields.io/bundlephobia/minzip/dori.linkedlist?label=minzip">

A nodejs cli tool to resolve host's IPs via DNS protocol and find the lowest latency IP via ping.

## Screenshot

## Requirements

`dns-selector` runs on node@18.x and above.

## Install

```shell
$ npm i -g dns-selector
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

`dns-selector` also embeds some famous DNS servers to help resolve IP address.

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