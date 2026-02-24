import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const ref = doc(db, 'projects', id);
    await updateDoc(ref, body);
    return NextResponse.json({ _id: id, ...body });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    await deleteDoc(doc(db, 'projects', id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}