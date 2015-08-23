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
		    boardCellConstants = BoardStore.getCellConstants(),
		    snakeToControl = BoardStore.getSnakeToControl(),
		    possibleDirections = BoardStore.getPossibleDirections();
		return {
			gameState: gameState,
			players: players,
			board: board,
			boardDimensions: boardDimensions,
			boardCellConstants: boardCellConstants,
			snakeToControl: snakeToControl,
			possibleDirections: possibleDirections
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
		var gameState = GameStore.getGameState(),
		    players = PlayerStore.getPlayers(),
		    board = BoardStore.getBoard(),
		    boardDimensions = BoardStore.getDimensions(),
		    boardCellConstants = BoardStore.getCellConstants(),
		    snakeToControl = BoardStore.getSnakeToControl(),
		    possibleDirections = BoardStore.getPossibleDirections();
		this.setState({
			gameState: gameState,
			players: players,
			board: board,
			boardDimensions: boardDimensions,
			boardCellConstants: boardCellConstants,
			snakeToControl: snakeToControl,
			possibleDirections: possibleDirections
		});
	},
	render: function () {
		return(
			<div className="snake-game">
				{/*<Scores />*/}
				<Board board={this.state.board}
				       dimensions={this.state.boardDimensions}
				       boardCellConstants={this.state.boardCellConstants}
				       snakeToControl={this.state.snakeToControl}
				       possibleDirections={this.state.possibleDirections} />
				{/*<GameControls />*/}
			</div>
		);
	}

});


module.exports = SnakeGame;