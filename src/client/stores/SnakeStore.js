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
var BoardStore = require('./BoardStore');
var FoodStore = require('./FoodStore');


/**
 * Constants
 */
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
var _snakes = [];


/**
 * Helper functions
 */
function addSnake (color) {
	var key = _snakes.length;
	var coords = BoardStore.getAvailableVerticalSquares(2);
	_snakes.push({
		key: key,
		coords: coords,
		direction: Directions.UP,
		points: 0,
		color: color
	});
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
	var dimensions = BoardStore.getDimensions();
	var xMax = dimensions.xMax,
	    yMax = dimensions.yMax;
	var head,
	    newHead;
	for (var i=0; i<_snakes.length; i++) {
		head = _snakes[i].coords[0];
		switch (_snakes[i].direction) {
			case Directions.UP:
				newHead.x = head.x;
				if (head.y === 0) newHead.y = yMax - 1;
				else newHead.y = head.y - 1;
				break;
			case Directions.RIGHT:
				if (head.x === xMax - 1) newHead.x = 0;
				else newHead.x = head.x + 1;
				break;
			case Directions.DOWN:
				newHead.x = head.x;
				if (head.y === yMax - 1) newHead.y = 0;
				else newHead.y = head.y + 1;
				break;
			case Directions.LEFT:
				if (head.x === 0) newHead.x = xMax - 1;
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
			var food = FoodStore.getFood();
			for (var j=0; j<food.length; j++) {
				if (head.x === food[j].x && head.y === food[j].y) {
					_snakes[i].points += 1;
					FoodStore.removeFood(j);
					FoodStore.addFood();
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
 * Flux Board Store
 */
var SnakeStore = assign({}, EventEmitter.prototype, {
	
	getSnakes: function () {
		return _snakes;
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
SnakeStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {

		case SnakeGameConstants.ADD_SNAKE:
			addSnake(action.color);
			SnakeStore.emitChange();
			break;

		case SnakeGameConstants.CHANGE_DIRECTION:
			changeDirection(action.key, action.direction);
			SnakeStore.emitChange();
			break;

		case SnakeGameConstants.END_GAME:
			break;

		case SnakeGameConstants.REMOVE_FOOD:
			break;

		case SnakeGameConstants.REMOVE_SNAKE:
			removeSnake(action.key);
			SnakeStore.emitChange();
			break;

		case SnakeGameConstants.SPAWN_FOOD:
			break;

		case SnakeGameConstants.START_GAME:
			break;

	}
});

/**
 * Export module
 */
module.exports = SnakeStore;