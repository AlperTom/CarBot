export function getMeta(title, description) {
  return {
    title,
    description,
    openGraph: { title, description }
  }
}