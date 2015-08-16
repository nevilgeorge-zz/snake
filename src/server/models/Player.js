// player.js
'use strict';

function Player(args) {
  this.playerId = args.playerId || 0;
  this.score = args.score || 0;
  this.color = args.color || '#FFF';
}

module.exports = Player;
