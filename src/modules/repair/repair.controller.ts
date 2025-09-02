import type { Context } from 'hono'
import { getCookie } from 'hono/cookie'
import { parse } from 'valibot'
import { CONFIG } from '@/config'
import { ApiError } from '@/exceptions'
import { decode, verify } from '@/utils'
import type { RepairService } from './repair.service'
import { CreateRepairSchema } from './schemas/createRepair.schema'

export class RepairController {
  constructor(private repairService: RepairService) {}

  getRepairs = async (c: Context) => {
    return c.json({ message: 'Get Repairs' })
  }

  createRepair = async (c: Context) => {
    const body = await c.req.json()
    const parsed = parse(CreateRepairSchema, body)

    const accessToken = getCookie(c, CONFIG.cookies.accessTokenName)
    if (!accessToken) {
      throw ApiError.Unauthorized('Missing accessToken token')
    }

    const [_, decoded] = await verify(accessToken)
    if (!decoded?.payload.sub) {
      throw ApiError.Forbidden('UserId not found in token')
    }

    await this.repairService.repairRepository.createRepair({
      ...parsed,
      userId: Number(decoded.payload.sub)
    })

    return c.json({ success: true }, 201)
  }

  deleteRepair = async (c: Context) => {
    return c.json({ message: 'Delete Repair' })
  }
}
