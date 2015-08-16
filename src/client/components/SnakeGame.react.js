var Board = require('./Board.react');
var React = require('react');
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

	componentDidMount: function() {
		var socket = io.connect();

		socket.on('newPlayer', function(player) {
			SnakeGameActions.addPlayer(player);
		});
	},

	startGame: function() {
			SnakeGameActions.startGame();
	},

	render: function () {
		var self = this;
		$('html').keydown(function(e){
	        self._onKeyDown(e);
	    });
		return (
			<div>
				<Board/>
				<button onClick={this.startGame}>Start</button>
			</div>
		);
	}

});

module.exports = SnakeGame;
