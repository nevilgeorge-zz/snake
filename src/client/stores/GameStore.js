/**
 * Utilities
 */
 var EventEmitter = require('events').EventEmitter;
 var assign = require('object-assign');


/**
 * React dependencies
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');
var SnakeStore = require('./SnakeStore');


/**
 * Constants
 */
var CHANGE_EVENT = 'change';


/**
 * Private variables
 */
var _game;
var _players = [];

/**
 * Helper functions
 */
function progressGame () {
	SnakeStore.moveSnakes();
}

function startGame () {
  console.log('starting game');
	_game = setInterval(function () {
		progressGame();
	}, 100);
}

function endGame () {
	clearInterval(_game);
}

function updatePlayers(players) {
  _players = players;
}

/**
 * Flux Game Store
 */
var GameStore = assign({}, EventEmitter.prototype, {

	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

});


/**
 * Actions from dispather
 */
GameStore.dispatchToken = AppDispatcher.register(function (action) {
  console.log(action);
	switch (action.actionType) {

		case SnakeGameConstants.ADD_SNAKE:
			break;

		case SnakeGameConstants.CHANGE_DIRECTION:
			break;

		case SnakeGameConstants.END_GAME:
			endGame();
			GameStore.emitChange();
			break;

		case SnakeGameConstants.REMOVE_FOOD:
			break;

		case SnakeGameConstants.REMOVE_SNAKE:
			break;

		case SnakeGameConstants.SPAWN_FOOD:
			break;

		case SnakeGameConstants.START_GAME:
      console.log('starting')
			startGame();
			GameStore.emitChange();
			break;

    case SnakeGameConstants.UPDATE_PLAYERS:
      console.log('updating');
      updatePlayers(action.players);
      BoardStore.emitChange();
      break;
	}
});

/**
 * Export module
 */
module.exports = GameStore;
