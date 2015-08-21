// Utility dependencies
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');


// Constants
var CHANGE_EVENT = 'change';


// Private variables
var _game = {
	paused: true,
	gameOver: false
};
var _winningSnake = null;


// Helper functions
function pauseGame() {
	_game.paused = true;
}

function resumeGame() {
	_game.paused = false;
}

function resetGame() {
	_game = {
		paused: false,
		gameOver: false
	};
}


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
	getGame: function () {
		return _game;
	},
	getWinningSnake: function () {
		return _winningSnake;
	},
	setWinningSnake: function (snake) {
		_winningSnake = snake;
	}

});


// Actions
GameStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {

		case SnakeGameConstants.PAUSE_GAME:
			pauseGame();
			GameStore.emitChange();
			break;

		case SnakeGameConstants.RESUME_GAME:
			resumeGame();
			GameStore.emitChange();
			break;

		case SnakeGameConstants.RESET_GAME:
			resetGame();
			GameStore.emitChange();
			break;

		default:
			break;

	}
});


// Module export
module.exports = GameStore;