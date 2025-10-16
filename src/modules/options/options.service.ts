import { config } from '@/config'
import { parseCsvRows as csvToRows, groupBy as groupRows, withCache } from '@/utils'

export function fetchOptions() {
  return withCache(
    config.cache.options.key,
    async () => {
      const response = await fetch(config.options.sheetUrl)
      const text = await response.text()

      const rows = csvToRows(text)

      return groupRows(rows)
    },
    config.cache.options.ttl,
  )
}
