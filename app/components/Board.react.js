var React = require('react');
var ReactPropTypes = React.PropTypes;
var BoardStore = require('../stores/BoardStore');

function getBoardState () {
	return {
		squareSide: BoardStore.getSquareSide(),
		numXSquares: BoardStore.getNumXSquares(),
		numYSquares: BoardStore.getNumYSquares(),
		numSquares: BoardStore.getNumSquares()
	}
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

	render: function () {
		var board = [];

		var squareStyle = {
			width: this.state.squareSide-1,
			height: this.state.squareSide-1
		};

		for (var i=0; i<this.state.numYSquares; i++) {
			var rowSquares = [];

			for (var j=0; j<this.state.numXSquares; j++) {
				rowSquares.push(<li className="board-square" style={squareStyle}></li>);
			}

			board.push(<li className="board-row"><ul className="board-row-list">{rowSquares}</ul></li>);
		}

		var boardStyle = {
			marginTop: (window.innerHeight - (this.state.squareSide*this.state.numYSquares)) / 2,
			width: (this.state.squareSide * this.state.numXSquares) + 1
		};

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