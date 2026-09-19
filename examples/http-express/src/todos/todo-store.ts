import { randomUUID } from 'node:crypto';
import { TodoNotFoundError } from '../errors.js';
import { TodoId, type NewTodo, type Todo } from './todo.js';

export interface TodoStore {
  create(input: NewTodo): Todo;
  byId(id: TodoId): Todo;
}

export function createInMemoryTodoStore(): TodoStore {
  const todos = new Map<TodoId, Todo>();

  function create(input: NewTodo): Todo {
    const todo: Todo = { id: TodoId.parse(randomUUID()), title: input.title, done: false };
    todos.set(todo.id, todo);
    return todo;
  }

  function byId(id: TodoId): Todo {
    const todo = todos.get(id);
    if (todo === undefined) throw new TodoNotFoundError(id);
    return todo;
  }

  return { create, byId };
}
