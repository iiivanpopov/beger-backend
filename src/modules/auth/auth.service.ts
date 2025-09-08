import type { TokenRepository, UserRepository } from '@/db'
import { ApiError } from '@/exceptions'
import { compare, hash, signJWTs } from '@/utils'
import type { LoginData } from './schemas'
import type { RegisterData } from './schemas/register.schema'

export class AuthService {
  constructor(
    public userRepository: UserRepository,
    public tokenRepository: TokenRepository
  ) {}

  async register(userPayload: RegisterData) {
    const passwordHash = await hash(userPayload.password)

    const user = await this.userRepository.create({
      passwordHash,
      fullName: userPayload.fullName,
      userName: userPayload.userName,
      role: 'user'
    })

    if (!user) {
      throw ApiError.InternalError('User creation failed')
    }

    const tokens = await signJWTs({
      sub: user.id.toString(),
      role: user.role
    })

    await this.tokenRepository.create({
      token: tokens.refreshToken,
      userId: user.id
    })

    return tokens
  }

  async login(userPayload: LoginData) {
    const user = await this.userRepository.findByUserName(userPayload.userName)

    if (!user) {
      throw ApiError.NotFound('User not found')
    }

    const isPasswordEquals = compare(userPayload.password, user.passwordHash)
    if (!isPasswordEquals) {
      throw ApiError.Unauthorized('Password does not match')
    }

    const tokens = await signJWTs({ sub: user.id.toString(), role: user.role })

    await this.tokenRepository.upsert({
      token: tokens.refreshToken,
      userId: user.id
    })

    return tokens
  }

  async logout(refreshToken: string) {
    await this.tokenRepository.deleteByToken(refreshToken)
  }

  async refresh(refreshToken: string) {
    const user = await this.userRepository.findByToken(refreshToken)
    if (!user) {
      throw ApiError.NotFound('User not found')
    }

    const tokens = await signJWTs({
      sub: user.id.toString(),
      role: user.role
    })

    await this.tokenRepository.updateById(user.tokenId, {
      token: tokens.refreshToken
    })

    return tokens
  }
}
