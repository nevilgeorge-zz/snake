var Board = require('./Board.react');
var React = require('react');
var SnakeGameActions = require('../actions/SnakeGameActions');

var SnakeGame = React.createClass({

	getInitialState: function() {
		return {
			gameStarted: false,
			playerScores: {}
		};
	},

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

		socket.on('update:players', function(players) {
			SnakeGameActions.updatePlayers(players);
		});

		socket.on('update:scores', function(scores) {
			this.setState({playerScores: scores});
		})
	},

	startGame: function() {
			SnakeGameActions.startGame();
			this.setState({gameStarted: true});
	},

	render: function () {
		var self = this;
		$('html').keydown(function(e){
	        self._onKeyDown(e);
	    });
		return (
			<div>
				<Board/>
				<button disabled={this.state.gameStarted} onClick={this.startGame}>Start</button>
			</div>
		);
	}

});

module.exports = SnakeGame;
