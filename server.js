// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

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
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);    
  
    // When this user emits, client side: socket.emit('otherevent',some data);
    // setInterval(heartbeat, 100);
    // function heartbeat(){
    //   io.sockets.emit('heartbeat', squadrons);
    // }

    socket.on('start',
      function(data) {
        // Data comes in as whatever was sent, including objects        
        // for (var i = 0; i < data.length; i++){
        //   // console.log(socket.id + "| " + data[i].x + ", " + data[i].y + '| number Ship: ' + i);          
        // }        
        io.sockets.emit('heartbeat', squadrons);


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
        // console.info([data.inertia,data.coordShips])
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