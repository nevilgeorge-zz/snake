var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SnakeGameConstants = require('../constants/SnakeGameConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

/**
 * Constants, Enums
 */
var _MAX_SQUARE_SIDE_SIZE = 30;

var BoardSquareTypes = {
	EMPTY: 'empty',
	FOOD: 'food',
	SNAKE: 'snake'
};

var Directions = {
	UP: 'up',
	DOWN: 'down',
	LEFT: 'left',
	RIGHT: 'right'
};

/**
 * Initializers
 */
function initBoardDimensions() {
	_numXSquares = Math.ceil(window.innerWidth / _MAX_SQUARE_SIDE_SIZE);
	_squareSide  = Math.floor(window.innerWidth / _numXSquares) - 5;
	_numYSquares = Math.floor(window.innerHeight / (_squareSide + 5));
}

function initBoardState() {
	// initialize all to empty first
	_board = [];
	for (var i=0; i<_numXSquares; i++) {
		for (var j=0; j<_numYSquares; j++) {
			_board.push({
				type: BoardSquareTypes.EMPTY,
				x: i,
				y: j
			});
		}
	}
}

function startGame() {

	// create food and snake indices
	_foodPosition = {
		type: BoardSquareTypes.FOOD,
		x: Math.floor(Math.random() * _numXSquares),
		y: Math.floor(Math.random() * _numYSquares)
	};
	_snakePositions = [
		{
			type: BoardSquareTypes.SNAKE,
			x: Math.floor(_numXSquares / 2),
			y: Math.floor(_numYSquares / 2)
		},
		{
			type: BoardSquareTypes.SNAKE,
			x: Math.floor(_numXSquares / 2) + 1,
			y: Math.floor(_numYSquares / 2)
		},
		{
			type: BoardSquareTypes.SNAKE,
			x: Math.floor(_numXSquares / 2) + 2,
			y: Math.floor(_numYSquares / 2)
		}
	];
	_direction = Directions.LEFT;

	// then update board state
	updateBoardState();

	// start play cycle
	_game = setInterval(function () {
		progressGame();
	}, 100);
}

/**
 * Flux Board Store
 */
var BoardStore = assign({}, EventEmitter.prototype, {

	getBoardState: function() {
		return _board;
	},

	getDimensions: function () {
		return {
			squareSide: _squareSide,
			numXSquares: _numXSquares,
			numYSquares: _numYSquares,
			numSquares: _numXSquares * _numYSquares
		};
	},

	getPlayers: function() {
		return _players;
	},

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
 * Private Variable Initializations
 */
var _numXSquares,
	_numYSquares,
	_squareSide,
	_board,
	_foodPosition,
	_snakePositions,
	_direction,
	_game,
	_players = [];
initBoardDimensions();
initBoardState();



function progressGame() {
	moveSnake();
	updateBoardState();
	// listenToSocket();
}

function updateBoardState() {
	_board[(_foodPosition.y * _numXSquares) + _foodPosition.x].type = BoardSquareTypes.FOOD;
	for (i=0; i<_snakePositions.length; i++) {
		_board[(_snakePositions[i].y * _numXSquares) + _snakePositions[i].x].type = BoardSquareTypes.SNAKE;
	}
	BoardStore.emitChange();
}

function moveSnake() {
	popTail();
	var head = _snakePositions[0];
	var newHeadX,
	    newHeadY;

	switch (_direction) {
		case Directions.UP:
			newHeadX = head.x;
			newHeadY = head.y - 1;
			break;
		case Directions.RIGHT:
			newHeadX = head.x + 1;
			newHeadY = head.y;
			break;
		case Directions.DOWN:
			newHeadX = head.x;
			newHeadY = head.y + 1;
			break;
		case Directions.LEFT:
			newHeadX = head.x - 1;
			newHeadY = head.y;
			break;
	}

	_snakePositions.unshift({
		type: BoardSquareTypes.SNAKE,
		x: newHeadX,
		y: newHeadY
	});
	updateBoardState();
}

// function listenToSocket() {
// 	var socket = io.connect();
// 	socket.on('update:players', function(players) {
// 		console.log(players);
// 	});
//
// 	socket.on('update:scores', function(scores) {
// 		this.setState({playerScores: scores});
// 	});
// }

function popTail() {
	var tail = _snakePositions.pop();
	_board[(tail.y * _numXSquares) + tail.x].type = BoardSquareTypes.EMPTY;
}

function changeDirection(direction) {
	_direction = direction;
}

function updatedPlayers(players) {
	_players = players;
}

AppDispatcher.register(function (action) {

	switch (action.actionType) {
		case SnakeGameConstants.CHANGE_DIRECTION:
			changeDirection(action.direction);
			BoardStore.emitChange();
			break;

		case SnakeGameConstants.UPDATE_PLAYERS:
			updatedPlayers(action.players);
			BoardStore.emitChange();
			break;

		case SnakeGameConstants.START_GAME:
			startGame();
			BoardStore.emitChange();
			break;

		default:
			//no op
	}

});

module.exports = BoardStore;
