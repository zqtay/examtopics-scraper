export enum SettingsId {
  SCRAPER = 1,
}

export type AdminScraperSettings = {
  // Whether the scraper access is public, restricted, or none
  access: "public" | "restricted" | "none";
  // Allowed paths to be fetched regardless of access level
  whitelistPaths: string[];
  // Allowed roles when scraper access is restricted
  allowedRoles: string[];
}