import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import getRandomString from '../../utils/getRandomString';

export default function RoomView() {
  const { roomId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPainting, setIsPainting] = useState(false);
  const socket = io('http://localhost:8080');

  const handlePaintCanvas = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    const ctx = canvasRef.current?.getContext('2d');

    // socket.emit('painting-canvas', { x, y });

    if (isPainting) {
      ctx?.lineTo(x, y);
      ctx?.stroke();
      return;
    }

    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  useEffect(() => {
    // socket 연결
    socket.connect();

    // 방 입장
    const username = `Anonymous#${getRandomString()}`;
    socket.emit('join-room', { roomId, username });

    // 웰컴 메세지 노출
    socket.on('welcome-message', (message: string) => console.log(message));
  }, [socket, roomId]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        onMouseDown={() => setIsPainting(true)}
        onMouseMove={handlePaintCanvas}
        onMouseUp={() => setIsPainting(false)}
        onMouseLeave={() => setIsPainting(false)}
      />
    </div>
  );
}
