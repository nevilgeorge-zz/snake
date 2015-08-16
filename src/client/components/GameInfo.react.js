var React = require('react');
var PlayerInfo = require('./PlayerInfo.react');
var SnakeStore = require('../stores/SnakeStore');

function getSnakesState () {
	return {

	};
}

var GameInfo = React.createClass({
	render: function () {
		return (
			<ul>
				<PlayerInfo />
			</ul>
		);
	}
});

module.exports = GameInfo;