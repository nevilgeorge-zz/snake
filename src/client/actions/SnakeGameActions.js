var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');

var SnakeGameActions = {

	changeDirection: function (direction) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.CHANGE_DIRECTION,
			direction: direction
		});
	},

	addPlayer: function(player) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.ADD_PLAYER,
			player: player
		});
	},

	startGame: function() {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.START_GAME
		});
	}

};

module.exports = SnakeGameActions;
