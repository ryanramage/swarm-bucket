const leftPad = require('left-pad')

module.exports = function (index, length) {
  let max = 4096
  let size = Math.round(max / length)
  let _start = size * (index - 1)
  let _end = _start + size

  let start = leftPad(_start.toString(16), 3, '0')
  let end = leftPad(_end.toString(16), 3, '0')
  if (index === 1) start = '0'
  let range = { start }
  if (index < length) range.end = end
  return range
}
