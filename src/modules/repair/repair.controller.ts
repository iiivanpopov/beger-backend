import type { Context } from 'hono'
import { parse } from 'valibot'
import { ApiError } from '@/exceptions'
import { type UserJwtPayload } from '@/utils'
import type { RepairService } from './repair.service'
import { CreateRepairSchema } from './schemas/createRepair.schema'

export class RepairController {
  constructor(private repairService: RepairService) {}

  getRepairs = async (c: Context) => {
    const user = c.var.user as UserJwtPayload

    const repairs = await this.repairService.repairRepository.findByUserId(
      Number(user.sub),
      { limit: 10, latest: true }
    )

    return c.json({ repairs }, 200)
  }

  createRepair = async (c: Context) => {
    const parsed = parse(CreateRepairSchema, await c.req.json())

    const user = c.var.user as UserJwtPayload

    await this.repairService.repairRepository.create({
      ...parsed,
      userId: Number(user.sub)
    })

    return c.json({ success: true }, 201)
  }

  deleteRepair = async (c: Context) => {
    const repairId = c.req.param('id')
    if (!repairId) {
      throw ApiError.BadRequest('Missing {id} param')
    }

    const user = c.var.user as UserJwtPayload

    await this.repairService.repairRepository.delete(
      Number(repairId),
      Number(user.sub)
    )

    return c.json({ success: true }, 200)
  }
}
