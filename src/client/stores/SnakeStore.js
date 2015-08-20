// Utility dependencies
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');


// Constants
var CHANGE_EVENT = 'change';
var BODY_1 = 1, BODY_2 = 2, FOOD = 3;
var KEYS = {left: 37, up: 38, right: 39, down: 40};
var DIRS = {37: true, 38: true, 39: true, 40: true};


// Private variables
var _snakes = [0, 30, 60, 90, 120];


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

function requiresNewDirection(currDirection, newDirection) {
	var difference = Math.abs(currDirection - newDirection);
	if (DIRS[newDirection] && difference !== 0 && difference !== 2) {
		return true;
	}
	return false;
}

function hasCollided(snakes, head) {
	for (var i=0; i<snakes.length; i++) {
		if (snakes[i].indexOf(head) != -1) {
			return true;
		}
	}
	return false;
}


// Store
var SnakeStore = assign({}, EventEmitter.prototype, {

	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},
	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
	getSnakes: function () {
		return _snakes;
	},
	getNextIndex: function (head, direction, numRows, numCols) {
		return getNextIndex(head, direction, numRows, numCols);
	},
	requiresNewDirection: function (currDirection, newDirection) {
		return requiresNewDirection(currDirection, newDirection);
	},
	hasCollided: function (snakes, head) {
		return hasCollided(snakes, head);
	}

});


// Actions
SnakeStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {

		case SnakeGameConstants.PAUSE_GAME:
			break;

		case SnakeGameConstants.RESUME_GAME:
			break;

		case SnakeGameConstants.RESET_GAME:
			break;

		default:
			break;

	}
});


// Module export
module.exports = SnakeStore;



