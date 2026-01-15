import { drizzle } from 'drizzle-orm/d1'

export const createDrizzleClient = (env: Env) =>
  drizzle(env.DB, { casing: 'snake_case' })
