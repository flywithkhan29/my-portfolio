import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'contact'));
    if (snapshot.empty) return NextResponse.json(null);
    const docData = snapshot.docs[0];
    return NextResponse.json({ _id: docData.id, ...docData.data() });
  } catch (error) {
    return NextResponse.json(null);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const snapshot = await getDocs(collection(db, 'contact'));
    if (!snapshot.empty) {
      const ref = doc(db, 'contact', snapshot.docs[0].id);
      await updateDoc(ref, body);
      return NextResponse.json({ _id: snapshot.docs[0].id, ...body });
    }
    const docRef = await addDoc(collection(db, 'contact'), body);
    return NextResponse.json({ _id: docRef.id, ...body });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}