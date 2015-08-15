var React = require('react');
var BoardSquare = require('./BoardSquare.react');
var BoardStore = require('../stores/BoardStore');

function getBoardState () {
	return {
		squareSide: BoardStore.getSquareSide(),
		numXSquares: BoardStore.getNumXSquares(),
		numYSquares: BoardStore.getNumYSquares(),
		numSquares: BoardStore.getNumSquares(),
		boardSquares: BoardStore.getBoardSquares()
	};
}

var Board = React.createClass({

	getInitialState: function () {
		return getBoardState();
	},

	componentDidMount: function () {
		BoardStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function () {
		BoardStore.removeChangeListener(this._onChange);
	},

	loopGame: function() {
		var that = this;
		setTimeout(function() {
				that.setState({boardSquares: BoardStore.progressGame()});
		}, 600);

	},

	render: function () {
		var board = [];
		var boardSquares = this.state.boardSquares;

		for (var i=0; i<this.state.numYSquares; i++) {
			var rowSquares = [];

			for (var j=0; j<this.state.numXSquares; j++) {
				var square = boardSquares[j * this.state.numYSquares + i];
				rowSquares.push(
					<BoardSquare
						key={j}
						type={square.type}
						side={this.state.squareSide-1}
					/>
				);
			}

			board.push(<li key={i} className="board-row"><ul className="board-row-list">{rowSquares}</ul></li>);
		}

		var boardStyle = {
			marginTop: (window.innerHeight - (this.state.squareSide*this.state.numYSquares)) / 2,
			width: (this.state.squareSide * this.state.numXSquares) + 1
		};

		this.loopGame();

		return (
			<ul className="board" style={boardStyle}>
				{board}
			</ul>
		);
	},

	_onChange: function () {
		this.setState(getBoardState());
	}

});

module.exports = Board;
