var React = require('react');
var GameInfo = require('./GameInfo.react');
var Board = require('./Board.react');
var SnakeGameActions = require('../actions/SnakeGameActions');

var SnakeGame = React.createClass({

	getInitialState: function() {
		return {
			gameStarted: false,
			players: [],
			playerScores: {}
		};
	},

	startGame: function() {
		SnakeGameActions.startGame();
	},

	componentDidMount: function() {
		var socket = io.connect();

		socket.on('update:players', function(players) {
			console.log(players);
			SnakeGameActions.updatePlayers(players);
			this.setState({players: players});
		}.bind(this));

		socket.on('update:scores', function(scores) {
			this.setState({playerScores: scores});
		}.bind(this));
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

	render: function () {
		var self = this;
		$('html').keydown(function(e){
	        self._onKeyDown(e);
	    });
		return (
			<div>
				<GameInfo/>
				<Board/>
				<button onClick={this.startGame} disabled={this.state.gameStarted}>Start</button>
			</div>
		);
	}

});

module.exports = SnakeGame;
