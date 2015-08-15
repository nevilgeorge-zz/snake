var AppDispatcher = require('../dispatcher/AppDispatcher');
var SnakeGameConstants = require('../constants/SnakeGameConstants');

var SnakeGameActions = {

	changeDirection: function (direction) {
		AppDispatcher.dispatch({
			actionType: SnakeGameConstants.CHANGE_DIRECTION,
			direction: direction
		});
	},

};

module.exports = SnakeGameActions;