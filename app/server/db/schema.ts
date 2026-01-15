import { sqliteTable } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable('posts', (t) => ({
  id: t.integer().primaryKey({ autoIncrement: true }),
  title: t.text().notNull(),
  content: t.text().notNull(),
}))
