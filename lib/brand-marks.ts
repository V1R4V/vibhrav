// Official vector lockups avoid the padding baked into the old raster files.
// Sources are recorded beside the assets in public/company-logos/SOURCES.md.
export function brandAsset(slug: string, fallback: string) {
  if (slug === "cs574") return "/company-logos/wisconsin-official.svg"
  if (slug === "vdart") return "/company-logos/vdart-official.svg"
  return fallback
}
