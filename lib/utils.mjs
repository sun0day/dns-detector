export function getRealTime(time) {
  return time === 'timeout' ? Infinity : time
}

export function interval(callback, delay) {
  setTimeout(() => {
    callback()
    interval(callback, delay)
  }, delay)
}