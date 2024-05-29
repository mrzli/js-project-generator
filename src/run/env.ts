import { z } from 'zod';

const ENV_SCHEMA = z.object({
  NODE_ENV: z.string().min(1),
  TARGET_DIR: z.string().min(1),
});

type EnvRaw = z.infer<typeof ENV_SCHEMA>;

export interface Env {
  readonly nodeEnv: string;
  readonly targetDir: string;
}

export function parseEnv(env: NodeJS.ProcessEnv): Env {
  const raw = ENV_SCHEMA.parse(env);
  return envRawToEnv(raw);
}

function envRawToEnv(raw: EnvRaw): Env {
  return {
    nodeEnv: raw.NODE_ENV,
    targetDir: raw.TARGET_DIR,
  };
}
