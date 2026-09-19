import { Router } from 'express';
import { NewTodo, TodoId } from './todo.js';
import type { TodoStore } from './todo-store.js';

export function todoRoutes(store: TodoStore): Router {
  const router = Router();

  router.post('/', (request, response) => {
    const todo = store.create(NewTodo.parse(request.body));
    response.status(201).json(todo);
  });

  router.get('/:id', (request, response) => {
    response.json(store.byId(TodoId.parse(request.params.id)));
  });

  return router;
}
