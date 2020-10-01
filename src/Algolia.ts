import ky from "ky";
import { SearchResult } from "./Algolia.d";

const getSearchResult = async (query: string) => {
  const parsed = await ky
    .get("http://hn.algolia.com/api/v1/search?", {
      searchParams: {
        query,
      },
    })
    .json<SearchResult>();

  return parsed;
};

export { getSearchResult };
