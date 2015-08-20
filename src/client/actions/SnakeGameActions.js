// React dependencies
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');

// Constants, module export
var SnakeGameActions = {

	pauseGame: function () {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.PAUSE_GAME,
		});
	},

	resumeGame: function () {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.RESUME_GAME,
		});
	},

	resetGame: function () {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.RESET_GAME
		});
	}

};

// Module export
module.exports = SnakeGameActions;