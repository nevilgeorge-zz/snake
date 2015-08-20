// React dependencies
var React = require('react');
var SnakeGameActions = require('../actions/SnakeGameActions');
var GameStore = require('../stores/GameStore');
var BoardStore = require('../stores/BoardStore');
var SnakeStore = require('../stores/SnakeStore');
var FoodStore = require('../stores/FoodStore');

// Constants
var KEYS = {left: 37, up: 38, right: 39, down: 40};
var FOOD = 100;


// Helper functions
function getGameStoreState() {
	return GameStore.getGame();
}

function setSquaresToNull(board, squares) {
	for (var i=0; i<squares.length; i++) {
		board[squares[i]] = null;
	}
	return board;
}


// Component class creation
var SnakeGame = React.createClass({

	getInitialState: function() {
		var snakes = SnakeStore.getSnakes();
		var board = BoardStore.getInitialBoard(snakes);
		var game = GameStore.getGame();

		var growths = [];
		for (var i=0; i<snakes.length; i++) {
			growths[i] = 0;
		}

		return {
			snakes: snakes,
			board: board,
			growths: growths,
			paused: game.paused,
			gameOver: game.gameOver,
			direction: KEYS.right
		}
	},

	componentDidMount: function() {
		GameStore.addChangeListener(this._onChange);
		this._focus();
	},

	componentWillUnmount: function () {
		SnakeGameStore.removeChangeListener(this._onChange);
	},

	_onChange: function () {
		var gameState = getGameStoreState();
		this.setState(
			{
				paused: gameState.paused,
				gameOver: gameState.gameOver,
			}, function () {
				this._tick();
		});
	},

	_reset: function () {
		SnakeGameActions.resetGame();
		this.setState(this.getInitialState());
	},

	_pause: function () {
		if (this.state.gameOver || this.state.paused) { return; }
		SnakeGameActions.pauseGame();
	},

	_resume: function () {
		if (this.state.gameOver || !this.state.paused) { return; }
		SnakeGameActions.resumeGame();
	},

	_focus: function () {
		this.refs.board.getDOMNode().focus();
	},

	_tick: function() {
		if (this.state.paused) { return; }

		var snakes = SnakeStore.getSnakes();
		var board = BoardStore.getBoard();

		var growths = this.state.growths;
		var direction = this.state.direction;

		var dimensions = BoardStore.getDimensions();
		var numRows = this.props.numRows || dimensions.numRows;
		var numCols = this.props.numCols || dimensions.numCols;

		var newHead,
		    needsFood;

		for (var i=0; i<snakes.length; i++) {
			if (snakes[i] !== null) {
				newHead = SnakeStore.getNextIndex(snakes[i][0], direction, numRows, numCols);

				// Collision
				if (SnakeStore.hasCollided(newHead)) {
					board = setSquaresToNull(board, snakes[i]);
					snakes[i] = null;

					BoardStore.updateBoard(board);
					SnakeStore.updateSnakes(snakes);

					if (SnakeStore.snakesAllDied(snakes)) {
						this.setState({gameOver: true});
						return;
					}

					this.setState({
						snakes: snakes,
						board: board
					});

					break;
				}

	            // Eating / Growing
				if (FoodStore.needsFood(board, newHead, snakes[i])) {
					var foodPos = FoodStore.addFood(dimensions, board);
					board[foodPos] = FOOD;
					growths[i] += 2;
				} else if (growths[i]) {
					growths[i] -= 1;
				} else {
					board[snakes[i].pop()] = null;
				}

				snakes[i].unshift(newHead);
				board[newHead] = i+1;

				if (this._nextDirection) {
					direction = this._nextDirection;
					this._nextDirection = null;
				}
			}
		}

		BoardStore.updateBoard(board);
		SnakeStore.updateSnakes(snakes);

		this.setState({
			snakes: snakes,
			board: board,
			growths: growths,
			direction: direction
		});

		setTimeout(this._tick, 100);
		return;
	},

	_handleKey: function(event) {
		var newDirection = event.nativeEvent.keyCode;
	    if (SnakeStore.requiresNewDirection(this.state.direction, newDirection)) {
	    	this._nextDirection = newDirection;
	    }
	},

	render: function() {
		var cells = [],
		    snakePoints = [];

		var dimensions = BoardStore.getDimensions();
		var numRows = this.props.numRows || dimensions.numRows;
		var numCols = this.props.numCols || dimensions.numCols;
		var cellSize = this.props.cellSize || 30;
		var snakes = this.state.snakes;

		for (var row = 0; row < numRows; row++) {
			for (var col = 0; col < numCols; col++) {
				var code = this.state.board[numCols * row + col];
				var type;
				if (code > 0 && code < snakes.length+1) {
					type = 'body-'+code;
				} else if (code === FOOD) {
					type = 'food';
				} else {
					type = 'null';
				}
				cells.push(<div key={numCols*row+col} className={type + '-cell'} />);
			}
		}
		for (var i=0; i<snakes.length; i++) {
			var text;
			if (snakes[i] === null) text = "DQ";
			else text = this.state.snakes[i].length;
			snakePoints.push(<li key={i}
				                 className={'body-' + (i+1)}>
                                 {text}
                             </li>);
		}
		return (
			<div className="game-wrapper">
				<div className="scores">
					<ul>
						{snakePoints}
					</ul>
				</div>
				<div
					ref="board"
					className={'board' + (this.state.gameOver ? ' game-over' : '')}
					tabIndex={0}
					onBlur={this._pause}
					onFocus={this._resume}
					onKeyDown={this._handleKey}
					style={{width: numCols * cellSize, height: numRows * cellSize}}>
					{cells}
				</div>
				<div className="snake-controls">
					{this.state.paused ? <button onClick={this._focus}>Resume</button> : null}
					{this.state.gameOver ? <button onClick={function () {this._reset(); this._focus()}.bind(this)}>New Game</button> : null}
				</div>
			</div>
		);
	}

});

module.exports = SnakeGame;
