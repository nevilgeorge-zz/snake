var React = require('react');
var ReactPropTypes = React.PropTypes;

var BoardSquare = React.createClass({

	propTypes: {
		side: ReactPropTypes.number.isRequired
	},

	getInitialState: function () {
		return {

		}
	},

	render: function () {
		var squareStyle = {
			width: this.props.side,
			height: this.props.side
		};

		return (
			<li className="board-square" style={squareStyle}></li>
		);
	}

});

module.exports = BoardSquare;