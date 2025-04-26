import { NextResponse } from 'next/server';
import { getShoppingListById } from '@/lib/models/ShoppingList';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// GET: Fetch single list
export async function GET(req: Request, { params }: { params: { listId: string } }) {
  try {
    const list = await getShoppingListById(params.listId);

    if (!list) {
      return NextResponse.json({ message: 'List not found' }, { status: 404 });
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PATCH: Update list title and description
export async function PATCH(req: Request, { params }: { params: { listId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { listId } = params;
  const { title, description } = await req.json();

  if (!title || title.trim() === '') {
    return NextResponse.json({ message: 'Title is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const result = await client
      .db()
      .collection('shopping_lists')
      .updateOne(
        { _id: new ObjectId(listId), userId: session.user.id },
        { $set: { title, description } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'List updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating list:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

//DELETE: Delete List
export async function DELETE(req: Request, { params }: { params: { listId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { listId } = params;

  try {
    const client = await clientPromise;
    const result = await client
      .db()
      .collection('shopping_lists')
      .deleteOne({ _id: new ObjectId(listId), userId: session.user.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'List deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting list:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
