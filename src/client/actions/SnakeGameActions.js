var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');

var SnakeGameActions = {

	addSnake: function (color) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.ADD_SNAKE,
			color: color
		});
	},
	changeDirection: function (key, direction) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.CHANGE_DIRECTION,
			key: key,
			direction: direction
		});
	},
	endGame: function () {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.END_GAME,
		});
	},
	removeFood: function (key) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.REMOVE_FOOD,
			key: key
		});
	},
	removeSnake: function (key) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.REMOVE_SNAKE,
			key: key
		});
	},
	spawnFood: function (coords) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.SPAWN_FOOD,
			coords: coords
		});
	},
	updatePlayers: function(players) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.UPDATE_PLAYERS,
			players: players
		});
	},
	startGame: function () {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.START_GAME
		});
	}

};

module.exports = SnakeGameActions;
