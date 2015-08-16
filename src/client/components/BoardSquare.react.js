var React = require('react');
var ReactPropTypes = React.PropTypes;

var classNames = require('classnames');
var SquareType = {
	EMPTY: 'empty',
	FOOD: 'food',
	SNAKE: 'snake'
};

var BoardSquare = React.createClass({

	propTypes: {
		side: ReactPropTypes.number.isRequired,
		type: ReactPropTypes.string.isRequired
	},

	render: function () {
		var squareStyle = {
			width: this.props.side,
			height: this.props.side
		};

		return (
			<li className={classNames({
					'snake-square': this.props.type === SquareType.SNAKE,
					'food-square': this.props.type === SquareType.FOOD,
					'board-square': this.props.type === SquareType.EMPTY
				})}
				style={squareStyle}>
			</li>

		);
	}

});

module.exports = BoardSquare;
