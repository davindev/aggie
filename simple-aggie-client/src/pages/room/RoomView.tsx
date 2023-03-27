import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import getRandomString from '../../utils/getRandomString';

export default function RoomView() {
  const { roomId } = useParams();

  const socket = io('http://localhost:8080');

  useEffect(() => {
    socket.connect();

    const username = `Anonymous#${getRandomString()}`;
    socket.emit('join-room', { roomId, username });

    socket.on('welcome-message', (message: string) => console.log(message));
  }, [socket, roomId]);

  return (
    <div>
      Room
    </div>
  );
}
