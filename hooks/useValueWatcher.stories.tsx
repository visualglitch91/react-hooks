import React, { useState } from "react";
import { action } from "@storybook/addon-actions";
import useValueWatcher from "./useValueWatcher";

export default {
  title: "useValueWatcher",
};

export function Default() {
  const [counter, setCounter] = useState(0);

  useValueWatcher(counter, (to, from) => {
    action("counter changed")(from, to);
  });

  return (
    <>
      <button onClick={() => setCounter(counter - 1)}>Decrease</button>
      <br />
      <button onClick={() => setCounter(counter + 1)}>Increase</button>
      <br />
      {counter}
    </>
  );
}
