import { useState, useEffect } from "react";
import { EventEmitter } from "events";

type Handler<T> = (state: T) => void;

type Service = (...args: any) => Promise<any>;

type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

interface State<T> {
  error: any;
  result: T | undefined;
  standby: boolean;
  pending: boolean;
}

interface Mirror<T extends Service, U = Unpromise<ReturnType<T>>> {
  getState: () => State<U>;
  execute: (
    ...args: Parameters<T>
  ) => Promise<{ result: U | undefined; error: any }>;
  update: (updater: (snapshot: U) => U) => void;
  subscribe: (handler: Handler<State<U>>) => () => void;
  unsubscribe: (handler: Handler<State<U>>) => void;
}

const mirrors: any = {};

function createMirror<T extends Service>(service: T): Mirror<T> {
  type ServiceResult = Unpromise<ReturnType<T>>;

  const emitter = new EventEmitter();

  let executeCounter = 0;

  let state: State<ServiceResult> = {
    error: undefined,
    result: undefined,
    standby: true,
    pending: false,
  };

  function subscribe(handler: Handler<State<ServiceResult>>) {
    emitter.addListener("update", handler);
    return () => unsubscribe(handler);
  }

  function unsubscribe(handler: Handler<State<ServiceResult>>) {
    emitter.removeListener("update", handler);
  }

  function getState() {
    return state;
  }

  function execute(
    ...args: Parameters<T>
  ): Promise<{ result: ServiceResult | undefined; error: any }> {
    const executeId = ++executeCounter;

    state = {
      error: undefined,
      result: state.result,
      standby: false,
      pending: true,
    };

    emitter.emit("update", state);

    return service(...args)
      .then<[ServiceResult | undefined, any]>(
        (result: ServiceResult) => [result, undefined],
        (error) => [undefined, error] as any
      )
      .then(([result, error]) => {
        if (executeId === executeCounter) {
          state = {
            error,
            result,
            standby: false,
            pending: false,
          };

          emitter.emit("update", state);
        }

        return { result, error };
      });
  }

  function update(updater: (snapshot: ServiceResult) => ServiceResult) {
    state = {
      error: undefined,
      result: state.result && updater(state.result),
      standby: false,
      pending: false,
    };

    emitter.emit("update", state);
  }

  (execute as any)();

  return {
    execute,
    update,
    getState,
    subscribe,
    unsubscribe,
  };
}

function getMirror<T extends Service>(key: string, service: T): Mirror<T> {
  if (!mirrors[key]) {
    mirrors[key] = createMirror(service);
  }

  return mirrors[key];
}

function useAsyncSnapshot<T extends Service>(key: string, service: T) {
  const [mirror] = useState(() => getMirror(key, service));
  const [state, setState] = useState(() => mirror.getState());

  useEffect(() => mirror.subscribe(setState), []);

  return {
    execute: mirror.execute,
    update: mirror.update,
    ...state,
  };
}

export default useAsyncSnapshot;
