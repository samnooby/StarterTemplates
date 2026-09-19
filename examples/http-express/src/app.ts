import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { TodoNotFoundError } from './errors.js';
import { todoRoutes } from './todos/todo-routes.js';
import type { TodoStore } from './todos/todo-store.js';

export function createApp(store: TodoStore): Express {
  const app = express();
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.use('/todos', todoRoutes(store));
  app.use(errorToResponse);
  return app;
}

function errorToResponse(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    response.status(400).json({ error: 'invalid_request', issues: error.issues });
    return;
  }
  if (error instanceof TodoNotFoundError) {
    response.status(404).json({ error: 'todo_not_found', todoId: error.todoId });
    return;
  }
  response.status(500).json({ error: 'internal' });
}
