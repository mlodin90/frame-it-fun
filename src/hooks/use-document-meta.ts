import { useEffect } from "react";

interface MetaOptions {
  title: string;
  description?: string;
  ogImage?: string;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useDocumentMeta({ title, description, ogImage }: MetaOptions) {
  useEffect(() => {
    document.title = title;
    setMeta("og:title", title, "property");
    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
    }
    if (ogImage) {
      setMeta("og:image", ogImage, "property");
      setMeta("twitter:image", ogImage);
    }
  }, [title, description, ogImage]);
}
