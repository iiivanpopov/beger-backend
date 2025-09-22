import Memcached from 'memcached'
import { config } from '@/config'

export const memcached = new Memcached(config.cache.url)

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

export const withCache = async <T>(
  key: string,
  loader: () => Promise<T>,
  ttl: number
) => {
  const cached = await getCache(key)
  if (cached) return cached

  const data = await loader()

  await setCache(key, data, ttl)

  return data
}
