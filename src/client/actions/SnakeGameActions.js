var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');

var SnakeGameActions = {

	changeDirection: function (direction) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.CHANGE_DIRECTION,
			direction: direction
		});
	},

	updatePlayers: function(players) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.UPDATE_PLAYERS,
			players: players
		});
	},

	startGame: function() {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.START_GAME
		});
	}

};

module.exports = SnakeGameActions;
