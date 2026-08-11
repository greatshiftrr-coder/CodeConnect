import { db } from './index';
import { replies } from './schema';

export async function addReply(projectId: number, developerId: number, message: string) {
  const result = await db.insert(replies).values({
    projectId,
    developerId,
    message,
  }).returning();
  return result[0];
}
