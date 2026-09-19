export class AppError extends Error {
  override readonly name: string = 'AppError';
}

export class TodoNotFoundError extends AppError {
  override readonly name = 'TodoNotFoundError';

  constructor(readonly todoId: string) {
    super(`Todo ${todoId} not found`);
  }
}
