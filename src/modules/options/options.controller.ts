import type { Context } from 'hono'
import type { OptionsService } from './options.service'

export class OptionsController {
  constructor(private optionsService: OptionsService) {}

  async getOptions(c: Context) {
    const options = await this.optionsService.getOptions()

    return c.json(options, 200)
  }
}
