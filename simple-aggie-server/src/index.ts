const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app).listen(8080);
const io = new Server(
  server,
  { cors: { origin: '*' } },
);

interface JoinRoom {
  roomId: string;
  username: string;
}

interface MousePosition {
  x: number;
  y: number;
}

interface Path extends MousePosition {
  color: string;
}

io.on('connection', (socket: any) => {
  socket.on('join-room', ({ roomId, username }: JoinRoom) => {
    socket.join(roomId);
    socket.emit('send-message', `${username}님이 입장하셨습니다.`);
  });

  socket.on('start-drawing', (mousePosition: MousePosition) => {
    socket.broadcast.emit('start-drawing', mousePosition);
  });

  socket.on('draw', (path: Path) => {
    socket.broadcast.emit('draw', path);
  });

  socket.on('finish-drawing', () => {
    socket.broadcast.emit('finish-drawing');
  });
});

export {};
