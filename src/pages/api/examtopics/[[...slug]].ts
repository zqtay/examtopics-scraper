// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

const EXAMTOPICS_BASE_URL = "https://www.examtopics.com";
const regex = /api\/examtopics[\/]?(.*)/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const match = req.url?.match(regex);
  if (!match || !match[1]) {
    return res.status(404).end();
  }
  if (req.method !== "GET") {
    return res.status(405).setHeader("Allow", "GET");
  }
  console.log(match)
  const fwdRes = await fetch(`${EXAMTOPICS_BASE_URL}/${match[1]}`);
  // Set status: 200 or 206
  res.status(fwdRes.status);
  // Pipe the readable stream to this API response
  if (fwdRes.body) {
    // @ts-ignore
    Readable.fromWeb(fwdRes.body).pipe(res);
  }
}