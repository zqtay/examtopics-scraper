// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/lib/prisma";
import { AdminScraperSettings, SettingsId } from "@/types/settings";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { Readable } from "stream";
import { authOptions } from "../auth/[...nextauth]";

const EXAMTOPICS_BASE_URL = "https://www.examtopics.com";
const regex = /api\/examtopics[\/]?(.*)/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const match = req.url?.match(regex);
  if (!match || !match[1]) {
    return res.status(404).end();
  }
  if (req.method !== "GET") {
    return res.status(405).setHeader("Allow", "GET");
  }

  const settingsData: any = await prisma.settings.findUnique({
    where: { id: SettingsId.SCRAPER }
  });
  const settings: AdminScraperSettings = settingsData?.value;
  if (settings.whitelistPaths.some(e => match[1]?.startsWith(e))) {
    // Bypass check
  } else if (settings?.access === "public") {
    // Anyone can access
  } else if (settings?.access === "restricted") {
    // Check roles
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!settings.allowedRoles.includes(session.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  } else if (settings?.access === "none") {
    return res.status(403).json({ message: "Scraper is disabled" });
  }

  const fwdRes = await fetch(`${EXAMTOPICS_BASE_URL}/${match[1]}`);
  res.status(fwdRes.status);
  // Pipe the readable stream to this API response
  if (fwdRes.body) {
    // @ts-ignore
    Readable.fromWeb(fwdRes.body).pipe(res);
  }
}

export const config = {
  maxDuration: 60,
};