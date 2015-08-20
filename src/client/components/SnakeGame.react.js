// React dependencies
var React = require('react');
var SnakeGameActions = require('../actions/SnakeGameActions');
var SnakeGameStore = require('../stores/SnakeGameStore');

// Constants
var BODY = 1, FOOD = 2;
var KEYS = {left: 37, up: 38, right: 39, down: 40};
var DIRS = {37: true, 38: true, 39: true, 40: true};


// Helper functions
function getSnakeGameStoreState() {
	return SnakeGameStore.getGameState();
}


// Component class creation
var SnakeGame = React.createClass({

	getInitialState: function() {
		var start_1 = this.props.startIndex_1 || 21,
		    start_2 = this.props.startIndex_2 || 41;
		var snake_1 = [start_1],
		    snake_2 = [start_2];

		var board = [];
		board[start_1] = BODY;
		board[start_2] = BODY;
		var gameState = getSnakeGameStoreState();
		return {
			snakes: [snake_1, snake_2],
			board: board,
			growths: [0, 0],
			paused: gameState.paused,
			gameOver: gameState.gameOver,
			direction: KEYS.right
		}
	},

	componentDidMount: function() {
		SnakeGameStore.addChangeListener(this._onChange);
		this._focus();
	},

	componentWillUnmount: function () {
		SnakeGameStore.removeChangeListener(this._onChange);
	},

	_onChange: function () {
		var gameState = getSnakeGameStoreState();
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

		var numRows = this.props.numRows || 15;
		var numCols = this.props.numCols || 15;

		var head,
		    needsFood;
		for (var i=0; i<snakes.length; i++) {
			head = SnakeGameStore.getNextIndex(snakes[i][0], direction, numRows, numCols);

			for (var j=0; j<snakes.length; j++) {
				if (snakes[j].indexOf(head) != -1) {
					this.setState({gameOver: true});
					return;
				}
			}

			needsFood = board[head] == FOOD || snakes[i].length == 1;
			if (needsFood) {
				var ii, numCells = numRows * numCols;
				do { ii = Math.floor(Math.random() * numCells); } while (board[ii]);
				board[ii] = FOOD;
				growths[i] += 2;
			} else if (growths[i]) {
				growths[i] -= 1;
			} else {
				board[snakes[i].pop()] = null;
			}

			snakes[i].unshift(head);
			board[head] = BODY;

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
		var direction = event.nativeEvent.keyCode;
		var difference = Math.abs(this.state.direction - direction);

	    if (DIRS[direction] && difference !== 0 && difference !== 2) {
	    	this._nextDirection = direction;
	    }
	},

	render: function() {
		var cells = [];
		var numRows = this.props.numRows || 15; // big: 18
		var numCols = this.props.numCols || 15; // big: 38
		var cellSize = this.props.cellSize || 30;

		for (var row = 0; row < numRows; row++) {
			for (var col = 0; col < numCols; col++) {
				var code = this.state.board[numCols * row + col];
				var type = code == BODY ? 'body' : code == FOOD ? 'food' : 'null';
				cells.push(<div key={numCols*row+col} className={type + '-cell'} />);
			}
		}

		return (
			<div className="snake-game">
				<h1 className="snake-score">
					<span>Length 1: {this.state.snakes[0].length}</span>
					<span>Length 2: {this.state.snakes[1].length}</span>
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
