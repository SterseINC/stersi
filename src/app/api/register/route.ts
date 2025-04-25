import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const users = client.db().collection('users');

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ email, hashedPassword });

    return NextResponse.json({ message: 'User registered' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
