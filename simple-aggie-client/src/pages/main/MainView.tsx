import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainView() {
  const navigate = useNavigate();

  const handleMoveNewRoom = () => {
    const roomId = Math.random().toString(36).substring(2);
    navigate(`/room/${roomId}`);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleMoveNewRoom}
      >
        입장하기
      </button>
    </div>
  );
}
