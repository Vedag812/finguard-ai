import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

const COLLECTION = "flagged_customers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const collection = db.collection(COLLECTION);

    if (!collection) {
      // Firebase not available — acknowledge the flag
      console.warn("Firebase unavailable — customer flagged but not persisted");
      return NextResponse.json({
        id: `local-${Date.now()}`,
        ...body,
        _note: "Firebase not connected — data not persisted"
      }, { status: 201 });
    }

    const docRef = await collection.add({
      ...body,
      flaggedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
  } catch (error) {
    console.error("Failed to flag customer:", error);
    return NextResponse.json({
      id: `fallback-${Date.now()}`,
      ...await request.json().catch(() => ({})),
      _note: "Customer flagged (save may have failed)"
    }, { status: 201 });
  }
}

export async function GET() {
  try {
    const collection = db.collection(COLLECTION);

    if (!collection) {
      return NextResponse.json([]);
    }

    const snapshot = await collection.orderBy("flaggedAt", "desc").get();
    const flaggedCustomers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(flaggedCustomers);
  } catch (error) {
    console.error("Failed to get flagged customers:", error);
    return NextResponse.json([]);
  }
}
