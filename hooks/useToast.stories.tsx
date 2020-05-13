import React from "react";
import useToast from "./useToast";

export default {
  title: "useToast",
};

export function Default() {
  const toast = useToast();

  return (
    <>
      <button onClick={() => toast.show()}>Toast!</button>
      <div
        style={{
          opacity: toast.visible ? 1 : 0,
          transition: "opacity 200ms linear",
          background: "yellow",
        }}
      >
        toast!
      </div>
    </>
  );
}
