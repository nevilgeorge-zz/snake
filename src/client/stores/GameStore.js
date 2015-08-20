// Utility dependencies
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');


// Constants
var CHANGE_EVENT = 'change';


// Private variables
var _gameState = {
	paused: true,
	gameOver: false
};


// Helper functions
function pauseGame() {
	_gameState.paused = true;
}

function resumeGame() {
	_gameState.paused = false;
}

function resetGame() {
	_gameState = {
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
	getGameState: function () {
		return _gameState;
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