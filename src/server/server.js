// server.js
'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io  = require('socket.io')(http);
var Player = require('./models/Player');

var clientSockets = {}; // socket -> Player
var scoreTable = {}; // playerId -> player.score
var players = [];
var playerCount = 1;

app.use('/', express.static(__dirname + './../client/'));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  // When new user joins, add player to room.
  console.log('New player #' + playerCount + ' has joined the game.');
  var newPlayer = new Player(playerCount, 0);
  scoreTable[playerCount] = 0;
  clientSockets[socket] = newPlayer;
  players.push(newPlayer)
  playerCount += 1;
  io.sockets.emit('update:players', players);

  // when user gets a fruit, update player data in all clients
  socket.on('update', function(player) {
    scoreTable[player.playerId] = player.score;
    socket.emit('update:scores', scoreTable);
  });

  // when user disconnects, remove that user from the score table
  socket.on('disconnect', function() {
    var player = clientSockets[socket];
    delete scoreTable[player.playerId];
    var index = players.indexOf(player);
    players.splice(index, 1);

    console.log('Player #' + player.playerId + ' has left the game.')
    socket.emit('remove', player);
  });
});

http.listen(3000, function() {
  console.log('Listening on port 3000.');
});
