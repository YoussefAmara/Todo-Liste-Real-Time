var express = require('express');
var http = require('http');
var ent = require('ent');


var app = express();
var server= http.createServer(app);
var io = require('socket.io').listen(server);

var todolist = [];
var i;

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.render('todo.ejs');
});

app.use(function(request, response, next)
{
    response.redirect('/');
});



io.sockets.on('connection', function (socket) {

        socket.emit('RefrechTodo', todolist);

        socket.on('newTodo', function(todo)
        {
           todo = ent.encode(todo);
           todolist.push(todo);

           i = todolist.length -1;
           socket.broadcast.emit('newTodo', {todo:todo, i:i});
        });

        socket.on('deleteTodo', function(i)
        {
            todolist.splice(i, 1);
            io.sockets.emit('RefrechTodo', todolist);
        });
});



server.listen(3000);
