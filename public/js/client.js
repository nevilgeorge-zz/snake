// client.js

var socket = io();
$('form').submit(function() {
  socket.emit('message', $('#m').val());
  $('#m').val('');
  return false;
});
