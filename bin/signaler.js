
/**
 * Modules dependencies.
 * @api private
 */

 var express = require('express');
 var app = express();
 var server = require('http').createServer(app);
 var io = require('socket.io').listen(server, { log: false });
 var resolve = require('path').resolve;


// middlewares

app.use(express.static(resolve(__dirname, '..' ,'app')));


/**
 * Create signaller server with port.
 * 
 * @param  {Number} port
 * @api public
 */

 module.exports = function(port) {
  server.listen(port);
 };

  // create and handle signals
io.sockets
  .on('connection', function (socket) {
    socket.on('join', function(room) {
      var people = io.sockets.clients(room).length;
      socket.join(room);
      if(people) {
        console.log('someone is here!');
        socket.broadcast.emit('slave');
        } else {
          socket.emit('master');
          console.log('room created ', room);
        }
      });

    socket.on('candidate', function(candidate) {
      socket.broadcast.emit('candidate', candidate);
    });

    socket.on('master offer', function(offer) {
      socket.broadcast.emit('master offer', offer);
    });

    socket.on('slave offer', function(offer) {
      socket.broadcast.emit('slave offer', offer);
    });
  });