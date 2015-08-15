var React = require('react');
var ReactPropTypes = React.PropTypes;

var classNames = require('classnames');

var BoardSquare = React.createClass({

	propTypes: {
		side: ReactPropTypes.number.isRequired,
		isSnake: ReactPropTypes.bool.isRequired,
		isFood: ReactPropTypes.bool.isRequired
	},

	render: function () {
		var squareStyle = {
			width: this.props.side,
			height: this.props.side
		};

		return (
			<li className={classNames({
				'snake-square': this.props.isSnake,
				'food-square': this.props.isFood,
				'board-square': !this.props.isSnake && !this.props.isFood,
			})}
			style={squareStyle}></li>
		);
	}

});

module.exports = BoardSquare;
