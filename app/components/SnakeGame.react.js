var Board = require('./Board.react');
var React = require('react');

var SnakeGame = React.createClass({

	render: function () {
		return (
			<div>
				<Board />
			</div>
		);
	}

});

module.exports = SnakeGame;