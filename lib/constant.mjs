
export const DNS_SERVER = [
  '1.1.1.1',
  '8.8.8.8',
  '199.85.126.10',
  '208.67.222.222',
  '84.200.69.80',
  '8.26.56.26',
  '64.6.64.6',
  '192.95.54.3',
  '81.218.119.11',
  '114.114.114.114',
  '119.29.29.29',
  '223.5.5.5'
]

export const RESOLVE_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAIL: 'fail'
}

export const RESOLVE_EVENT = {
  INIT: 'init',
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECT: 'reject',
  FINISHED: 'finished'
}

export const SPINNER_FRAME = {
  bouncingBall: [
    "( ●  )",
    "(  ● )",
    "(   ●)",
    "(  ● )",
    "( ●  )",
    "(●   )",
  ],
  bouncingBar: [
    "[    ]",
    "[=   ]",
    "[==  ]",
    "[=== ]",
    "[ ===]",
    "[  ==]",
    "[   =]",
    "[    ]",
    "[   =]",
    "[  ==]",
    "[ ===]",
    "[====]",
    "[=== ]",
    "[==  ]",
    "[=   ]"
  ]
}

export const COLORS = {
  reset: '\x1b[0m',
  reverse: '\x1b[7m',

  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
  magenta: '\x1b[35m',
}

export const ACTION = {
  next: 'next',
  prev: 'prev'
}

export const CHAR = {
  check: '✔',
  close: '×',
  block: '◼',
  star: '★'
}