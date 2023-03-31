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

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const mousePosition = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };

    startDrawing(mousePosition);
    socket.emit('start-drawing', mousePosition);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isDrawing) {
      const path = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
        color: 'green',
      };

      draw(path);
      socket.emit('draw', path);
    }
  };

  const handleMouseUp = () => {
    finishDrawing();
    socket.emit('finish-drawing');
  };

  useEffect(() => {
    socket.connect();

    const username = `anonymous#${getRandomString()}`;
    socket.emit('join-room', { roomId, username });

    socket.on('send-message', (message: string) => toast.info(message));

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
    <div>
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
