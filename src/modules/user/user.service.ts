import type { TokenRepository, UserRepository } from '@/db'

export class UserService {
  constructor(
    public userRepository: UserRepository,
    public tokenRepository: TokenRepository
  ) {}

  async deactivate(userId: number) {
    await this.tokenRepository.deleteByUserId(userId)
    await this.userRepository.deleteById(userId)
  }
}
