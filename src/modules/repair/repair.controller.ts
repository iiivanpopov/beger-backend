import type { Context } from 'hono'
import { getCookie } from 'hono/cookie'
import { parse } from 'valibot'
import { CONFIG } from '@/config'
import { ApiError } from '@/exceptions'
import { verify } from '@/utils'
import type { RepairService } from './repair.service'
import { CreateRepairSchema } from './schemas/createRepair.schema'

export class RepairController {
  constructor(private repairService: RepairService) {}

  getRepairs = async (c: Context) => {
    const accessToken = getCookie(c, CONFIG.cookies.accessTokenName)
    if (!accessToken) {
      throw ApiError.Unauthorized('Missing accessToken token')
    }

    const [verified, decoded] = await verify(accessToken)
    if (!verified) {
      throw ApiError.Unauthorized()
    }

    const repairs = await this.repairService.repairRepository.findByUserId(
      Number(decoded.payload.sub),
      { limit: 10, latest: true }
    )

    return c.json({ repairs })
  }

  createRepair = async (c: Context) => {
    const body = await c.req.json()
    const parsed = parse(CreateRepairSchema, body)

    const accessToken = getCookie(c, CONFIG.cookies.accessTokenName)
    if (!accessToken) {
      throw ApiError.Unauthorized('Missing accessToken token')
    }

    const [verified, decoded] = await verify(accessToken)
    if (!verified) {
      throw ApiError.Unauthorized()
    }

    await this.repairService.createRepair(parsed, Number(decoded.payload.sub))
    return c.json({ success: true }, 201)
  }

  deleteRepair = async (c: Context) => {
    const repairId = c.req.param('id')
    if (!repairId) {
      throw ApiError.BadRequest('Missing {id} param')
    }

    const accessToken = getCookie(c, CONFIG.cookies.accessTokenName)
    if (!accessToken) {
      throw ApiError.Unauthorized('Missing accessToken token')
    }

    const [verified, decoded] = await verify(accessToken)
    if (!verified) {
      throw ApiError.Unauthorized()
    }

    await this.repairService.repairRepository.delete(
      Number(repairId),
      Number(decoded.payload.sub)
    )

    return c.json({ success: true }, 200)
  }
}
