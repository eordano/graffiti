export function parseEnvString(env: string, defaultValue: string): string {
  return process.env[env] || defaultValue
}
