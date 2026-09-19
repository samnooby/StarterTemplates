import { z } from 'zod';

export const TodoId = z.string().brand<'TodoId'>();
export type TodoId = z.infer<typeof TodoId>;

export const NewTodo = z.object({
  title: z.string().trim().min(1).max(200),
});
export type NewTodo = z.infer<typeof NewTodo>;

export const Todo = NewTodo.extend({
  id: TodoId,
  done: z.boolean(),
});
export type Todo = z.infer<typeof Todo>;
