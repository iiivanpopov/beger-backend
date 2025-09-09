import type { TestResultRepository, UserRepository } from '@/db'

export class TestResultService {
  constructor(
    public testResultRepository: TestResultRepository,
    public userRepository: UserRepository
  ) {}
}
