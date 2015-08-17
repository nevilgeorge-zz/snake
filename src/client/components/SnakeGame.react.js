var React = require('react');
var GameInfo = require('./GameInfo.react');
var Board = require('./Board.react');
var SnakeGameActions = require('../actions/SnakeGameActions');

var SnakeGame = React.createClass({

	getInitialState: function() {
		return {
			gameStarted: false,
			players: [],
			currentPlayer: null,
			playerScores: {}
		};
	},

	startGame: function() {
		SnakeGameActions.startGame();
		this.setState({gameStarted: true});
	},

	componentDidMount: function() {
		var socket = io.connect();

		socket.on('update:players', function(players) {
			console.log('Updating players');
			SnakeGameActions.updatePlayers(players);
			this.setState({
				players: players,
				currentPlayer: players[(players.length - 1)]
			});
		}.bind(this));

		socket.on('update:scores', function(scores) {
			console.log('Updating scores');
			this.setState({playerScores: scores});
		}.bind(this));

		socket.on('update:food', function(coords) {
			console.log('Updating food');
			SnakeGameActions.spawnFood(coords);
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
			SnakeGameActions.changeDirection(0, direction);
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
