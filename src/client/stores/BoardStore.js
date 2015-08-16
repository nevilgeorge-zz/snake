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
var FoodStore = require('./FoodStore');
var GameStore = require('./GameStore');


/**
 * Constants
 */
var SIDE_MAX = 30;
var BoardSquareTypes = {
	EMPTY: 'empty',
	FOOD: 'food',
	SNAKE: 'snake'
};
var CHANGE_EVENT = 'change';


/**
 * Private variables
 */
var _xMax,
    _yMax,
    _side;
var _board = [];

/**
 * Helper functions
 */
function initializeBoard () {
	_xMax = Math.ceil(window.innerWidth / SIDE_MAX);
	_side = Math.floor(window.innerWidth / _xMax) - 5;
	_yMax = Math.floor(window.innerHeight / (_side + 5));
	for (var i=0; i<_xMax; i++) {
		for (var j=0; j<_yMax; j++) {
			_board.push({
				type: BoardSquareTypes.EMPTY,
				x: i,
				y: j
			});
		}
	}
}
initializeBoard();

function updateBoardState () {
	var snakes = SnakeStore.getSnakes(),
	    food = FoodStore.getFood();
	console.log(snakes);
    for (var i=0; i<snakes.length; i++) {
    	_board[snakes[i].y*xMax + snakes[i].x].type = BoardSquareTypes.SNAKE;
    }
    for (var i=0; i<food.length; i++) {
    	_board[food[i].y*xMax + food[i].x].type = BoardSquareTypes.FOOD;
    }
}

function squareIsEmpty (i) {
	if (i < _board.length-1) {
		return (_board[i].type === BoardSquareTypes.EMPTY);
	}
	return false;
}

function indexToCoord (i) {
	if (i === 0) {
		return {
			x: 0,
			y: 0
		};
	}
	var coord = {};
	coord.y = Math.floor(i / _xMax) - 1;
	coord.x = i - ((coord.y+1)*_xMax);
	return coord;
}

/**
 * Flux Board Store
 */
var BoardStore = assign({}, EventEmitter.prototype, {

	getBoard: function () {
		return _board;
	},

	getDimensions: function () {
		return {
			xMax: _xMax,
			yMax: _yMax,
			side: _side
		};
	},

	getAvailableVerticalSquares: function (numSquares) {
		if (numSquares > 3) {
			return [];
		}
		var found = false,
			indices = [],
		    coords = [];
		while (!found) {
			var base = Math.floor(Math.random() * (_xMax * (_yMax - 3)));
			indices.push(base);
			for (var i=1; i<numSquares; i++) {
				indices.push(base + (i * _xMax));
			}
			found = true;
			for (var i=0; i<indices.length; i++) {
				if (!squareIsEmpty(indices[i])) {
					found = false;
				}
			}
		}
		for (var i=0; i<indices.length; i++) {
			coords.push(indexToCoord(indices[i]));
		}
		return coords;
	},

	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});


/**
 * Actions from dispather
 */
BoardStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {

		case SnakeGameConstants.ADD_SNAKE:
			AppDispatcher.waitFor([SnakeStore.dispatchToken]);
			updateBoardState();
			console.log('hi');
			BoardStore.emitChange();
			break;

		case SnakeGameConstants.CHANGE_DIRECTION:
			AppDispatcher.waitFor([SnakeStore.dispatchToken]);
			updateBoardState();
			BoardStore.emitChange();
			break;

		case SnakeGameConstants.END_GAME:
			break;

		case SnakeGameConstants.REMOVE_FOOD:
			AppDispatcher.waitFor([FoodStore.dispatchToken]);
			updateBoardState();
			BoardStore.emitChange();
			break;

		case SnakeGameConstants.REMOVE_SNAKE:
			AppDispatcher.waitFor([SnakeStore.dispatchToken]);
			updateBoardState();
			BoardStore.emitChange();
			break;

		case SnakeGameConstants.SPAWN_FOOD:
			AppDispatcher.waitFor([FoodStore.dispatchToken]);
			updateBoardState();
			BoardStore.emitChange();
			break;

	}
});

/**
 * Export module
 */
module.exports = BoardStore;
