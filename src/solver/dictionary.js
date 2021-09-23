const API_KEY = "adb5e394-50fc-46f8-96ee-59d76e955277";

export async function define(word) {
  const host = "https://www.dictionaryapi.com";
  const path = `/api/v3/references/collegiate/json/${word.toLowerCase()}`;
  const url = new URL(`${host}${path}`);
  url.searchParams.set("key", API_KEY);
  return fetch(url.toString()).then((response) => response.json());
}
