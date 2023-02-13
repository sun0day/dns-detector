export function getRealTime(time) {
  return time === 'timeout' ? Infinity : time
}

export function interval(callback, time) {
  return new Promise(async r => {
    await callback()
    await sleep(time)
    r()
  }).then(() => interval(callback, time))
}

export async function sleep(time) {
  return new Promise(r => {
    setTimeout(r, time)
  })
}