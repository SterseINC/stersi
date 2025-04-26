import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request, { params }: { params: { listId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { email } = await req.json();
  const client = await clientPromise;

  const userToShare = await client.db().collection('users').findOne({ email });

  if (!userToShare) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const list = await client
    .db()
    .collection('shopping_lists')
    .findOne({ _id: new ObjectId(params.listId) });

  if (!list) {
    return NextResponse.json({ message: 'List not found' }, { status: 404 });
  }

  // Only allow owner to share
  if (list.userId !== session.user.id) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
  }

  // Prevent double-sharing
  if (list.sharedWith?.includes(userToShare._id.toString())) {
    return NextResponse.json({ message: 'User already shared' }, { status: 400 });
  }

  await client
    .db()
    .collection('shopping_lists')
    .updateOne(
        { _id: new ObjectId(params.listId) },
        { $push: { sharedWith: { $each: [userToShare._id.toString()] } } } as any
  );


  return NextResponse.json({ message: 'List shared successfully' });
}
