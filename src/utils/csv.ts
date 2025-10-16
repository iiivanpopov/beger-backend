export function parseCsvRows(csv: string): Record<string, string>[] {
  const [headerLine, ...lines] = csv.split('\n')
  if (!headerLine)
    return []

  const headers = headerLine.split(',').map(h => h.trim())

  return lines.map((line) => {
    const values = line.split(',').map(v => v.trim())
    const obj: Record<string, string> = {}

    headers.forEach((header, i) => {
      obj[header] = values[i] ?? ''
    })

    return obj
  })
}
