import { prisma } from "@/lib/prisma";
import { SettingsId } from "@/types/settings";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const method = req.method;
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
  const settings: any = await prisma.settings.findUnique({
    where: { id: SettingsId.SCRAPER }
  });
  return res.status(200).json(settings?.value);
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const { enabled } = req.body;
  if (typeof enabled !== "boolean") {
    throw new ApiError(400, "Invalid request body");
  }
  let data: any = await prisma.settings.findUnique({
    where: { id: SettingsId.SCRAPER }
  });
  data = { ...data, value: { ...data.value, enabled } };
  await prisma.settings.update({
    where: { id: SettingsId.SCRAPER },
    data: data
  });
  return res.status(200).json(data);
};