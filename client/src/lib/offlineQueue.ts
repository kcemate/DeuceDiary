// IndexedDB wrapper for storing pending deuce logs when offline

const DB_NAME = 'DeuceDiaryOffline';
const DB_VERSION = 1;
const STORE_NAME = 'pendingDeuces';

export const MAX_SYNC_RETRIES = 5;

export interface PendingDeuce {
  id: string;           // local UUID (client-generated)
  location: string;
  thoughts: string;
  groupIds: string[];
  loggedAt: string;     // ISO timestamp
  createdAt: number;    // epoch ms for ordering
  status: 'pending' | 'syncing' | 'failed';
  error?: string;
  /** Number of sync attempts; items exceeding MAX_SYNC_RETRIES are marked failed. */
  retryCount?: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addToQueue(
  deuce: Omit<PendingDeuce, 'createdAt' | 'status'>
): Promise<void> {
  let db: IDBDatabase;
  try {
    db = await openDB();
  } catch (err) {
    console.error("[offlineQueue] addToQueue openDB failed", err);
    throw err;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item: PendingDeuce = { ...deuce, createdAt: Date.now(), status: 'pending' };
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getPendingQueue(): Promise<PendingDeuce[]> {
  let db: IDBDatabase;
  try {
    db = await openDB();
  } catch (err) {
    console.error("[offlineQueue] getPendingQueue openDB failed", err);
    throw err;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.index('createdAt').getAll();
    req.onsuccess = () => resolve(req.result as PendingDeuce[]);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

export async function removeFromQueue(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

export async function updateQueueItem(
  id: string,
  updates: Partial<PendingDeuce>
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      if (!getReq.result) { resolve(); return; }
      const putReq = store.put({ ...getReq.result, ...updates });
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getPendingCount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.index('status').count(IDBKeyRange.only('pending'));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}
