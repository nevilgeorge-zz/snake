// React dependencies
var React = require('react');
var SnakeGameActions = require('../actions/SnakeGameActions');
var BoardCell = require('./BoardCell.react');


// Component class creation
var Board = React.createClass({

	getInitialState: function () {
		return {};
	},
	componentDidMount: function () {

	},
	componentWillUnmount: function () {

	},
	render: function () {
		var cellSize = 30,
		    numCells = this.props.dimensions.numCells,
		    cells = [],
		    type;
		for (var cell=0; cell<numCells; cell++) {
			switch (this.props.board[cell]) {
				case this.props.boardCellConstants.EMPTY:
					type = 'null-cell';
					break;
				case this.props.boardCellConstants.FOOD:
					type = 'food-cell';
					break;
				default:
					for (var snake=0; snake<this.props.boardCellConstants.SNAKES.length; snake++) {
						if (this.props.board[cell] === this.props.boardCellConstants.SNAKES[snake]) {
							type = 'body-' + snake + '-cell';
						}
					}
					break;
			}
			cells.push(<BoardCell key={cell} cellType={type} />);
		}
		return (
			<div className="board"
			     style={{width: this.props.dimensions.numCols * cellSize, height: this.props.dimensions.numRows * cellSize}}>
				{cells}
			</div>
		);
	}

});


module.exports = Board;