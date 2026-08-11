import { db } from './index';
import { messages, replies, conversations, projects } from './schema';
import { and, eq, gt, ne, or } from 'drizzle-orm';

export async function getRecentActivity(userId: number, sinceStr: string) {
  const sinceDate = new Date(sinceStr);
  
  // Messages sent TO user
  const recentMessages = await db.select({
    id: messages.id,
    content: messages.content,
  })
  .from(messages)
  .innerJoin(conversations, eq(messages.conversationId, conversations.id))
  .where(
    and(
      gt(messages.createdAt, sinceDate),
      ne(messages.senderId, userId),
      or(
        eq(conversations.clientId, userId),
        eq(conversations.developerId, userId)
      )
    )
  );

  // Replies to user's projects
  const recentReplies = await db.select({
    id: replies.id,
    projectTitle: projects.title,
  })
  .from(replies)
  .innerJoin(projects, eq(replies.projectId, projects.id))
  .where(
    and(
      gt(replies.createdAt, sinceDate),
      ne(replies.developerId, userId), // don't notify if the user replied to their own project (rare but possible)
      eq(projects.clientId, userId)
    )
  );

  return { messages: recentMessages, replies: recentReplies };
}
