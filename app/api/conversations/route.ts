import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../../src/middleware/auth';
import { getOrCreateUser } from '../../../src/db/users';
import { getConversationsForUser, createOrGetConversation } from '../../../src/db/messages';

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await getOrCreateUser(authUser.uid, authUser.email || '', authUser.name || 'Anonymous');
    const convos = await getConversationsForUser(dbUser.id);
    return NextResponse.json(convos);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await getOrCreateUser(authUser.uid, authUser.email || '', authUser.name || 'Anonymous');
    const { projectId, clientId, developerId } = await req.json();

    if (dbUser.id !== clientId && dbUser.id !== developerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const convo = await createOrGetConversation(projectId, clientId, developerId);
    return NextResponse.json(convo);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
