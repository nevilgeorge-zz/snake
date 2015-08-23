// React dependencies
var React = require('react');
var SnakeGameActions = require('../actions/SnakeGameActions');


// Component class creation
var BoardCell = React.createClass({

	getInitialState: function () {
		return {};
	},
	componentDidMount: function () {

	},
	componentWillUnmount: function () {

	},
	_onChange: function () {

	},
	render: function () {
		var classes = "board-cell " + this.props.cellType;
		return (
			<div className={classes}>
			</div>
		);
	}

});


module.exports = BoardCell;