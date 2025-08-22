// src/stores/dca.db.ts
import { openDB, type IDBPDatabase, type DBSchema } from 'idb'
import type { DcaPlan } from '../types/dca'

export const DB_NAME = 'dca-coach'
export const DB_VERSION = 1
export const STORE = 'plans'

interface CoachDB extends DBSchema {
  'plans': {
    key: string
    value: DcaPlan
    indexes: {
      'by-active': 0 | 1
      'by-createdAt': number
    }
  }
}

let _db: Promise<IDBPDatabase<CoachDB>> | null = null

export function getDB(): Promise<IDBPDatabase<CoachDB>> {
  if (!_db) {
    _db = openDB<CoachDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const s = db.createObjectStore(STORE, { keyPath: 'id' })
          s.createIndex('by-active', 'active')
          s.createIndex('by-createdAt', 'createdAt')
        }
      }
    })
  }
  return _db
}

export async function clearDB(): Promise<void> {
  const d = await getDB()
  const tx = d.transaction(STORE, 'readwrite')
  await tx.store.clear()
  await tx.done
}

export function __resetDBForTests__(): void {
  _db = null
}
