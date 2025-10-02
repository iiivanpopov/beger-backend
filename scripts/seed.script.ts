import { db, usersTable } from '@/database'
import { log } from '@/utils'

db.insert(usersTable)
  .values({
    fullName: 'Admin',
    userName: 'admin',
    passwordHash: await Bun.password.hash(process.env.ADMIN_PASSWORD!),
    role: 'admin'
  })
  .onConflictDoNothing()
  .then(() => log.info('Admin seeded successfully.'))
  .catch(error => log.error(error))
