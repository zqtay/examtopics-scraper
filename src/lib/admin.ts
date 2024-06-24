export type AdminScraperState = {
  enabled: boolean;
}

// Global state
export const scraperState: AdminScraperState = {
  enabled: false,
};

export const getScraperState = () => {
  return scraperState;
};