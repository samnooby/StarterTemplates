import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { createInMemoryTodoStore } from './todos/todo-store.js';

const config = loadConfig();
const app = createApp(createInMemoryTodoStore());

app.listen(config.PORT, () => {
  console.log(`listening on http://localhost:${String(config.PORT)}`);
});
