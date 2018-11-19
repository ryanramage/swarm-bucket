#!/usr/bin/env node

const swarm = require('discovery-swarm')
const getPort = require('get-port')
const bucket = require('./index')
const sw = swarm()

const swarmId = process.argv[2]
const port = process.argv[3]
console.log(swarmId, port)
if (!swarmId) {
  console.log('usage: example.js test0swarm')
  process.exit(1)
}

if (port) start(port)
else getPort().then(p => start(p))

function start (port) {
  sw.listen(port)
  sw.join(swarmId)
  const b = bucket(sw)

  b.on('change', function (responsibility) {
    console.log('I am now responsible for', responsibility)
  })

  process.on('SIGINT', () => {
    console.log('Received SIGINT. Exiting')
    sw.leave(swarmId) // be curtious
    process.exit()
  })
}
