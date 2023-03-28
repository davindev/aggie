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

interface MousePosition {
  x: number;
  y: number;
  color: string;
}

io.on('connection', (socket: any) => {
  // 방 입장
  socket.on('join-room', ({ roomId, username }: JoinRoom) => {
    socket.join(roomId);
    socket.emit('send-welcome-message', `${username}님이 입장하셨습니다.`);
  });

  // 마우스 위치 정보 전달
  socket.on('mouse-move-on-canvas', (mousePosition: MousePosition) => {
    socket.broadcast.emit('mouse-move-on-canvas', mousePosition);
  });
});

export {};
