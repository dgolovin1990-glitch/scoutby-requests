import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const tickets=sqliteTable('tickets',{
 id:text('id').primaryKey(), text:text('text').notNull(), house:text('house').notNull(), category:text('category').notNull(), additional:text('additional').notNull().default(''), urgency:text('urgency').notNull(), recipient:text('recipient').notNull(), status:text('status').notNull().default('Новая'), review:integer('review').notNull().default(1), source:text('source').notNull().default('resident'), sourceDate:text('source_date'), createdAt:text('created_at').notNull(), updatedAt:text('updated_at').notNull(), tokenHash:text('token_hash'), version:integer('version').notNull().default(1),lastChange:text('last_change')
});
export const events=sqliteTable('ticket_events',{id:text('id').primaryKey(),ticketId:text('ticket_id').notNull(),at:text('at').notNull(),action:text('action').notNull(),note:text('note').notNull().default('')});
export const meta=sqliteTable('app_meta',{key:text('key').primaryKey(),value:text('value').notNull()});
