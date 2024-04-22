import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import './index.css';

import App from './App.jsx';
import Error from './Error.jsx';
import Start from './routes/start/Start.jsx';
import Play from './routes/play/Play.jsx';
import Home from './routes/home/Home.jsx';
import End from './routes/end/End.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/start',
        element: <Start />
      },
      {
        path: '/play',
        element: <Play />,
      },
      {
        path: '/end',
        element: <End />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
