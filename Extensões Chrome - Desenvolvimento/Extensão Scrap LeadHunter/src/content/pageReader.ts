export type PageSnapshot = {
  url: string;
  title: string;
  text: string;
  links: string[];
};

export function readPage(): PageSnapshot {
  const links = Array.from(document.querySelectorAll("a[href]"))
    .map((a) => (a as HTMLAnchorElement).href || "")
    .filter(Boolean);
  const text = document.body ? (document.body.innerText || document.body.textContent || "") : "";
  return {
    url: location.href,
    title: document.title || "",
    text,
    links,
  };
}

