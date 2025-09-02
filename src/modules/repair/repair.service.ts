import type { RepairRepository, UserRepository } from '@/db'

export class RepairService {
  constructor(
    private userRepository: UserRepository,
    public repairRepository: RepairRepository
  ) {}
}
