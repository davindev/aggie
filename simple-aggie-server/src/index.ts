const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app).listen(8080);
const io = new Server(
  server,
  { cors: { origin: 'http://localhost:3001' } },
);

interface JoinRoom {
  roomId: string;
  username: string;
}

io.on('connection', (socket: any) => {
  socket.on('join-room', ({ roomId, username }: JoinRoom) => {
    socket.join(roomId);
    socket.emit('welcome-message', `${username}님이 입장하셨습니다.`);
  });
});

export {};
