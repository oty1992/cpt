import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '~/App';
import CreateRoom from '~/pages/CreateRoom';
import Home from '~/pages/Home';
import NotFound from '~/pages/NotFound';
import ProtectedRoute from '~/pages/ProtectedRoute';
import Room from '~/pages/Room';
import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';
import '~/index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
      {
        path: 'room/:id',
        element: (
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>
        ),
      },
      {
        path: 'room/create',
        element: (
          <ProtectedRoute>
            <CreateRoom />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>,
);
