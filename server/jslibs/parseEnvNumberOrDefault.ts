export function parseEnvNumberOrDefault(env: string, defaultValue: number): number {
  const envValue = parseInt(process.env[env], 10);
  if (isNaN(envValue)) {
    return defaultValue;
  }
  return envValue;
}
