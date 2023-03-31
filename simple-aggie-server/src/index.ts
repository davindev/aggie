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
    // 방 입장
    socket.join(roomId);

    // 웰컴 메세지 발신
    socket.to(roomId).emit('send-message', `${username}님이 입장하셨습니다.`);

    // 그림 시작 좌표 전달
    socket.on('start-drawing', (mousePosition: MousePosition) => {
      socket.to(roomId).emit('start-drawing', mousePosition);
    });

    // 그림 현재 좌표 전달
    socket.on('draw', (path: Path) => {
      socket.to(roomId).emit('draw', path);
    });

    // 그림 종료 여부 전달
    socket.on('finish-drawing', () => {
      socket.to(roomId).emit('finish-drawing');
    });
  });
});
