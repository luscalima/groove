import { watchers } from ".";

export type State = Record<keyof any, unknown>;

export function useState<S extends State>(state: S) {
  const _state = (<K extends keyof S, V extends S[K]>() =>
    new Proxy(state, {
      set(target, key, value) {
        const oldValue = target[key] as V;
        const newValue = value as V;

        Reflect.set(target, key, newValue);

        if (watchers.has(_state) && watchers.get(_state)[key]) {
          watchers.get(_state)[key].forEach((callback) => {
            callback(newValue, oldValue);
          });
        }

        return true;
      },
    }))();

  return _state;
}
