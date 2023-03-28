import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import getRandomString from '../../utils/getRandomString';

interface MousePosition {
  x: number;
  y: number;
  color: string;
}

export default function RoomView() {
  const { roomId } = useParams();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = canvasRef.current?.getContext('2d');

  const [isPainting, setIsPainting] = useState(false);

  const socket = io('http://localhost:8080');

  const handlePaintOnCanvas = useCallback(({ x, y, color }: MousePosition) => {
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.closePath();
      socket.emit('paint-on-canvas', { x, y, color });
    }
  }, [ctx, socket]);

  const handleMouseMoveOnCanvas = useCallback(({ x, y, color }: MousePosition) => {
    if (ctx) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const rectX = x - rect.left;
      const rectY = y - rect.top;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(rectX, rectY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }, [ctx]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isPainting) {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      handlePaintOnCanvas({ x, y, color: 'green' });
      return;
    }

    const mousePosition = {
      x: event.clientX,
      y: event.clientY,
      color: 'green',
    };

    handleMouseMoveOnCanvas(mousePosition);

    // 마우스 위치 정보 발신
    socket.emit('mouse-move-on-canvas', mousePosition);
  };

  useEffect(() => {
    // socket 연결
    socket.connect();

    // 방 입장
    const username = `anonymous#${getRandomString()}`;
    socket.emit('join-room', { roomId, username });

    // 웰컴 메세지 노출
    socket.on('send-welcome-message', (message: string) => console.log(message));
  }, [socket, roomId]);

  useEffect(() => {
    // 마우스 위치 정보 수신
    socket.on('mouse-move-on-canvas', handleMouseMoveOnCanvas);
  }, [socket, handleMouseMoveOnCanvas]);

  // useEffect(() => {
  //   // 캔버스 path 데이터 수신
  //   socket.on('paint-on-canvas', handlePaintOnCanvas);
  // }, [socket, handlePaintOnCanvas]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        onMouseDown={() => setIsPainting(true)}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsPainting(false)}
        onMouseLeave={() => setIsPainting(false)}
      />
    </div>
  );
}
