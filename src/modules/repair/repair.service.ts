import type { RepairRepository, UserRepository } from '@/db'

export class RepairService {
  constructor(
    public userRepository: UserRepository,
    public repairRepository: RepairRepository
  ) {}
}
