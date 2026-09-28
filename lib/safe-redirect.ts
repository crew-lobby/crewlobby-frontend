const DEFAULT_REDIRECT = "/dashboard";
const PLACEHOLDER_ORIGIN = "http://localhost";

export function getSafeRedirect(
  value: string | string[] | null | undefined,
  fallback: string = DEFAULT_REDIRECT,
): string {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate || !candidate.startsWith("/")) {
    return fallback;
  }

  try {
    const url = new URL(candidate, PLACEHOLDER_ORIGIN);

    if (url.origin !== PLACEHOLDER_ORIGIN) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function withRedirect(path: string, redirectTo: string): string {
  if (redirectTo === DEFAULT_REDIRECT) {
    return path;
  }

  return `${path}?redirect=${encodeURIComponent(redirectTo)}`;
}