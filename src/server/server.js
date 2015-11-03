// server.js
'use strict'

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io  = require('socket.io')(http)
const randomColor = require('randomcolor')
const path = require('path')

const Player = require('./models/Player')

const clientSockets = {} // socket -> Player
const scoreTable = {} // playerId -> player.score
const players = []
const playerCount = 1

const SIDE_MAX = 30

app.set('port', 3000)

app.use(express.static(path.join(__dirname + './../client')))

app.get('/', (req, res) => {
  res.sendfile(path.join(__dirname + './../client/index.html'))
})

app.get('/play', (req, res) => {
  res.sendfile(path.join(__dirname + './../client/play.html'))
})

/*
io.on('connection', (socket) => {
  // When new user joins, add player to room.
  console.log('New player #' + playerCount + ' has joined the game.')
  let newPlayer = new Player({
    'playerId': playerCount,
    'score': 0,
    'color': randomColor()
  })
  scoreTable[playerCount] = 0
  clientSockets[socket] = newPlayer
  players.push(newPlayer)
  playerCount += 1
  io.sockets.emit('update:players', players)

  // when user gets a fruit, update player data in all clients
  socket.on('update', (player) => {
    scoreTable[player.playerId] = player.score
    socket.emit('newScore', player)
  })

  // create food when required
  socket.on('nofood', (xMax, yMax) => {
    let coords = {
      x: Math.floor(Math.random() * xMax),
      y: Math.floor(Math.random() * yMax)
    }
    io.sockets.emit('update:food', coords)
  })

  // when user disconnects, remove that user from the score table
  socket.on('disconnect', () => {
    let player = clientSockets[socket]
    delete scoreTable[player.playerId]

    console.log('Player #' + player.playerId + ' has left the game.')
    io.sockets.emit('update:players', players)
  })
})
*/

http.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port') + '.')
})
