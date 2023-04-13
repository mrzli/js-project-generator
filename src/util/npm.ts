import { execCommand } from './exec';

export async function getLatestVersion(packageName: string): Promise<string> {
  const { stdout } = await execCommand(`npm view ${packageName} --json`);
  return JSON.parse(stdout).version;
}
