const camelize = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

export const normalizeAttrs = (
  attrs: Record<string, unknown>,
): Record<string, unknown> => {
  const entries = Object.entries(attrs)
  const camelized = entries.map(([k, v]) => [camelize(k), v])
  return Object.fromEntries(camelized)
}
