var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');

var SnakeGameActions = {

	addSnake: function (color) {
		AppDispatcher.dispatch({
			actionType: TodoConstants.ADD_SNAKE,
			color: color
		});
	},
	changeDirection: function (key, direction) {
		AppDispatcher.dispatch({
			actionType: TodoConstants.CHANGE_DIRECTION,
			key: key,
			direction: direction
		});
	},
	endGame: function () {
		AppDispatcher.dispatch({
			actionType: TodoConstants.END_GAME,
		});
	},
	removeFood: function (key) {
		AppDispatcher.dispatch({
			actionType: TodoConstants.REMOVE_FOOD,
			key: key
		});
	},
	removeSnake: function (key) {
		AppDispatcher.dispatch({
			actionType: TodoConstants.REMOVE_SNAKE,
			key: key
		});
	},
	spawnFood: function (coords) {
		AppDispatcher.dispatch({
			actionType: TodoConstants.SPAWN_FOOD,
			coords: coords
		});
	},
	startGame: function () {
		AppDispatcher.dispatch({
			actionType: TodoConstants.START_GAME
		});
	},

};

module.exports = SnakeGameActions;