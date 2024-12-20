import { h, Listeners, on } from "../hooks";

type SongProps = {
  title: string;
  artist: string;
  artworkPath: string;
  static?: boolean;
};

export function Song(props: SongProps, listeners?: Listeners<HTMLLIElement>) {
  const rootEl = props.static ? "div" : "li";
  const size = props.static ? "w-14 h-14" : "w-12 h-12";
  const hover = props.static ? "" : "p-1 hover:bg-zinc-900";

  const el = h(
    rootEl,
    {
      class: ["flex items-center gap-2 rounded max-w-full", hover].join(" "),
    },
    h(
      "div",
      {},
      h("img", {
        src: props.artworkPath,
        alt: props.artist,
        class: ["rounded", size].join(" "),
      })
    ),
    h(
      "div",
      {
        class: "overflow-hidden",
      },
      h("h1", { class: "font-semibold truncate" }, props.title),
      h("h2", { class: "text-xs" }, props.artist)
    )
  );

  if (listeners) {
    for (const event in listeners) {
      // @ts-expect-error
      on(el, event, listeners[event]);
    }
  }

  return el;
}
