import Memcached from 'memcached'
import { CONFIG } from '@/config'

export const memcached = new Memcached(CONFIG.cache.URL)

export async function setCache(
  key: string,
  value: unknown,
  ttl: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    memcached.set(key, value, ttl, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function getCache<T>(key: string): Promise<T | null> {
  return new Promise((resolve, reject) => {
    memcached.get(key, (err, data) => {
      if (err) reject(err)
      else resolve((data as T) || null)
    })
  })
}
