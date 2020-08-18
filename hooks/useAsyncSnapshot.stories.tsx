import React from "react";
import useAsyncSnapshot from "./useAsyncSnapshot";

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

function Example() {
  const movies = useAsyncSnapshot("success", fetchWithSuccess);

  return (
    <>
      {movies.pending ? (
        "loading..."
      ) : movies.result ? (
        <ul>
          {movies.result.map((movie) => (
            <li key={movie}>{movie}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

function Add() {
  const movies = useAsyncSnapshot("success", fetchWithSuccess);

  if (!movies.result) {
    return null;
  }

  return (
    <button
      onClick={() => {
        movies.update((snapshopt) => [
          ...snapshopt,
          `star wars ${snapshopt.length + 1}`,
        ]);
      }}
    >
      Add
    </button>
  );
}

export default {
  title: "useAsyncSnapshot",
};

export function Default() {
  return (
    <>
      <Example />
      <Example />
      <Add />
    </>
  );
}
