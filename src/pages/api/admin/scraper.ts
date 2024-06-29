import { prisma } from "@/lib/prisma";
import { SettingsId } from "@/types/settings";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { authOptions } from "../auth/[...nextauth]";
import { getScraperSettings, updateScraperSettings } from "@/lib/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const session = await getServerSession(req, res, authOptions);
  if (method === "PUT") {
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (session.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
  }
  try {
    switch (method) {
      case "GET":
        return await handleGet(req, res);
      case "PUT":
        return await handlePut(req, res);
      default:
        res.setHeader("Allow", "GET, PUT");
        throw new ApiError(405, `Method not allowed`);
    }
  }
  catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await getScraperSettings();
  return res.status(200).json(data);
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const { access, whitelistPaths, allowedRoles } = req.body;
  const updated = await updateScraperSettings({ access, whitelistPaths, allowedRoles });
  return res.status(200).json(updated);
};