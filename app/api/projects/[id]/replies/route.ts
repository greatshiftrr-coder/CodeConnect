import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../../../../src/middleware/auth';
import { addReply } from '../../../../../src/db/replies';
import { getOrCreateUser } from '../../../../../src/db/users';

export async function POST(
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
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const reply = await addReply(parseInt(id, 10), dbUser.id, message);

    return NextResponse.json(reply);
  } catch (error: any) {
    console.error('Failed to create reply:', error);
    return NextResponse.json({ error: error.message || 'Failed to create reply' }, { status: 500 });
  }
}
