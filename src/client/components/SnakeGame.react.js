// React dependencies
var React = require('react');
var SnakeGameActions = require('../actions/SnakeGameActions');
var GameStore = require('../stores/GameStore');
var PlayerStore = require('../stores/PlayerStore');
var BoardStore = require('../stores/BoardStore');
var Board = require('./Board.react');


// Component class creation
var SnakeGame = React.createClass({

	getInitialState: function () {
		BoardStore.initializeBoard();
		var gameState = GameStore.getGameState(),
		    players = PlayerStore.getPlayers(),
		    board = BoardStore.getBoard(),
		    boardDimensions = BoardStore.getDimensions(),
		    boardCellConstants = BoardStore.getCellConstants();
		return {
			gameState: gameState,
			players: players,
			board: board,
			boardDimensions: boardDimensions,
			boardCellConstants: boardCellConstants
		};
	},
	componentDidMount: function () {
		GameStore.addChangeListener(this._onChange);
		PlayerStore.addChangeListener(this._onChange);
		BoardStore.addChangeListener(this._onChange);
		SnakeGameActions.startGame();
		SnakeGameActions.newPlayer();
		setInterval(function () {
			SnakeGameActions.tick();
		}, 100);
	},
	componentWillUnmount: function () {
		GameStore.removeChangeListener(this._onChange);
		PlayerStore.removeChangeListener(this._onChange);
		BoardStore.removeChangeListener(this._onChange);
	},
	_onChange: function () {
		var gameState = GameStore.getGameState();
		var players = PlayerStore.getPlayers();
		var board = BoardStore.getBoard();
		this.setState({
			gameState: gameState,
			players: players,
			board: board
		});
	},
	render: function () {
		return(
			<div className="snake-game">
				{/*<Scores />*/}
				<Board board={this.state.board}
				       dimensions={this.state.boardDimensions}
				       boardCellConstants={this.state.boardCellConstants} />
				{/*<GameControls />*/}
			</div>
		);
	}

});


module.exports = SnakeGame;