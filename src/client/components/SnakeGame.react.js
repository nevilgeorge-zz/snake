var React = require('react');
var GameInfo = require('./GameInfo.react');
var Board = require('./Board.react');
var SnakeGameActions = require('../actions/SnakeGameActions');

var SnakeGame = React.createClass({

	_onKeyDown: function (event) {
		var direction;
		switch (event.keyCode) {
			case 38:
				direction = "up";
				break;
			case 39:
				direction = "right";
				break;
			case 40:
				direction = "down";
				break;
			case 37:
				direction = "left";
				break;
			default:
				direction = null;
				break;
		}
		if (direction !== null) {
			SnakeGameActions.changeDirection(direction);
		}
	},

	render: function () {
		var self = this;
		$('html').keydown(function(e){
	        self._onKeyDown(e);
	    });
		return (
			<div>
				<GameInfo
				/>
				<Board 
				/>
			</div>
		);
	}

});

module.exports = SnakeGame;