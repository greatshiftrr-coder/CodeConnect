import { db } from './index';
import { conversations, messages, projects, users } from './schema';
import { desc, eq, or, and } from 'drizzle-orm';

export async function getConversationsForUser(userId: number) {
  return await db.query.conversations.findMany({
    where: or(eq(conversations.clientId, userId), eq(conversations.developerId, userId)),
    with: {
      project: true,
      client: true,
      developer: true,
    },
    orderBy: [desc(conversations.createdAt)],
  });
}

export async function getConversation(conversationId: number, userId: number) {
  const convo = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
    with: {
      project: true,
      client: true,
      developer: true,
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.createdAt)],
        with: {
          sender: true,
        }
      }
    }
  });

  if (!convo || (convo.clientId !== userId && convo.developerId !== userId)) {
    return null;
  }
  return convo;
}

export async function createOrGetConversation(projectId: number, clientId: number, developerId: number) {
  const existing = await db.query.conversations.findFirst({
    where: and(
      eq(conversations.projectId, projectId),
      eq(conversations.clientId, clientId),
      eq(conversations.developerId, developerId)
    )
  });

  if (existing) return existing;

  const newConvo = await db.insert(conversations).values({
    projectId,
    clientId,
    developerId,
  }).returning();

  return newConvo[0];
}

export async function sendMessage(conversationId: number, senderId: number, content: string, imageUrl?: string) {
  const newMsg = await db.insert(messages).values({
    conversationId,
    senderId,
    content,
    imageUrl,
  }).returning();
  return newMsg[0];
}
