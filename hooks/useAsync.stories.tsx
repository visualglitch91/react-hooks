import React from "react";
import useAsync from "./useAsync";

function fetchWithSuccess() {
  return new Promise<string[]>((resolve) =>
    window.setTimeout(resolve, 3000, [
      "star wars 1",
      "star wars 2",
      "star wars 3",
      "star wars 4",
      "star wars 5",
      "star wars 6",
    ])
  );
}

function fetchWithFailure() {
  return new Promise<string[]>((_, reject) =>
    window.setTimeout(reject, 3000, new Error("not found"))
  );
}

export default {
  title: "useAsync",
};

export function Default() {
  const movies = useAsync(fetchWithSuccess);

  return movies.pending ? (
    "loading..."
  ) : movies.result ? (
    <ul>
      {movies.result.map((movie) => (
        <li key={movie}>{movie}</li>
      ))}
    </ul>
  ) : null;
}

export function Lazy() {
  const movies = useAsync(fetchWithSuccess, { immediate: false });

  return movies.standby ? (
    <button onClick={() => movies.execute()}>load movies</button>
  ) : movies.pending ? (
    "loading..."
  ) : movies.result ? (
    <ul>
      {movies.result.map((movie) => (
        <li key={movie}>{movie}</li>
      ))}
    </ul>
  ) : null;
}

export function _Error() {
  const movies = useAsync(fetchWithFailure);

  return movies.pending
    ? "loading..."
    : movies.error
    ? movies.error.message
    : null;
}
