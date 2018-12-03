var express = require('express')
var ws = require('ws')
var app = express()
var path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname,'public', 'ws.html'));
})

var players_to_room = {}
var rooms = {};
var room_count = 0;
var max_capacity = 2;
const dangerous_probability = .6;

io.on('connection', function(socket){
  console.log('a user connected');
  // assign room and type
  let p = assign_room(socket);
  socket.join(room_count);
  socket.emit('ptype', p);
  socket.emit('room', room_count);
  socket.on('chat message', function(msg){
    io.to(players_to_room[socket.id]).emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
server.listen(3000, function(){
  console.log('listening on *: 3000')
});


function assign_room(socket)
{
  // room is made and has an empty slot, add police officer
  if(rooms.hasOwnProperty(room_count) &&
    Object.keys(rooms[room_count].players).length < max_capacity){
    var player = {'criminal': false, criminal_type: null, vote: null};
    rooms[room_count].players[socket.id] = player;
  }
  // room is empty or previous room is full, make a new room with criminal
  else{
    room_count += 1;
    let nature = Math.random();
    var player = {'criminal': true, criminal_type: "dangerous", vote: null};
    rooms[room_count] = {result: {}, players: {}};
    if(nature >= dangerous_probability)
      player.criminal_type = "noob";
    rooms[room_count].players[socket.id] = player;
  }
  players_to_room[socket.id] = room_count;
  return player;
}  