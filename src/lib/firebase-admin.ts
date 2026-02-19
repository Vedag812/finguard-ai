import * as admin from 'firebase-admin';

// Simple in-memory storage for session persistence when Firebase is unavailable
const memoryStore: Record<string, any[]> = {
    flagged_customers: [],
    interventions: [],
    settings: [{
        id: 'global_config',
        thresholds: { riskScore: 75, utilization: 80, delinquency: 1 },
        notifications: { email: true, slack: false, sms: false },
        autoEscalate: true
    }]
};

let firebaseInitialized = false;
let useMemoryFallback = false;
let initError: string | null = null;

async function checkFirestoreConnectivity() {
    try {
        const firestore = admin.firestore();
        // Try a very simple list check to see if database exists & API is enabled
        await firestore.listCollections();
        console.log('✅ Firestore connectivity verified');
        useMemoryFallback = false;
    } catch (err: any) {
        if (err.code === 5 || err.message.includes('NOT_FOUND') || err.message.includes('SERVICE_DISABLED')) {
            console.warn('⚠ Firestore Service Disabled or Not Found. Switching to Memory Mode.');
            useMemoryFallback = true;
        } else {
            console.error('❌ Firestore Connectivity Error:', err.message);
            useMemoryFallback = true;
        }
    }
}

function initializeFirebase() {
    if (firebaseInitialized) return true;
    if (initError) return false;

    if (admin.apps.length > 0) {
        firebaseInitialized = true;
        return true;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        initError = 'Firebase credentials missing';
        useMemoryFallback = true;
        return false;
    }

    // Aggressive cleaning to handle Vercel's multi-line env var quirks
    privateKey = privateKey.trim().replace(/^["']|["']$/g, '')
        .replace(/\\\\n/g, '\n').replace(/\\n/g, '\n')
        .replace(/\\r/g, '').replace(/\r/g, '');

    try {
        admin.initializeApp({
            credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        });
        firebaseInitialized = true;
        console.log('✅ Firebase initialized (Checking connectivity...)');

        // Non-blocking connectivity check
        checkFirestoreConnectivity();

        return true;
    } catch (err: any) {
        initError = err.message;
        console.warn('⚠ Firebase init failed, using Memory Mode:', err.message);
        useMemoryFallback = true;
        return false;
    }
}

export function getDb(): admin.firestore.Firestore | null {
    if (!initializeFirebase()) return null;
    if (useMemoryFallback) return null;
    return admin.firestore();
}

// ========================
// MOCK COLLECTION PROXY
// ========================

class MockQuery {
    private data: any[];
    constructor(data: any[]) { this.data = data; }
    orderBy() { return this; }
    limit() { return this; }
    async get() {
        return {
            exists: this.data.length > 0,
            docs: this.data.map(d => ({ id: d.id || 'mock-id', data: () => d })),
            data: () => this.data[0]
        };
    }
}

class MockCollection {
    private name: string;
    constructor(name: string) { this.name = name; }
    orderBy() { return new MockQuery(memoryStore[this.name] || []); }
    async add(data: any) {
        const doc = { id: `mock-${Date.now()}`, ...data };
        if (!memoryStore[this.name]) memoryStore[this.name] = [];
        memoryStore[this.name].push(doc);
        return doc;
    }
    async get() { return new MockQuery(memoryStore[this.name] || []).get(); }
}

class MockDoc {
    private path: string;
    constructor(path: string) { this.path = path; }
    async get() {
        const [col, id] = this.path.split('/');
        const data = memoryStore[col]?.find(d => d.id === id) || (col === 'settings' ? memoryStore.settings[0] : null);
        return { exists: !!data, data: () => data };
    }
    async set(data: any, options: any) {
        const [col, id] = this.path.split('/');
        if (col === 'settings') memoryStore.settings[0] = { ...memoryStore.settings[0], ...data };
        else {
            if (!memoryStore[col]) memoryStore[col] = [];
            memoryStore[col].push({ id, ...data });
        }
        return { success: true };
    }
}

// Export a proxy — handles Firebase or Memory Fallback automatically
export const db = {
    collection: (name: string) => {
        const firestore = getDb();
        if (!firestore) return new MockCollection(name) as any;

        const realCollection = firestore.collection(name);

        // Return a stable wrapper object that delegates methods explicitly
        return {
            add: async (data: any) => {
                try {
                    return await realCollection.add(data);
                } catch (err: any) {
                    if (err.message.includes('NOT_FOUND') || err.message.includes('SERVICE_DISABLED')) {
                        console.warn(`⚠ Firestore collection "${name}" not found. Falling back to Memory.`);
                        useMemoryFallback = true;
                        return new MockCollection(name).add(data);
                    }
                    throw err;
                }
            },
            get: async () => {
                try {
                    return await realCollection.get();
                } catch (err: any) {
                    if (err.message.includes('NOT_FOUND') || err.message.includes('SERVICE_DISABLED')) {
                        useMemoryFallback = true;
                        return new MockCollection(name).get();
                    }
                    throw err;
                }
            },
            orderBy: (field: string, dir: string = 'desc') => {
                const query = realCollection.orderBy(field, dir as any);
                return {
                    limit: (n: number) => {
                        const limitedQuery = query.limit(n);
                        return {
                            get: async () => {
                                try {
                                    return await limitedQuery.get();
                                } catch (err: any) {
                                    if (err.message.includes('NOT_FOUND') || err.message.includes('SERVICE_DISABLED')) {
                                        useMemoryFallback = true;
                                        return new MockCollection(name).orderBy().get();
                                    }
                                    throw err;
                                }
                            }
                        };
                    },
                    get: async () => {
                        try {
                            return await query.get();
                        } catch (err: any) {
                            if (err.message.includes('NOT_FOUND') || err.message.includes('SERVICE_DISABLED')) {
                                useMemoryFallback = true;
                                return new MockCollection(name).orderBy().get();
                            }
                            throw err;
                        }
                    }
                };
            },
            doc: (id: string) => {
                const realDoc = realCollection.doc(id);
                return {
                    get: async () => {
                        try {
                            return await realDoc.get();
                        } catch (err: any) {
                            if (err.message.includes('NOT_FOUND') || err.message.includes('SERVICE_DISABLED')) {
                                useMemoryFallback = true;
                                return new MockDoc(`${name}/${id}`).get();
                            }
                            throw err;
                        }
                    },
                    set: async (data: any, options?: any) => {
                        try {
                            return await realDoc.set(data, options);
                        } catch (err: any) {
                            if (err.message.includes('NOT_FOUND') || err.message.includes('SERVICE_DISABLED')) {
                                useMemoryFallback = true;
                                return new MockDoc(`${name}/${id}`).set(data, options);
                            }
                            throw err;
                        }
                    }
                };
            }
        } as any;
    },
    doc: (path: string) => {
        const firestore = getDb();
        if (!firestore) return new MockDoc(path) as any;

        const realDoc = firestore.doc(path);
        return {
            get: async () => {
                try {
                    return await realDoc.get();
                } catch (err: any) {
                    if (err.message.includes('NOT_FOUND') || err.message.includes('SERVICE_DISABLED')) {
                        useMemoryFallback = true;
                        return new MockDoc(path).get();
                    }
                    throw err;
                }
            },
            set: async (data: any, options?: any) => {
                try {
                    return await realDoc.set(data, options);
                } catch (err: any) {
                    if (err.message.includes('NOT_FOUND') || err.message.includes('SERVICE_DISABLED')) {
                        useMemoryFallback = true;
                        return new MockDoc(path).set(data, options);
                    }
                    throw err;
                }
            }
        } as any;
    }
};

export function isFirebaseConnected(): boolean {
    return firebaseInitialized && !useMemoryFallback;
}


