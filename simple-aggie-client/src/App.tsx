import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MainView from './pages/main/MainView';

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <MainView /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
