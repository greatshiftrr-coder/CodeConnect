import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../../../src/middleware/auth';
import { getOrCreateUser } from '../../../../src/db/users';
import { getConversation, sendMessage } from '../../../../src/db/messages';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await getOrCreateUser(authUser.uid, authUser.email || '', authUser.name || 'Anonymous');
    const { id } = await params;
    const convo = await getConversation(parseInt(id, 10), dbUser.id);
    
    if (!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(convo);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await getOrCreateUser(authUser.uid, authUser.email || '', authUser.name || 'Anonymous');
    const { id } = await params;
    
    const convoId = parseInt(id, 10);
    const convo = await getConversation(convoId, dbUser.id);
    if (!convo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { content, imageUrl } = await req.json();
    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 });

    const msg = await sendMessage(convoId, dbUser.id, content, imageUrl);
    return NextResponse.json(msg);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
