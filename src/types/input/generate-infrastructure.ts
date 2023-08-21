export interface GenerateInfrastructure {
  readonly getDepLatestVersion: (dep: string) => Promise<string>;
}
