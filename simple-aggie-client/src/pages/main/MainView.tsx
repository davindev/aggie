import React from 'react';
import { useNavigate } from 'react-router-dom';

import getRandomString from '../../utils/getRandomString';

import bg from '../../assets/bg.jpg';

export default function MainView() {
  const navigate = useNavigate();

  const handleMoveNewRoom = () => {
    const roomId = getRandomString();
    navigate(`/room/${roomId}`);
  };

  return (
    <div
      className="grid place-items-center w-screen h-screen font-sans text-center"
      style={{ background: `url(${bg}) no-repeat`, backgroundSize: 'cover', backgroundColor: '#260420' }}
    >
      <div>
        <h1 className="text-6xl text-white">
          Simple Aggie
        </h1>
        <p className="mt-4 text-4xl text-white">
          A collaborative painting applications
        </p>
        <button
          type="button"
          className="block mx-auto mt-56 px-10 py-4 bg-white bg-opacity-30 rounded-xl text-2xl transition ease-in-out hover:bg-opacity-60"
          style={{ color: '#69392d' }}
          onClick={handleMoveNewRoom}
        >
          Start drawing
        </button>
      </div>
    </div>
  );
}
