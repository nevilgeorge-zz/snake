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


/**
 * Constants
 */
var CHANGE_EVENT = 'change';


/**
 * Private variables
 */
var _food = [];


/**
 * Helper functions
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
 * Flux Board Store
 */
var FoodStore = assign({}, EventEmitter.prototype, {

	getFood: function () {
		return _food;
	},

	addFood: function (color) {
		addFood(color);
	},

	removeFood: function (key) {
		removeFood(key);
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
FoodStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {

		case SnakeGameConstants.ADD_SNAKE:
			break;

		case SnakeGameConstants.CHANGE_DIRECTION:
			break;

		case SnakeGameConstants.END_GAME:
			break;

		case SnakeGameConstants.REMOVE_FOOD:
			removeFood(action.key);
			FoodStore.emitChange();
			break;

		case SnakeGameConstants.REMOVE_SNAKE:
			break;

		case SnakeGameConstants.SPAWN_FOOD:
			addFood(action.coords);
			FoodStore.emitChange();
			break;

		case SnakeGameConstants.START_GAME:
			break;

	}
});

/**
 * Export module
 */
module.exports = FoodStore;