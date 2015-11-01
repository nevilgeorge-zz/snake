// server.js
'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io  = require('socket.io')(http);
const randomColor = require('randomcolor');
const Player = require('./models/Player');

const clientSockets = {}; // socket -> Player
const scoreTable = {}; // playerId -> player.score
const players = [];
const playerCount = 1;

const SIDE_MAX = 30;

app.use('/', express.static(__dirname + './../client/'));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  // When new user joins, add player to room.
  console.log('New player #' + playerCount + ' has joined the game.');
  let newPlayer = new Player({
    'playerId': playerCount,
    'score': 0,
    'color': randomColor()
  });
  scoreTable[playerCount] = 0;
  clientSockets[socket] = newPlayer;
  players.push(newPlayer);
  playerCount += 1;
  io.sockets.emit('update:players', players);

  // when user gets a fruit, update player data in all clients
  socket.on('update', function(player) {
    scoreTable[player.playerId] = player.score;
    socket.emit('newScore', player);
  });

  // create food when required
  socket.on('nofood', function(xMax, yMax) {
    let coords = {
      x: Math.floor(Math.random() * xMax),
      y: Math.floor(Math.random() * yMax)
    };
    io.sockets.emit('update:food', coords);
  });

  // when user disconnects, remove that user from the score table
  socket.on('disconnect', function() {
    let player = clientSockets[socket];
    delete scoreTable[player.playerId];

    console.log('Player #' + player.playerId + ' has left the game.')
    io.sockets.emit('update:players', players);
  });
});

http.listen(3000, function() {
  console.log('Listening on port 3000.');
});
