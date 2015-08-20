// React dependencies
var React = require('react');
var SnakeGameActions = require('../actions/SnakeGameActions');
var GameStore = require('../stores/GameStore');
var SnakeStore = require('../stores/SnakeStore');

// Constants
var KEYS = {left: 37, up: 38, right: 39, down: 40};


// Helper functions
function getGameStoreState() {
	return GameStore.getGameState();
}


// Component class creation
var SnakeGame = React.createClass({

	getInitialState: function() {
		var snakesFromStore = SnakeStore.getSnakes();
		var starts = [],
		    snakes = [],
		    growths = [],
		    board = [];
		for (var i=0; i<snakesFromStore.length; i++) {
			// starts[i] = this.props.startIndices[i] || snakesFromStore[i];
			starts[i] = snakesFromStore[i];
			snakes[i] = [starts[i]];
			growths[i] = 0;
			board[starts[i]] = i+1;
		}
		var gameState = getGameStoreState();
		return {
			snakes: snakes,
			board: board,
			growths: growths,
			paused: gameState.paused,
			gameOver: gameState.gameOver,
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
		var snakes = this.state.snakes;
		var board = this.state.board;
		var growths = this.state.growths;
		var direction = this.state.direction;

		var numRows = this.props.numRows || 18;
		var numCols = this.props.numCols || 38;

		var head,
		    needsFood;
		for (var i=0; i<snakes.length; i++) {
			head = SnakeStore.getNextIndex(snakes[i][0], direction, numRows, numCols);

			if (SnakeStore.hasCollided(snakes, head)) {
				this.setState({gameOver: true});
				return;
			}

                                   // FOOD = snakes.length+1
			needsFood = board[head] == snakes.length+1 || snakes[i].length == 1;
			if (needsFood) {
				var ii, numCells = numRows * numCols;
				do { ii = Math.floor(Math.random() * numCells); } while (board[ii]);
				board[ii] = snakes.length+1; // FOOD = snakes.length+1
				growths[i] += 2;
			} else if (growths[i]) {
				growths[i] -= 1;
			} else {
				board[snakes[i].pop()] = null;
			}

			snakes[i].unshift(head);
			board[head] = i+1;

			if (this._nextDirection) {
				direction = this._nextDirection;
				this._nextDirection = null;
			}
		}

		this.setState({
			snakes: snakes,
			board: board,
			growths: growths,
			direction: direction
		});

		setTimeout(this._tick, 100);
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

		var numRows = this.props.numRows || 18; // big: 18
		var numCols = this.props.numCols || 38; // big: 38
		var cellSize = this.props.cellSize || 30;
		var snakes = this.state.snakes;

		for (var row = 0; row < numRows; row++) {
			for (var col = 0; col < numCols; col++) {
				var code = this.state.board[numCols * row + col];
				var type;
				if (code > 0 && code < snakes.length+1) {
					type = 'body-'+code;
				} else if (code === snakes.length+1) {
					type = 'food';
				} else {
					type = 'null';
				}
				cells.push(<div key={numCols*row+col} className={type + '-cell'} />);
			}
		}
		for (var i=0; i<snakes.length; i++) {
			snakePoints.push(<li>Snake {i+1}: {this.state.snakes[i].length}</li>);
		}
		return (
			<div className="snake-game">
				<h1 className="snake-score">
					<ul>
						{snakePoints}
					</ul>
				</h1>
				<div
					ref="board"
					className={'snake-board' + (this.state.gameOver ? ' game-over' : '')}
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
