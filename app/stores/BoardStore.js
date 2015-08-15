var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _MAX_BOARD_SQUARE_SIDE = 30;
var _numXSquares = Math.ceil(window.innerWidth / _MAX_BOARD_SQUARE_SIDE);
var _squareSide = Math.floor(window.innerWidth / _numXSquares) - 1;
var _numYSquares = Math.floor(window.innerHeight / (_squareSide + 1));
var _numSquares = _numXSquares * _numYSquares;
var _board = [];

var BoardStore = assign({}, EventEmitter.prototype, {

	getSquareSide: function () {
		return _squareSide;
	},

	getNumXSquares: function () {
		return _numXSquares;
	},

	getNumYSquares: function () {
		return _numYSquares;
	},

	getNumSquares: function () {
		return _numSquares;
	},

	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

module.exports = BoardStore;