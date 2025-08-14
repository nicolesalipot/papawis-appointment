import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup Mock Service Worker for browser
export const worker = setupWorker(...handlers);

// Start the worker only in development
export const startMocking = async () => {
  if (import.meta.env.DEV) {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
      });
      console.log('🔶 Mock Service Worker started successfully');
      console.log('🔶 Registered handlers:', handlers.length);

      // Test MSW with a simple request
      try {
        const testResponse = await fetch('/api/test');
        const testData = await testResponse.json();
        console.log('🔶 MSW test successful:', testData);
      } catch (testError) {
        console.error('❌ MSW test failed:', testError);
      }
    } catch (error) {
      console.error('❌ Failed to start MSW:', error);
    }
  } else {
    console.log('🔶 MSW not started (not in development mode)');
  }
};
