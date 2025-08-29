import type { TokenRepository, UserRepository } from '@/db'
import { ApiError } from '@/exceptions'
import { compare, hash, signJWTs } from '@/utils'
import type { LoginData } from './schemas'
import type { RegisterData } from './schemas/register.schema'

export class AuthService {
  constructor(
    public userRepository: UserRepository,
    private tokenRepository: TokenRepository
  ) {}

  async register(userPayload: RegisterData) {
    const passwordHash = await hash(userPayload.password)

    const [user] = await this.userRepository.createUser({
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

    await this.tokenRepository.createToken({
      token: tokens.refreshToken,
      userId: user.id
    })

    return tokens
  }

  async login(userPayload: LoginData) {
    const [user] = await this.userRepository.findUserByUserName(
      userPayload.userName
    )

    if (!user) {
      throw ApiError.NotFound('User not found')
    }

    const isPasswordEquals = compare(userPayload.password, user.passwordHash)
    if (!isPasswordEquals) {
      throw ApiError.Unauthorized('Password does not match')
    }

    const tokens = await signJWTs({ sub: user.id.toString(), role: user.role })

    await this.tokenRepository.upsertToken({
      token: tokens.refreshToken,
      userId: user.id
    })

    return tokens
  }

  async logout(refreshToken: string) {
    await this.tokenRepository.deleteTokenByToken(refreshToken)
  }

  async refresh(refreshToken: string) {
    const [user] = await this.userRepository.findUserByToken(refreshToken)
    if (!user) {
      throw ApiError.NotFound('User not found')
    }

    const tokens = await signJWTs({
      sub: user.users.id.toString(),
      role: user.users.role
    })

    await this.tokenRepository.updateTokenById(user.tokens.id, {
      token: tokens.refreshToken
    })

    return tokens
  }
}
