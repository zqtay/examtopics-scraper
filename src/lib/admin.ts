import { AdminScraperSettings, SettingsId } from "@/types/settings";
import { prisma } from "./prisma";

// Only used if DATABASE_URL is not set
const adminSettings = [
  {
    id: SettingsId.SCRAPER,
    value: {
      access: "public",
      whitelistPaths: ["assets"],
      allowedRoles: ["admin"],
    }
  }
];

export const getScraperSettings = async () => {
  if (process.env.POSTGRES_PRISMA_URL) {
    const settings: any = await prisma.settings.findUnique({
      where: { id: SettingsId.SCRAPER }
    });
    return settings?.value;
  } else {
    return adminSettings.find(s => s.id === SettingsId.SCRAPER)?.value;
  }
};

export const updateScraperSettings = async (data: Partial<AdminScraperSettings>) => {
  const prev = await getScraperSettings();
  const { access, whitelistPaths, allowedRoles } = data;
  const updated = {
    id: SettingsId.SCRAPER,
    value: {
      ...prev,
      access,
      whitelistPaths,
      allowedRoles
    }
  };
  if (process.env.POSTGRES_PRISMA_URL) {
    await prisma.settings.update({
      where: { id: SettingsId.SCRAPER },
      data: updated
    });
  } else {
    const index = adminSettings.findIndex(s => s.id === SettingsId.SCRAPER);
    if (index === -1) throw new Error("Settings not found");
    adminSettings[index] = updated;
  }
  return updated;
};