import { z } from 'zod';

const Config = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
});

export type Config = z.infer<typeof Config>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return Config.parse(env);
}
