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
			this.setState({players: players});
		}.bind(this));

		socket.on('update:scores', function(scores) {
			this.setState({playerScores: scores});
		}.bind(this));
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

		var playerList = this.state.players.map(function(player, i) {
			return <li key={i}>{player.playerId}</li>;
		});
		return (
			<div>
<<<<<<< HEAD
				<Board/>
				<button disabled={this.state.gameStarted} onClick={this.startGame}>Start</button>
				<ul>{playerList}</ul>
=======
				<GameInfo
				/>
				<Board 
				/>
>>>>>>> master
			</div>
		);
	}

});

module.exports = SnakeGame;
