import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId, WithId } from 'mongodb';

type ShoppingList = {
  userId: string;
  title: string;
  description: string;
  items: Array<{ name: string; quantity?: string; bought: boolean }>;
  sharedWith?: string[];
  createdAt: Date;
};

type User = {
  _id: ObjectId;
  email: string;
  hashedPassword?: string;
};

export async function POST(
  req: Request,
  { params }: { params: { listId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { email }: { email: string } = await req.json();
  const client = await clientPromise;

  const usersCollection = client.db().collection<User>('users');
  const shoppingListsCollection = client.db().collection<ShoppingList>('shopping_lists');

  const userToShare = await usersCollection.findOne({ email });

  if (!userToShare) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const list = await shoppingListsCollection.findOne({ _id: new ObjectId(params.listId) });

  if (!list) {
    return NextResponse.json({ message: 'List not found' }, { status: 404 });
  }

  if (list.userId !== session.user.id) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
  }

  const sharedWithArray: string[] = list.sharedWith ?? [];

  if (sharedWithArray.includes(userToShare._id.toString())) {
    return NextResponse.json({ message: 'User already shared' }, { status: 400 });
  }

  await shoppingListsCollection.updateOne(
    { _id: new ObjectId(params.listId) },
    { $push: { sharedWith: userToShare._id.toString() } } // ✅ no $each needed
  );

  return NextResponse.json({ message: 'List shared successfully' });
}
