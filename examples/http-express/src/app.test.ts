import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { Todo } from './todos/todo.js';
import { createInMemoryTodoStore } from './todos/todo-store.js';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createApp(createInMemoryTodoStore()).listen(0);
  await new Promise<void>((resolve) => {
    server.once('listening', resolve);
  });
  baseUrl = `http://127.0.0.1:${String(listeningPort(server))}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    });
  });
});

describe('GET /health', () => {
  it('reports ok', async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });
});

describe('POST /todos', () => {
  it('creates a todo with a generated id', async () => {
    const response = await postTodo({ title: 'write tests' });

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ title: 'write tests', done: false });
  });

  it('rejects an empty title', async () => {
    const response = await postTodo({ title: '   ' });

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: 'invalid_request' });
  });
});

describe('GET /todos/:id', () => {
  it('returns a created todo', async () => {
    const created = Todo.parse(await (await postTodo({ title: 'read' })).json());

    const response = await fetch(`${baseUrl}/todos/${created.id}`);

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: created.id, title: 'read' });
  });

  it('responds not found for an unknown id', async () => {
    const response = await fetch(`${baseUrl}/todos/missing`);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'todo_not_found', todoId: 'missing' });
  });
});

function listeningPort(listening: Server): number {
  const address = listening.address();
  if (address === null || typeof address === 'string')
    throw new Error('Server is not listening on a TCP port');
  return address.port;
}

function postTodo(body: unknown): Promise<Response> {
  return fetch(`${baseUrl}/todos`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}
