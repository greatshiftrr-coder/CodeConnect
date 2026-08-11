import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, deleteProject } from '../../../../src/db/projects';
import { verifyAuth } from '../../../../src/middleware/auth';
import { getOrCreateUser } from '../../../../src/db/users';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProjectById(parseInt(id, 10));
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Failed to get project:', error);
    return NextResponse.json({ error: error.message || 'Failed to get project' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getOrCreateUser(authUser.uid, authUser.email || '', authUser.name || 'Anonymous');
    const { id } = await params;

    await deleteProject(parseInt(id, 10), dbUser.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete project' }, { status: 500 });
  }
}
