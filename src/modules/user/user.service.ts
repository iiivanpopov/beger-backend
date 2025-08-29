import type { TokenRepository, UserRepository } from '@/db'

export class UserService {
  constructor(
    public userRepository: UserRepository,
    private tokenRepository: TokenRepository
  ) {}

  async deactivate(userId: number) {
    await this.tokenRepository.deleteTokenByUserId(userId)
    await this.userRepository.deleteUserById(userId)
  }
}
