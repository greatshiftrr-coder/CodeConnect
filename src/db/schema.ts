import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('client'), // 'client' or 'developer'
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  budgetType: varchar('budget_type', { length: 50 }).notNull(), // 'FIXED PRICE' or 'HOURLY'
  budgetMin: integer('budget_min'),
  budgetMax: integer('budget_max'),
  deadline: timestamp('deadline'),
  status: varchar('status', { length: 50 }).notNull().default('OPEN'), // OPEN, IN_PROGRESS, COMPLETED
  createdAt: timestamp('created_at').defaultNow(),
});

export const projectSkills = pgTable('project_skills', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  skill: text('skill').notNull(),
});

export const replies = pgTable('replies', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  developerId: integer('developer_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  replies: many(replies),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(users, {
    fields: [projects.clientId],
    references: [users.id],
  }),
  skills: many(projectSkills),
  replies: many(replies),
}));

export const projectSkillsRelations = relations(projectSkills, ({ one }) => ({
  project: one(projects, {
    fields: [projectSkills.projectId],
    references: [projects.id],
  }),
}));

export const repliesRelations = relations(replies, ({ one }) => ({
  project: one(projects, {
    fields: [replies.projectId],
    references: [projects.id],
  }),
  developer: one(users, {
    fields: [replies.developerId],
    references: [users.id],
  }),
}));

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  clientId: integer('client_id').references(() => users.id).notNull(),
  developerId: integer('developer_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').references(() => conversations.id).notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  project: one(projects, {
    fields: [conversations.projectId],
    references: [projects.id],
  }),
  client: one(users, {
    fields: [conversations.clientId],
    references: [users.id],
    relationName: 'clientConversations',
  }),
  developer: one(users, {
    fields: [conversations.developerId],
    references: [users.id],
    relationName: 'developerConversations',
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));
