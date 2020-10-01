import React, { useState } from "react";
import { getSearchResult } from "./Algolia";
import { SearchResult } from "./Algolia.d";
import "./App.css";

interface AppState {
  query: string;
  data: SearchResult | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    query: "",
    data: null,
  });

  const handleOnClick = async () => {
    const data = await getSearchResult(state.query);
    setState({
      ...state,
      data,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      query: e.target.value,
    });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-10">
        <div className="card">
          <div className="card-body p-4">
            <div className="text-center w-75 m-auto">
              <h4>Snippet Genertation</h4>
            </div>
            <form>
              <div className="form-group mb-3">
                <label htmlFor="query"></label>
                <input
                  className="form-control"
                  type="text"
                  id="query"
                  placeholder="Enter query"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mb-0 text-center">
                <button
                  className="btn btn-primary btn-block"
                  type="button"
                  onClick={handleOnClick}
                  disabled={!state.query}
                >
                  Submit
                </button>
                {state.data && state.data.processingTimeMS && (
                  <small className="form-text text-muted text-left">
                    {state.data.processingTimeMS} ms to process request
                  </small>
                )}
              </div>
            </form>
            <div className="mt-4 search-result-box">
              {state.data &&
                state.data.hits.map((hit) => (
                  <div className="search-item" key={hit.objectID}>
                    <div
                      className="font-13 text-success mb-2 text-truncate"
                      dangerouslySetInnerHTML={{
                        __html: hit?._highlightResult?.url?.value,
                      }}
                    ></div>
                    <h4 className="mb-1">
                      <a
                        href={hit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {hit.title}
                      </a>
                    </h4>
                    <p
                      className="mb-0 text-muted"
                      dangerouslySetInnerHTML={{
                        __html:
                          (() => {
                            const d = new Date(hit.created_at);
                            const month = d.toLocaleString("default", {
                              month: "short",
                            });
                            const date = d.getDate();
                            const year = d.getFullYear();
                            return `${month} ${date}, ${year} - `;
                          })() + hit._highlightResult?.title?.value,
                      }}
                    ></p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
