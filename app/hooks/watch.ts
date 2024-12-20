import { State } from ".";

type WatchCallback<V> = (newValue: V, oldValue: V) => void;

type WatchValue = Record<keyof State, WatchCallback<unknown>[]>;

export const watchers = new Map<State, WatchValue>();

export function useWatch<S extends State, K extends keyof S>(
  state: S,
  key: K,
  callback: WatchCallback<S[K]>
) {
  if (!watchers.has(state)) {
    watchers.set(state, {});
  }

  const stateWatchers = watchers.get(state);

  if (!stateWatchers[key]) {
    stateWatchers[key] = [];
  }

  stateWatchers[key].push(callback);
}
