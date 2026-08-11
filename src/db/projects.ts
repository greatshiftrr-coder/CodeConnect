import { db } from './index';
import { projects, projectSkills, replies, conversations, messages } from './schema';
import { desc, eq, inArray } from 'drizzle-orm';

export async function deleteProject(projectId: number, userId: number) {
  return await db.transaction(async (tx) => {
    // verify owner
    const proj = await tx.select().from(projects).where(eq(projects.id, projectId));
    if (!proj || proj.length === 0 || proj[0].clientId !== userId) {
      throw new Error("Unauthorized or not found");
    }

    // delete messages (via conversations)
    const projectConvos = await tx.select().from(conversations).where(eq(conversations.projectId, projectId));
    const convoIds = projectConvos.map(c => c.id);
    if (convoIds.length > 0) {
      await tx.delete(messages).where(inArray(messages.conversationId, convoIds));
      await tx.delete(conversations).where(eq(conversations.projectId, projectId));
    }

    // delete replies
    await tx.delete(replies).where(eq(replies.projectId, projectId));
    
    // delete skills
    await tx.delete(projectSkills).where(eq(projectSkills.projectId, projectId));

    // delete project
    await tx.delete(projects).where(eq(projects.id, projectId));
    
    return true;
  });
}

export async function createProject(data: {
  clientId: number;
  title: string;
  description: string;
  budgetType: string;
  budgetMin?: number;
  budgetMax?: number;
  deadline?: Date;
  skills: string[];
}) {
  const result = await db.transaction(async (tx) => {
    const newProjects = await tx.insert(projects).values({
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      budgetType: data.budgetType,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      deadline: data.deadline,
    }).returning();

    const projectId = newProjects[0].id;

    if (data.skills && data.skills.length > 0) {
      const skillsToInsert = data.skills.map(skill => ({
        projectId,
        skill
      }));
      await tx.insert(projectSkills).values(skillsToInsert);
    }
    
    return newProjects[0];
  });
  
  return result;
}

export async function getProjects() {
  const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));
  
  // To avoid complex joins, we can query skills for all projects, or do it iteratively (fine for now)
  // But standard drizzle query API is cleaner:
  return await db.query.projects.findMany({
    with: {
      client: true,
      skills: true,
    },
    orderBy: [desc(projects.createdAt)],
  });
}

export async function getProjectById(id: number) {
  return await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      client: true,
      skills: true,
      replies: {
        with: {
          developer: true,
        },
        orderBy: (replies, { desc }) => [desc(replies.createdAt)],
      },
    },
  });
}
