// Utility dependencies
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');


// Constants
var CHANGE_EVENT = 'change';
var FOOD = 100;


// Private variables
var _food = [];


// Helper functions
function needsFood(board, nextHead, snake) {
	return (board[nextHead] == FOOD || snake.length == 1);
}

function addFood(dimensions, board) {
	var ii,
	    numCells = dimensions.numRows * dimensions.numCols;

	do { ii = Math.floor(Math.random() * numCells); } while (board[ii]);
	_food.push(ii);

	return ii;
}


// Store
var FoodStore = assign({}, EventEmitter.prototype, {

	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},
	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
	getFood: function () {
		return _food;
	},
	needsFood: function (board, nextHead, snake) {
		return needsFood(board, nextHead, snake);
	},
	addFood: function (dimensions, board) {
		return addFood(dimensions, board);
	}

});


// Actions
FoodStore.dispatchToken = AppDispatcher.register(function (action) {
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
module.exports = FoodStore;