import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../../../src/middleware/auth';
import { getOrCreateUser } from '../../../../src/db/users';

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();
    const dbUser = await getOrCreateUser(user.uid, user.email || '', name || user.name || 'Anonymous');

    return NextResponse.json({ user: dbUser });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
