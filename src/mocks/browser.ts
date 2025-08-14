import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup Mock Service Worker for browser
export const worker = setupWorker(...handlers);

// Start the worker only in development
export const startMocking = async () => {
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
    console.log('🔶 Mock Service Worker started');
  }
};
