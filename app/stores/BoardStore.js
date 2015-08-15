var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Square = require('../../models/Square');

var CHANGE_EVENT = 'change';
var SquareType = {
	EMPTY: 'empty',
	FOOD: 'food',
	SNAKE: 'snake'
};

var Direction = {
	UP: 'up',
	DOWN: 'down',
	LEFT: 'left',
	RIGHT: 'right'
};

var _MAX_BOARD_SQUARE_SIDE = 30;
var _numXSquares = Math.ceil(window.innerWidth / _MAX_BOARD_SQUARE_SIDE);
var _squareSide = Math.floor(window.innerWidth / _numXSquares) - 5;
var _numYSquares = Math.floor(window.innerHeight / (_squareSide + 5));
var _numSquares = _numXSquares * _numYSquares;

var _board = [];
var _foodIndex = _getRandomNumber(_numXSquares * _numYSquares);
var _snakeIndices = []
initBoard();

function _getRandomNumber(max) {
	return Math.floor(Math.random() * max);
}

function initBoard() {
	var max = _numXSquares * _numYSquares;

	_foodIndex = _getRandomNumber(max);
	var head = Math.floor(max / 2);
	_snakeIndices = [head, head+1, head+2];

	for (var i = 0; i < max; i++) {
			_board.push(new Square(SquareType.EMPTY));
	}

	for (var i = 0; i < _snakeIndices.length; i++) {
		_board[_snakeIndices[i]].type = SquareType.SNAKE;
	}

	_board[_foodIndex].type = SquareType.FOOD;
}

function isCollision() {
	var head = _snakeIndices[0];
	for (var i = 1; i < _snakeIndices.length; i++) {
		if (head === _snakeIndices[i]) {
			return true;
		}
	}
	return false;
}

function getNewSnakeIndices() {
		var newIndices = _snakeIndices.map(function(position) {
			return position - _numXSquares;
		});
		_snakeIndices = newIndices;
		return newIndices;
}

function updateBoard() {
		var max = _numXSquares + _numYSquares;
		for (var i = 0; i < max; i++) {
			_board.push(new Square(SquareType.EMPTY));
		}

		for (var i = 0; i < _snakeIndices.length; i++) {
			_board[_snakeIndices[i]].type = SquareType.SNAKE;
		}

		return _board;
}

var BoardStore = assign({}, EventEmitter.prototype, {

	getSquareSide: function () {
		return _squareSide;
	},

	getNumXSquares: function () {
		return _numXSquares;
	},

	getNumYSquares: function () {
		return _numYSquares;
	},

	getNumSquares: function () {
		return _numSquares;
	},

	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	getBoardSquares: function() {
		return _board;
	},

	progressGame: function() {
		var newSnakeIndices = getNewSnakeIndices(_snakeIndices);
		return updateBoard();
	}
});

AppDispatcher.register(function (action) {

	switch (action.actionType) {

	}

});

module.exports = BoardStore;
