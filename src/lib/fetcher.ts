let parser: DOMParser;

export const getParser = () => {
  if (!parser) parser = new DOMParser();
  return parser;
};

/**
 * Fetch and parse page
 * @param url URL
 * @returns Document
 */
export const fetchPage = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed request");
  const body = await res.text();
  const doc = getParser().parseFromString(body, 'text/html');
  return doc;
};