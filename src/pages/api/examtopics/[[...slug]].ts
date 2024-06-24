// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { scraperState } from "@/lib/admin";
import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

const EXAMTOPICS_BASE_URL = "https://www.examtopics.com";
const regex = /api\/examtopics[\/]?(.*)/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!scraperState.enabled) {
    return res.status(403).json({ message: "Scraper is disabled" });
  }
  const match = req.url?.match(regex);
  if (!match || !match[1]) {
    return res.status(404).end();
  }
  if (req.method !== "GET") {
    return res.status(405).setHeader("Allow", "GET");
  }
  const fwdRes = await fetch(`${EXAMTOPICS_BASE_URL}/${match[1]}`);
  res.status(fwdRes.status);
  // Pipe the readable stream to this API response
  if (fwdRes.body) {
    // @ts-ignore
    Readable.fromWeb(fwdRes.body).pipe(res);
  }
}