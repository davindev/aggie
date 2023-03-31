import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import { ToastContainer, Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import getRandomString from '../../utils/getRandomString';
import { COLORS } from './constants';

import Palette from './components/Palette';

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

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [pathColor, setPathColor] = useState(COLORS[0].hex);

  const startDrawing = useCallback((mousePosition: MousePosition) => {
    setIsDrawing(true);
    setLastMousePosition(mousePosition);
  }, []);

  const draw = useCallback(({ x, y, color }: Path) => {
    const ctx = canvasRef.current?.getContext('2d');

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
  }, [lastMousePosition.x, lastMousePosition.y]);

  const finishDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

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
        color: pathColor,
      };

      draw(path);
      socket.emit('draw', path);
    }
  }, [isDrawing, pathColor, draw]);

  const handleMouseUp = useCallback(() => {
    finishDrawing();
    socket.emit('finish-drawing');
  }, [finishDrawing]);

  // 방 입장
  useEffect(() => {
    socket.connect();

    const username = `anonymous#${getRandomString()}`;
    socket.emit('join-room', { roomId, username });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // 웰컴 메세지 수신
  useEffect(() => {
    socket.on('send-message', toast.info);

    return () => {
      socket.off('send-message');
    };
  }, []);

  // 그림 시작 좌표 수신
  useEffect(() => {
    socket.on('start-drawing', startDrawing);

    return () => {
      socket.off('start-drawing');
    };
  }, [startDrawing]);

  // 그림 현재 좌표 수신
  useEffect(() => {
    socket.on('draw', draw);

    return () => {
      socket.off('draw');
    };
  }, [draw]);

  // 그림 종료 여부 수신
  useEffect(() => {
    socket.on('finish-drawing', finishDrawing);

    return () => {
      socket.off('finish-drawing');
    };
  }, [finishDrawing]);

  return (
    <div className="relative">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        closeButton={false}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        style={{ width: 'auto' }}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />

      <Palette onChange={(color: string) => setPathColor(color)} />

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
