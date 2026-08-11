import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../../src/middleware/auth';
import { getProjects, createProject } from '../../../src/db/projects';
import { getOrCreateUser } from '../../../src/db/users';

export async function GET(req: NextRequest) {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Failed to get projects:', error);
    return NextResponse.json({ error: error.message || 'Failed to get projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Need to get the DB user to get the internal client_id
    const dbUser = await getOrCreateUser(authUser.uid, authUser.email || '', authUser.name || 'Anonymous');

    const data = await req.json();
    const newProject = await createProject({
      clientId: dbUser.id,
      title: data.title,
      description: data.description,
      budgetType: data.budgetType,
      budgetMin: data.budgetMin ? parseInt(data.budgetMin) : undefined,
      budgetMax: data.budgetMax ? parseInt(data.budgetMax) : undefined,
      skills: data.skills || [],
    });

    return NextResponse.json(newProject);
  } catch (error: any) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 500 });
  }
}
