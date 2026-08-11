import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../../src/middleware/auth';
import { getOrCreateUser } from '../../../src/db/users';
import { getRecentActivity } from '../../../src/db/notifications';

export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const since = req.nextUrl.searchParams.get('since');
    if (!since) return NextResponse.json({ error: 'Missing since parameter' }, { status: 400 });

    const dbUser = await getOrCreateUser(authUser.uid, authUser.email || '', authUser.name || 'Anonymous');
    const activity = await getRecentActivity(dbUser.id, since);
    
    return NextResponse.json(activity);
  } catch (err: any) {
    console.error('Failed to get notifications:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
