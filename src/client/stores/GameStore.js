// Utility dependencies
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');


// Constants
var CHANGE_EVENT = 'change';

// Private variables
_paused = true;
_gameOver = false;
_winner = {
	snake: null,
	points: null
};


// Store
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
	getGameState: function () {
		return {
			paused: _paused,
			gameOver: _gameOver,
			winner: _winner
		};
	},
	startGame: function () {
		_paused = false;
	},
	pauseGame: function () {
		_paused = true;
	},
	endGame: function () {
		_gameOver = true;
	},
	setWinner: function (winner) {
		_winner.snake = winner.snake;
		_winner.points = winner.points;
	},

});


// Actions
GameStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {

		case SnakeGameConstants.NEW_PLAYER:
			break;

		case SnakeGameConstants.PLAYER_LEFT:
			break;

		case SnakeGameConstants.START_GAME:
			GameStore.startGame();
			GameStore.emitChange();
			break;

		case SnakeGameConstants.TICK:
			break;

		case SnakeGameConstants.END_GAME:
			GameStore.endGame();
			GameStore.emitChange();
			break;

		case SnakeGameConstants.CHANGE_DIRECTION:
			break;

		case SnakeGameConstants.PAUSE_GAME:
			GameStore.pauseGame();
			GameStore.emitChange();
			console.log('pausing');
			break;

		default:
			break;

	}
});


module.exports = GameStore;