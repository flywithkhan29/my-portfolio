import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore';

export async function GET() {
  try {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const docRef = await addDoc(collection(db, 'projects'), {
      ...body,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ _id: docRef.id, ...body });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}