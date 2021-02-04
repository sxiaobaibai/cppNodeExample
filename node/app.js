const express = require('express');
const app = express();
const http = require('http').Server(app);
const net = require('net');
const fs =  require('fs');
const io = require('socket.io')(http);

const SOCKET_FILE = "../unix_socket";
const PORT = process.env.PORT || 3000;
const date = new Date;

var obj;

const server = net.createServer((connection) => {
	console.log('connected.');
	connection.on('close', () => {
		console.log('disconnected.');
	});
	connection.on('data', (data) => {
		obj = JSON.parse(data.toString());
		connection.write('ok');
	});
	connection.on('error', (err) => {
		console.error(err.message);
	});
});
try {
	fs.unlinkSync(SOCKET_FILE);
} catch (error) {}
server.listen(SOCKET_FILE);

app.use(express.static(__dirname + '/public'));

app.get('/' , function(req, res){
   res.sendFile('index.html');
});

io.on('connection',function(socket){
	console.log('connected');
	setInterval(()=>{
		if (obj)
		{
			io.emit('mess', obj.manipulator);
		}

	}
	, 10);
});

http.listen(PORT, function(){
	console.log('server listening. Port:' + PORT);
});

