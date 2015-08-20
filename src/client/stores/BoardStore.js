// Utility dependencies
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');


// Constants
var CHANGE_EVENT = 'change';
var NUM_ROWS = 18;
var NUM_COLS = 18;
var FOOD = 100;


// Private variables
var _board = [];


// Helper functions
function initializeBoard(snakes) {
	for (var i=0; i<snakes.length; i++) {
		_board[snakes[i][0]] = i+1;
	}
}

function addFood(foodPos) {
	_board[foodPos] = FOOD;
}


// Store
var BoardStore = assign({}, EventEmitter.prototype, {

	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},
	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
	getBoard: function () {
		return _board;
	},
	getDimensions: function () {
		return {
			numRows: NUM_ROWS,
			numCols: NUM_COLS
		};
	},
	getInitialBoard: function (snakes) {
		initializeBoard(snakes);
		return this.getBoard();
	},
	setSnakeToNull: function (snake) {
		setSnakeToNull(snake);
	},
	addFood: function (foodPos) {
		addFood(foodPos);
	},
	updateBoard: function (board) {
		_board = board;
	}

});


// Actions
BoardStore.dispatchToken = AppDispatcher.register(function (action) {
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
module.exports = BoardStore;