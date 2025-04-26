import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getShoppingLists, createShoppingList } from '@/lib/models/ShoppingList';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const lists = await getShoppingLists(session.user.id);
    return NextResponse.json(lists, { status: 200 });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, description } = await req.json();

  if (!title || title.trim() === '') {
    return NextResponse.json({ message: 'Title is required' }, { status: 400 });
  }

  try {
    const insertedId = await createShoppingList(session.user.id, title, description);

    return NextResponse.json({
      _id: insertedId,
      title,
      description,
      userId: session.user.id,
      items: [],
      createdAt: new Date(),
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
