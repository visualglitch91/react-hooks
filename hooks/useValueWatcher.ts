import { useEffect, useRef } from "react";

const useValueWatcher = <T extends any = any>(
  value: T,
  handler: (value: T, previousValue: T) => void
) => {
  const previousValueRef = useRef<T>(value);

  useEffect(() => {
    if (value !== previousValueRef.current) {
      handler(value, previousValueRef.current);
      previousValueRef.current = value;
    }
  }, [value]);
};

export default useValueWatcher;
