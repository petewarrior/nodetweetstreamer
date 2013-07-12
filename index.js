var express = require("express");
var twitter = require('twitter');

var app = express();
var port = 3700;

// prepare Twitter stream
	
var twit = new twitter({
    consumer_key: 'use_your_own',
    consumer_secret: 'use_your_own',
    access_token_key: 'use_your_own',
    access_token_secret: 'use_your_own'
    
});

console.log("Twitter stream connected");

// set up HTML generator

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
app.use(express.static(__dirname + '/public'));

// socket.io server

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    //socket.emit('message', { message: 'welcome to the chat' });
	console.log
    socket.on('send', function (data) {
		console.log(data);
        io.sockets.emit('message', data);
    });
});

// broadcast tweets to connected clients 

twit.stream('statuses/filter', {track: 'jkt48'}, function(stream) {
    stream.on('data', function(data) {
        io.sockets.emit('newtweet', data);
		
		var parsed = '';//JSON.parse(data);
		
		for(t in parsed) {
			//console.log(t.user.screen_name + ": " + t.text);
		}
    });
});

console.log("Listening on port " + port);