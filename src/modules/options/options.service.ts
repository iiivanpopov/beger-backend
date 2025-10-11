import { config } from '@/config'
import { parseCsvRows, withCache } from '@/utils'

export function fetchOptions() {
  return withCache(
    config.cache.options.key,
    async () => {
      const response = await fetch(config.options.sheetUrl)
      const text = await response.text()

      const parsed = parseCsvRows(text)

      const options = parsed.reduce<Record<string, unknown[]>>((acc, row) => {
        for (const [key, value] of Object.entries(row))
          (acc[key] ??= []).push(value)
        return acc
      }, {})

      return options
    },
    config.cache.options.ttl,
  )
}
