import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MainView from './pages/main/MainView';
import RoomView from './pages/room/RoomView';

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <MainView /> },
    { path: '/room/:roomId', element: <RoomView /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
