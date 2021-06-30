// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html
var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app);

var squadrons = [];

function Squadron(id, data){
  this.id = id;
  this.coordShips = data.coordShips;
  this.inertia = data.inertia;
  // this.x = x;
  // this.y = y;
  // this.count = count
}

// Using express: http://expressjs.com/
var express = require('express');
var Eureca = require('eureca.io');
var eurecaServer = new Eureca.Server({allow:['setId', 'spawnEnemy', 'kill', 'updateState']});
eurecaServer.attach(server);
// Create the app
// serve static files from the current directory

app.use(express.static(__dirname));
// app.use(express.static('public/game'));

// Set up the server
// process.env.PORT is related to deploying on heroku
// var server = app.listen(process.env.PORT || 3000, listen);

var clients = {};

//detect client connection
eurecaServer.onConnect(function (conn) {
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);
  
  //the getClient method provide a proxy allowing us to call remote client functions
    var remote = eurecaServer.getClient(conn.id);
  
  //register the client
  clients[conn.id] = {id:conn.id, remote:remote}
  
  //here we call setId (defined in the client side)
  remote.setId(conn.id);
});

//detect client disconnection
eurecaServer.onDisconnect(function (conn) {
    console.log('Client disconnected ', conn.id);
  
  var removeId = clients[conn.id].id;
  
  delete clients[conn.id];
  
  for (var c in clients)
  {
    var remote = clients[c].remote;
    
    //here we call kill() method defined in the client side
    remote.kill(conn.id);
  } 
});

eurecaServer.exports.kill = function( id )
{
  //var conn = this.connection;
  remote.kill( id )
}


eurecaServer.exports.handshake = function()
{
  //var conn = this.connection;
  for (var c in clients)
  {
    var remote = clients[c].remote;
    for (var cc in clients)
    {
      //send latest known position
      var x = clients[cc].laststate ? clients[cc].laststate.x:  0;
      var y = clients[cc].laststate ? clients[cc].laststate.y:  0;

      remote.spawnEnemy(clients[cc].id, x, y );   
    }
  }
}

eurecaServer.exports.handleKeys = function (keys) {
  var conn = this.connection;
  var updatedClient = clients[conn.id];
  
  for (var c in clients)
  {
    var remote = clients[c].remote;
    remote.updateState(updatedClient.id, keys);
    
    //keep last known state so we can send it to new connected clients
    clients[c].laststate = keys;
  }
}

// This call back just tells us that the server has started
// function listen() {
//   var host = server.address().address;
//   // var host = '255.255.255.255'
//   var port = server.address().port;
//   console.log('Example app listening at http://' + host + ':' + port);
// }

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);    
    socket.on('start',
      function(data) {

        var squadron;
        for (var q=0; q < squadrons.length; q++){
          if(socket.id == squadrons[q].id){
            squadron = squadrons[q];
          }
        }

        if (!squadron){
          squadron = new Squadron(socket.id, data);
          squadrons.push(squadron);

          io.sockets.emit('createEnemy', {id: socket.id});
        } else {
          squadron.coordShips = data.coordShips;
          squadron.inertia = data.inertia;
        }
        io.sockets.emit('heartbeat', squadrons);
      }
    );
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      for (var q=0; q < squadrons.length; q++){
        if(socket.id == squadrons[q].id){
          squadrons.splice(q, 1);
        }
      }
    });
  }
);

server.listen(3000);