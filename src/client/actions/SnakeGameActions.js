// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');

// Constants, module export
var SnakeGameActions = {

	newPlayer: function () {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.NEW_PLAYER
		})
	},
	playerLeft: function (playerID) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.PLAYER_LEFT,
	     	playerID: playerID
		})
	},
	startGame: function () {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.START_GAME
		})
	},
	tick: function () {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.TICK
		})
	},
	endGame: function () {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.END_GAME
		})
	},
	changeDirection: function (snakeID, direction) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.CHANGE_DIRECTION,
			snakeID: snakeID,
			direction: direction
		})
	},

};

// Module export
module.exports = SnakeGameActions;