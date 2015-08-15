var React = require('react');

var SnakeGame = require('./components/SnakeGame.react');

React.render(
	<SnakeGame />,
	document.getElementById('snake-game')
);