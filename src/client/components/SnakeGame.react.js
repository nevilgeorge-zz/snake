var Board = require('./Board.react');
var React = require('react');
var SnakeGameActions = require('../actions/SnakeGameActions');

var SnakeGame = React.createClass({

	render: function () {
		$(function(){
		    $('html').keypress(function(e){
		        this._onKeyDown(e);
		    });
		});
		return (
			<div>
				<Board 
				/>
			</div>
		);
	},

	_onKeyDown: function (event) {
		var direction;
		switch (event) {
			case 38:
				direction = "up";
			case 39:
				direction = "right";
				break;
			case 40:
				direction = "down";
				break;
			case 37:
				direction = "left";
				break;
			default:
				direction = null;
		}
		if (direction != null) {
			SnakeGameActions.changeDirection(direction);
			console.log(direction);
		}
	}

});

module.exports = SnakeGame;