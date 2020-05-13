import { useEffect, useRef, useState } from "react";

const useToast = (ms = 1500) => {
  const timeoutRef = useRef<number>();
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(hide, ms);
  };

  const hide = () => {
    setVisible(false);
    clearTimeout(timeoutRef.current);
  };

  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
    },
    []
  );

  return { visible, show, hide };
};

export default useToast;
