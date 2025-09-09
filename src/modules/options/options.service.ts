import { CONFIG } from '@/config'
import { getCache, parseCsv, setCache } from '@/utils'

export class OptionsService {
  private parseOptions(
    array: Record<string, unknown>[]
  ): Record<string, unknown[]> {
    return array.reduce<Record<string, unknown[]>>((acc, row) => {
      for (const [key, value] of Object.entries(row)) {
        ;(acc[key] ??= []).push(value)
      }
      return acc
    }, {})
  }

  async getOptions() {
    const cached = await getCache('options')
    if (cached) return cached

    const response = await fetch(CONFIG.options.sheetUrl)
    const text = await response.text()
    const parsed = parseCsv(text)
    const options = this.parseOptions(parsed)

    await setCache('options', options, 60 * 5)

    return options
  }
}
