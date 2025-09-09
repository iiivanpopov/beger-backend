export const parseCsv = (csv: string): Record<string, unknown>[] => {
  const [headerLine, ...lines] = csv.split('\n').filter(Boolean)
  const headers = headerLine?.split(',').map(h => h.trim())

  return lines.map((line: string) => {
    const values = line.split(',').map(v => v.trim())
    const obj: Record<string, unknown> = {}
    headers?.forEach((h, i) => (obj[h] = values[i]))
    return obj
  })
}
