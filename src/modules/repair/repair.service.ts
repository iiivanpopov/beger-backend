import type { RepairRepository, UserRepository } from '@/db'
import type { CreateRepairData } from './schemas/createRepair.schema'

export class RepairService {
  constructor(
    private userRepository: UserRepository,
    public repairRepository: RepairRepository
  ) {}

  createRepair = (payload: CreateRepairData, userId: number) =>
    this.repairRepository.create({
      ...payload,
      userId
    })
}
