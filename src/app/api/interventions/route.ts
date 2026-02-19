import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

const COLLECTION = "interventions";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const collection = db.collection(COLLECTION);

        const docRef = await collection.add({
            ...body,
            approvedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
    } catch (error: any) {
        console.error("Critical Intervention Error:", error.message);
        return NextResponse.json({ error: "Failed to log intervention" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const collection = db.collection(COLLECTION);
        const snapshot = await collection.orderBy("approvedAt", "desc").get();
        const interventions = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(interventions);
    } catch (error: any) {
        console.error("Failed to fetch interventions:", error.message);
        return NextResponse.json([]);
    }
}

