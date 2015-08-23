// Utility dependencies
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');
var SnakeGameActions = require('../actions/SnakeGameActions');
var GameStore = require('./GameStore');
var PlayerStore = require('./PlayerStore');


// Constants
var CHANGE_EVENT = 'change';
var NUM_ROWS     = 18;
var NUM_COLS     = 18;
var SNAKES       = [];
var FOOD         = 999;
var EMPTY        = null;
var KEYS         = {left: 37, up: 38, right: 39, down: 40};
var DIRS         = {37: true, 38: true, 39: true, 40: true};

// Private variables
_board = [];
_snakes = [];


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
			numCols: NUM_COLS,
			numCells: NUM_ROWS * NUM_COLS
		};
	},
	getCellConstants: function () {
		return {
			SNAKES: SNAKES,
			FOOD: FOOD,
			EMPTY: EMPTY
		};
	},
	initializeBoard: function () {
		var numCells = NUM_ROWS * NUM_COLS;
		for (var i=0; i<numCells; i++) {
			_board[i] = EMPTY;
		}
	},
	addSnake: function (snakeID) {
		var snakePos,
		    numCells = NUM_ROWS * NUM_COLS;
		do {
			snakePos = Math.floor(Math.random() * numCells);
		} while (_board[snakePos] !== EMPTY);
		_board[snakePos] = snakeID;
		_snakes.push({
			id: snakeID,
			snake: [snakePos],
			direction: KEYS.right,
			growth: 0
		});
		SNAKES.push(snakeID);
	},
	removeSnake: function (snakeID) {
		for (var i=0; i<_snakes.length; i++) {
			if (_snakes[i].id === snakeID) {
				BoardStore.emptySquares(_snakes[i].snake);
				_snakes.splice(i, 1);
				var index = SNAKES.indexOf(snakeID);
				SNAKES.splice(index, 1);
			}
		}
	},
	emptySquares: function (squares) {
		for (var i=0; i<squares.length; i++) {
			_board[squares[i]] = EMPTY;
		}
	},
	tick: function () {
		var newHead,
		    needsFood;
		for (var i=0; i<_snakes.length; i++) {
			newHead = BoardStore.getNextIndex(_snakes[i].snake[0], _snakes[i].direction);

			// Collision
			if (BoardStore.hasCollided(newHead)) {
				BoardStore.removeSnake(_snakes[i].id);
				if (_snakes.length === 0) { // all died
					SnakeGameActions.endGame();
					return;
				}
			}

			// Eating / Growing
			if (BoardStore.needsFood(newHead, _snakes[i].snake)) {
				BoardStore.addFood();
				_snakes[i].growth += 2;
			} else if (_snakes[i].growth > 0) {
				_snakes[i].growth -= 1;
			} else {
				BoardStore.emptySquares([_snakes[i].snake.pop()]);
			}

			// Move forward
			_snakes[i].snake.unshift(newHead);
			_board[newHead] = _snakes[i].id;
		}
	},
	getNextIndex: function (head, direction) {
		var x = head % NUM_COLS;
		var y = Math.floor(head / NUM_COLS);
		switch (direction) {
			case KEYS.up:    y = (y <= 0)          ? NUM_ROWS-1 : y-1; break;
			case KEYS.down:  y = (y >= NUM_ROWS-1) ? 0          : y+1; break;
			case KEYS.left:  x = (x <= 0)          ? NUM_COLS-1 : x-1; break;
			case KEYS.right: x = (x >= NUM_COLS-1) ? 0          : x+1; break;
			default: return;
		}
		return (NUM_COLS * y) + x;
	},
	hasCollided: function (head) {
		for (var i=0; i<_snakes.length; i++) {
			if (_snakes[i].snake.indexOf(head) != -1) {
				return true;
			}
		}
		return false;
	},
	needsFood: function (head, snake) {
		return (_board[head] === FOOD || snake.length == 1);
	},
	addFood: function () {
		var foodPos,
		    numCells = NUM_ROWS * NUM_COLS;
		do {
			foodPos = Math.floor(Math.random() * numCells);
		} while (_board[foodPos] !== EMPTY);
		_board[foodPos] = FOOD;
	},
	changeDirection: function (snakeID, direction) {
		for (var i=0; i<_snakes.length; i++) {
			if (_snakes[i].id === snakeID) {
				_snakes[i].direction = direction;
			}
		}
	}

});


// Actions
BoardStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {

		case SnakeGameConstants.NEW_PLAYER:
			AppDispatcher.waitFor([PlayerStore.dispatchToken]);
			var players = PlayerStore.getPlayers();
			var snakeID = players[players.length - 1];
			BoardStore.addSnake(snakeID);
			BoardStore.emitChange();
			break;

		case SnakeGameConstants.PLAYER_LEFT:
			AppDispatcher.waitFor([PlayerStore.dispatchToken]);
			BoardStore.removeSnake(action.playerID);
			BoardStore.emitChange();
			break;

		case SnakeGameConstants.START_GAME:
			break;

		case SnakeGameConstants.TICK:
			BoardStore.tick();
			BoardStore.emitChange();
			break;

		case SnakeGameConstants.END_GAME:
			break;

		case SnakeGameConstants.CHANGE_DIRECTION:
			BoardStore.changeDirection(action.snakeID, action.direction);
			BoardStore.emitChange();
			break;

		default:
			break;

	}
});


module.exports = BoardStore;