import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'
import { router } from './routes.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'

const queryClient = new QueryClient( {
  defaultOptions: {
    queries: {
      // Данные считаются свежими 5 минут (300 000 мс)
      /* staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false, // отключает обновление при фокусе
      refetchOnMount: false,       // отключает обновление при монтировании, если есть кэш
      refetchOnReconnect: false, */
    },
  },
} );

// src/index.js или src/main.jsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker зарегистрирован с областью:', registration.scope);
      })
      .catch((error) => {
        console.error('Ошибка регистрации ServiceWorker:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
