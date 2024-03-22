import { parseQuestion } from "@/lib/scraper";
import apiHandler from "@/pages/api/examtopics/[[...slug]]";
import { testClient } from "../client";
import { getParser } from "@/lib/fetcher";

const request = testClient(apiHandler);

test("Fetch and parse question", async () => {
  const res = await request.get("/api/examtopics/discussions/amazon/view/85310-exam-aws-certified-solutions-architect-associate-saa-c03/");
  const doc = getParser().parseFromString(res.text, 'text/html');
  const question = parseQuestion(doc);
  expect(res.status).toBe(200);
  expect(question.topic).toStrictEqual("1");
  expect(question.index).toStrictEqual("66");
});
