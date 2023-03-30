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
}

interface Path extends MousePosition {
  color: string;
}

const socket = io('http://localhost:8080', { transports: ['websocket'] });

export default function RoomView() {
  const { roomId } = useParams();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = canvasRef.current?.getContext('2d');

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  const startDrawing = useCallback((mousePosition: MousePosition) => {
    setIsDrawing(true);
    setLastMousePosition(mousePosition);
  }, []);

  const draw = useCallback(({ x, y, color }: Path) => {
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineWidth = 8;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(lastMousePosition.x, lastMousePosition.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      setLastMousePosition({ x, y });
    }
  }, [ctx, lastMousePosition.x, lastMousePosition.y]);

  const finishDrawing = useCallback(() => {
    if (ctx) {
      ctx.closePath();
      setIsDrawing(false);
    }
  }, [ctx]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const mousePosition = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    startDrawing(mousePosition);
    socket.emit('start-drawing', mousePosition);
  }, [startDrawing]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isDrawing) {
      const path = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
        color: 'green',
      };

      draw(path);
      socket.emit('draw', path);
    }
  }, [draw, isDrawing]);

  const handleMouseUp = useCallback(() => {
    finishDrawing();
    socket.emit('finish-drawing');
  }, [finishDrawing]);

  useEffect(() => {
    socket.connect();

    const username = `anonymous#${getRandomString()}`;
    socket.emit('join-room', { roomId, username });

    socket.on('send-message', (message: string) => console.log(message));

    return () => {
      socket.off('send-message');
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    socket.on('start-drawing', startDrawing);

    return () => {
      socket.off('start-drawing');
    };
  }, [startDrawing]);

  useEffect(() => {
    socket.on('draw', draw);

    return () => {
      socket.off('draw');
    };
  }, [draw]);

  useEffect(() => {
    socket.on('finish-drawing', finishDrawing);

    return () => {
      socket.off('finish-drawing');
    };
  }, [finishDrawing]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
