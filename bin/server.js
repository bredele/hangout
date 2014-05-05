/**
 * Module settings.
 */

var express = require('express');
var app = express();
var resolve = require('path').resolve;
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);



app.use('/app', express.static(resolve(__dirname, '../build')));

app.set('views',resolve(__dirname, '../views'));
app.set('view engine', 'jade');


module.exports = function(urls, port) {
  app.get('/', function(req, res){
    res.render('hangout', {
      servers: JSON.stringify(urls)
    });
  });

  server.listen(port);
};

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