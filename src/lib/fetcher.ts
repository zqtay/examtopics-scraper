const parser = new DOMParser();

export const fetchPage = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed request");
  const body = await res.text();
  const doc = parser.parseFromString(body, 'text/html');
  return doc;
};