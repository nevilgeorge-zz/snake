// Utility dependencies
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');


// Constants
var CHANGE_EVENT = 'change';
var BODY = 1, FOOD = 2;
var KEYS = {left: 37, up: 38, right: 39, down: 40};
var DIRS = {37: true, 38: true, 39: true, 40: true};


// Private variables
var _gameState = {
	paused: true,
	gameOver: false
};


// Helper functions
function getNextIndex(head, direction, numRows, numCols) {
	var x = head % numCols;
	var y = Math.floor(head / numCols);

	switch (direction) {
		case KEYS.up:    y = (y <= 0)         ? numRows-1 : y-1; break;
		case KEYS.down:  y = (y >= numRows-1) ? 0         : y+1; break;
		case KEYS.left:  x = (x <= 0)         ? numCols-1 : x-1; break;
		case KEYS.right: x = (x >= numCols-1) ? 0         : x+1; break;
		default: return;
	}

	return (numCols * y) + x;
}

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
var SnakeGameStore = assign({}, EventEmitter.prototype, {

	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},
	removeChangeListner: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
	getGameState: function () {
		return _gameState;
	},
	getNextIndex: function (head, direction, numRows, numCols) {
		return getNextIndex(head, direction, numRows, numCols);
	}

});


// Actions
SnakeGameStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {

		case SnakeGameConstants.PAUSE_GAME:
			pauseGame();
			SnakeGameStore.emitChange();
			break;

		case SnakeGameConstants.RESUME_GAME:
			resumeGame();
			SnakeGameStore.emitChange();
			break;

		case SnakeGameConstants.RESET_GAME:
			resetGame();
			SnakeGameStore.emitChange();
			break;

		default:
			break;

	}
});


// Module export
module.exports = SnakeGameStore;