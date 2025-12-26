export function toImageUrl(path) {
  if (!path) return "";
  // Already absolute URL
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.VITE_SUPABASE_UPLOADS_URL || "";
  return `${base}/${path}`;
}
