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


/**
 * Constants
 */
 var SIDE_MAX = 30;
 var BoardSquareTypes = {
 	EMPTY: 'empty',
 	FOOD: 'food',
 	SNAKE: 'snake'
 };
var Directions = {
	UP: 'up',
	RIGHT: 'right',
	DOWN: 'down',
	LEFT: 'left'
};
var CHANGE_EVENT = 'change';


/**
 * Private variables
 */
var _game,
	_snakes = [],
	_players = [],
	_xMax,
    _yMax,
    _side,
	_board = [],
	_food = [];



/**
 * Game Helper functions
 */
function progressGame () {
	moveSnakes();
	updateBoardState();
}

function startGame () {
	_game = setInterval(function () {
		progressGame();
	}, 3000);
}

function endGame () {
	clearInterval(_game);
}

function updatePlayers(players) {
  _players = players;
}


/**
 * Snake Helper functions
 */
function addSnake (color) {
	var key = _snakes.length;
	var coords = getAvailableVerticalSquares(2);
	_snakes.push({
		key: key,
		coords: coords,
		direction: Directions.UP,
		points: 0,
		color: color
	});
	updateBoardState();
}

function removeSnake (key) {
	for (var i=0; i<_snakes.length; i++) {
		if (_snakes[i].key === key) {
			_snakes.splice(i, 1);
			return;
		}
	}
}

function moveSnakes () {
	var head;
	var newHead = {};
	for (var i=0; i<_snakes.length; i++) {
		head = _snakes[i].coords[0];
		switch (_snakes[i].direction) {
			case Directions.UP:
				newHead.x = head.x;
				if (head.y === 0) newHead.y = _yMax - 1;
				else newHead.y = head.y - 1;
				break;
			case Directions.RIGHT:
				if (head.x === _xMax - 1) newHead.x = 0;
				else newHead.x = head.x + 1;
				break;
			case Directions.DOWN:
				newHead.x = head.x;
				if (head.y === _yMax - 1) newHead.y = 0;
				else newHead.y = head.y + 1;
				break;
			case Directions.LEFT:
				if (head.x === 0) newHead.x = _xMax - 1;
				else newHead.x = head.x - 1;
				newHead.y = head.y;
				break;
		}
		_snakes[i].coords.pop();
		_snakes[i].coords.unshift(newHead);
		eat(i);
	}
}

function eat (key) {
	for (var i=0; i<_snakes.length; i++) {
		if (_snakes[i].key === key) {
			var head = _snakes[i].coords[0];
			for (var j=0; j<_food.length; j++) {
				if (head.x === _food[j].x && head.y === _food[j].y) {
					_snakes[i].points += 1;
					removeFood(j);
					addFood();
				}
			}
			return;
		}
	}
}

function changeDirection (key, direction) {
	for (var i=0; i<_snakes.length; i++) {
		if (_snakes[i].key === key) {
			_snakes[i].direction = direction;
		}
	}
}


/**
 * Board Store Helper functions
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

function getAvailableVerticalSquares (numSquares) {
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
}

function updateBoardState () {
    for (var i=0; i<_snakes.length; i++) {
    	for (var j=0; j<_snakes[i].coords.length; j++) {
    		_board[_snakes[i].coords[j].y*_xMax + _snakes[i].coords[j].x].type = BoardSquareTypes.SNAKE;
    	}
    }
    for (var i=0; i<_food.length; i++) {
    	_board[_food[i].y*_xMax + _food[i].x].type = BoardSquareTypes.FOOD;
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
 * Food Store Helper functions
 */
function addFood (coords) {
	var key = _food.length;
	_food.push({
		key: key,
		x: coords[0].x,
		y: coords[0].y,
	});
}

function removeFood (key) {
	for (var i=0; i<_food.length; i++) {
		if (_food[i].key === key) {
			_food.splice(i, 1);
			return;
		}
	}
}


/**
 * Flux Game Store
 */
var GameStore = assign({}, EventEmitter.prototype, {

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
 * Actions from dispather
 */
GameStore.dispatchToken = AppDispatcher.register(function(action) {
	switch (action.actionType) {

		case SnakeGameConstants.ADD_SNAKE:
			addSnake(action.color);
			GameStore.emitChange();
			break;

		case SnakeGameConstants.CHANGE_DIRECTION:
			changeDirection(action.key, action.direction);
			GameStore.emitChange();
			break;

		case SnakeGameConstants.END_GAME:
			endGame();
			GameStore.emitChange();
			break;

		case SnakeGameConstants.REMOVE_FOOD:
			removeFood(action.key);
			GameStore.emitChange();
			break;

		case SnakeGameConstants.REMOVE_SNAKE:
			removeSnake(action.key);
			GameStore.emitChange();
			break;

		case SnakeGameConstants.SPAWN_FOOD:
			addFood(action.coords);
			GameStore.emitChange();
			break;

		case SnakeGameConstants.START_GAME:
			startGame();
			GameStore.emitChange();
			break;

	    case SnakeGameConstants.UPDATE_PLAYERS:
	    	var newPlayer = action.players[action.players.length-1];
	    	addSnake(newPlayer.color);
	      	GameStore.emitChange();
	      	break;
	}
});

/**
 * Export module
 */
module.exports = GameStore;
