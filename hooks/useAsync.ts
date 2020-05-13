import { useRef, useEffect, useCallback, useState, useMemo } from "react";

type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

interface State<T> {
  error: any;
  result: T | undefined;
  standby: boolean;
  pending: boolean;
}

function useAsync<T extends (...args: any) => Promise<any>>(
  asyncFunction: T,
  { immediate = true } = {}
) {
  type U = Unpromise<ReturnType<T>>;
  const mountedRef = useRef(true);
  const executeCounter = useRef(0);

  const [state, setState] = useState<State<U>>({
    error: undefined,
    result: undefined,
    standby: !immediate,
    pending: immediate,
  });

  const execute = useCallback(
    (...args: any) => {
      const executeId = ++executeCounter.current;

      setState({
        error: undefined,
        result: undefined,
        standby: false,
        pending: true,
      });

      return asyncFunction(...args)
        .then(
          (result) => [result],
          (error) => [undefined, error]
        )
        .then(([result, error]) => {
          if (mountedRef.current && executeId === executeCounter.current) {
            setState({
              error,
              result,
              standby: false,
              pending: false,
            });
          }
        });
    },
    [asyncFunction]
  ) as T;

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useMemo(() => ({ ...state, execute }), [state, execute]);
}

export default useAsync;
