export type GetEventMap<T> = T extends HTMLElement
  ? HTMLElementEventMap
  : T extends Document
  ? DocumentEventMap
  : T extends Window
  ? WindowEventMap
  : never;

export type Listeners<
  T extends HTMLElement | Document | Window,
  K extends keyof GetEventMap<T> = keyof GetEventMap<T>
> = {
  [U in K]?: (e: GetEventMap<T>[U]) => void;
};

export function on<
  T extends HTMLElement | Document | Window,
  K extends keyof GetEventMap<T>
>(element: T, event: K, handler: (e: GetEventMap<T>[K]) => void) {
  element.addEventListener(event as string, handler as EventListener);

  return () => off(element, event, handler);
}

export function off<
  T extends HTMLElement | Document | Window,
  K extends keyof GetEventMap<T>
>(element: T, event: K, handler: (e: GetEventMap<T>[K]) => void) {
  element.removeEventListener(event as string, handler as EventListener);
}
