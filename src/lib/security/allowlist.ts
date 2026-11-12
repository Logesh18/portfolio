/**
 * Explicit owner-approved external URL allowlist.
 * Only links in this allowlist (or internal portfolio routes starting with "/" or "#")
 * may be displayed or returned by the AI assistant.
 */
export const APPROVED_EXTERNAL_URLS = new Set<string>([
  "https://github.com/Logesh18",
  "https://linkedin.com/in/logesh-t-25a43319b/",
  "https://www.credly.com/badges/520937b9-380b-4160-ba73-590fa6db1156/linked_in",
  "https://coursera.org/share/c1f11a3c791e37d435f0390c5acbcb45",
  "https://ieeexplore.ieee.org/document/9740832",
  "https://ieeexplore.ieee.org/document/10113900",
]);

export function isApprovedUrl(href: string): boolean {
  if (!href) return false;
  const trimmed = href.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }
  if (trimmed.startsWith("#")) {
    return true;
  }
  return APPROVED_EXTERNAL_URLS.has(trimmed);
}

export function filterApprovedLinks<T extends { href?: string; url?: string }>(
  links: T[]
): T[] {
  return links.filter((item) => {
    const target = item.href ?? item.url ?? "";
    return isApprovedUrl(target);
  });
}
