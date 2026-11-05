import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { router } from './app/router';
import { database } from './db/instance';
import { requestPersistentStorage } from './db/requestPersistentStorage';
import './styles/tokens.css';
import './styles/base.css';

registerSW({ immediate: true });

// Open eagerly so schema errors surface at startup rather than mid-workout.
database.open().catch((error: unknown) => console.error('Database failed to open', error));
void requestPersistentStorage();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element');

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
