var React = require('react');
var BoardSquare = require('./BoardSquare.react');
var GameStore = require('../stores/GameStore');

function getBoardState () {
	return {
		boardState: GameStore.getBoard(),
		dimensions: GameStore.getDimensions()
	};
}

var Board = React.createClass({

	getInitialState: function () {
		return getBoardState();
	},

	componentDidMount: function () {
		GameStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function () {
		GameStore.removeChangeListener(this._onChange);
	},


	render: function () {
		console.log('re-rendering');
		var boardState = this.state.boardState;
		var board = [];

		for (var i=0; i<this.state.dimensions.yMax; i++) {
			var rowSquares = [];

			for (var j=0; j<this.state.dimensions.xMax; j++) {
				var square = boardState[(i*this.state.dimensions.xMax) + j];
				console.log(square.type);
				rowSquares.push(
					<BoardSquare
						key={j}
						type={square.type}
						side={this.state.dimensions.side-1}
					/>
				);
			}

			board.push(<li key={i} className="board-row"><ul className="board-row-list">{rowSquares}</ul></li>);
		}

		var boardStyle = {
			marginTop: (window.innerHeight - (this.state.dimensions.side*this.state.dimensions.yMax)) / 2,
			width: (this.state.dimensions.side * this.state.dimensions.xMax) + 1
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
