// Utility dependencies
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');


// Constants
var CHANGE_EVENT = 'change';

// Private variables
_players = [];


// Store
var PlayerStore = assign({}, EventEmitter.prototype, {

	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},
	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
	getPlayers: function () {
		return _players;
	},
	addPlayer: function (player) {
		_players.push(player);
	},
	removePlayer: function (playerID) {
		for (var i=0; i<_players.length; _players++) {
			if (_players[i].id === playerID) {
				_players.splice(i, 1);
			}
		}
	}

});


// Actions
PlayerStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {

		case SnakeGameConstants.NEW_PLAYER:
			var newPlayer = {
				id: _players.length
			}
			PlayerStore.addPlayer(newPlayer);
			PlayerStore.emitChange();
			break;

		case SnakeGameConstants.PLAYER_LEFT:
			PlayerStore.removePlayer(action.playerID);
			PlayerStore.emitChange();
			break;

		case SnakeGameConstants.START_GAME:
			break;

		case SnakeGameConstants.TICK:
			break;

		case SnakeGameConstants.END_GAME:
			break;

		case SnakeGameConstants.CHANGE_DIRECTION:
			break;

		default:
			break;

	}
});


module.exports = PlayerStore;