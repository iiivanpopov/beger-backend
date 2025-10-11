export function parseCsvRows(csv: string): Record<string, unknown>[] {
  const [headerLine, ...lines] = csv.split('\n')
  const headers = headerLine?.split(',').map(h => h.trim())

  return lines.map((line: string) => {
    const values = line.split(',').map(v => v.trim())

    const obj: Record<string, unknown> = {}

    headers?.forEach((header, i) => {
      obj[header] = values[i]
    })

    return obj
  })
}
