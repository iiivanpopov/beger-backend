import { Hono } from 'hono'
import { CONFIG } from '@/config'
import { db, RepairRepository, UserRepository } from '@/db'
import { RepairController } from './repair.controller'
import { RepairService } from './repair.service'

export const repairRouter = new Hono()

const userRepository = new UserRepository(db)
const repairRepository = new RepairRepository(db)
const repairService = new RepairService(userRepository, repairRepository)
const repairController = new RepairController(repairService)

const routes = CONFIG.routes.records.repairs

repairRouter.get(routes.root, repairController.getRepairs)
repairRouter.post(routes.root, repairController.createRepair)
repairRouter.delete(routes.by_id, repairController.deleteRepair)
