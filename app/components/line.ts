import { GetEventMap, h, Listeners, on } from "../hooks";

type LineProps = {
  text?: string;
};

export function Line(props: LineProps, listeners?: Listeners<HTMLLIElement>) {
  const el = h(
    "li",
    {
      class: "cursor-pointer hover:text-white",
    },
    props.text || h("i", { class: "ph-fill ph-music-note" })
  );

  if (listeners) {
    for (const event in listeners) {
      // @ts-expect-error
      on(el, event, listeners[event]);
    }
  }

  return el;
}
