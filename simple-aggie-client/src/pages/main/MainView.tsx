import React from 'react';
import { useNavigate } from 'react-router-dom';

import getRandomString from '../../utils/getRandomString';

export default function MainView() {
  const navigate = useNavigate();

  const handleMoveNewRoom = () => {
    navigate(`/room/${getRandomString()}`);
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
