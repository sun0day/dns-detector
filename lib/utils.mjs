export function getRealTime(time) {
  return time === 'timeout' ? Infinity : time
}

export function interval(callback, time) {
  setTimeout(() => {
    callback()
    interval(callback, time)
  }, time)
}