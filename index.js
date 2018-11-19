const events = require('events')
const util = require('util')
const deepEqual = require('deeper')
const hexBuckets = require('./hexBuckets')

module.exports = Bucket

function Bucket (swarm) {
  if (!(this instanceof Bucket)) return new Bucket(swarm)
  events.EventEmitter.call(this)
  const self = this
  this._swarm = swarm
  const myId = swarm.id.toString('hex')
  let lastResponsibility = {}
  let recalculate = function () {
    let responsibility = calculate(myId, swarm)
    if (deepEqual(lastResponsibility, responsibility)) return
    self.emit('change', responsibility)
    lastResponsibility = responsibility

  }
  swarm.on('connection', recalculate)
  swarm.on('connection-closed', recalculate)
  swarm.on('drop', recalculate)
}

util.inherits(Bucket, events.EventEmitter)

function calculate (myId, swarm) {
  let peerIds = Object.keys(swarm._peersIds)
  peerIds.push(myId)
  let order = peerIds.sort()
  let index = order.indexOf(myId) + 1

  let slice = Math.round(index / order.length)
  let length = order.length
  let range = hexBuckets(index, length)
  let details = { index, length, range }
  return details
}
