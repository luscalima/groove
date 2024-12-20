type Attributes = { [key: string]: string };

type Element = HTMLElement | string;

export function h<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes?: Attributes,
  ...children: Element[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (attributes) {
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        element.setAttribute(key, attributes[key]);
      }
    }
  }

  children.flat().forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}
