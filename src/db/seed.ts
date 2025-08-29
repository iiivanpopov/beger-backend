import { hash, log } from '@/utils'
import { db, users } from './index'

async function main() {
  const passwordHash = await hash(process.env.ADMIN_PASSWORD ?? 'admin123')

  await db
    .insert(users)
    .values({
      fullName: 'Super Admin',
      userName: 'admin',
      passwordHash,
      role: 'admin'
    })
    .onConflictDoNothing()

  log.info('✅ Admin seeded')
}

main()
  .then(() => process.exit(0))
  .catch(e => log.error(e))
