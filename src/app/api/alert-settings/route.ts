import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

const SETTINGS_DOC = "settings/global_config";

const DEFAULT_SETTINGS = {
    thresholds: {
        riskScore: 75,
        utilization: 80,
        delinquency: 1
    },
    notifications: {
        email: true,
        slack: false,
        sms: false
    },
    autoEscalate: true
};

export async function GET() {
    try {
        const docRef = db.doc(SETTINGS_DOC);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json(DEFAULT_SETTINGS);
        }

        return NextResponse.json(doc.data());
    } catch (error: any) {
        console.error("Failed to get alert settings:", error.message);
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const docRef = db.doc(SETTINGS_DOC);

        await docRef.set({
            ...body,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        return NextResponse.json({ message: "Settings updated" });
    } catch (error: any) {
        console.error("Failed to save alert settings:", error.message);
        return NextResponse.json({ message: "Settings accepted (save may have failed)" });
    }
}

