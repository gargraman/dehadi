import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Create MSW server
export const server = setupServer(...handlers);

// Setup MSW
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
