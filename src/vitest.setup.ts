// src/vitest.setup.ts
import 'fake-indexeddb/auto'
import { randomUUID } from 'node:crypto'

type CryptoWithUUID = Crypto & { randomUUID?: () => string }

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: { randomUUID },
    configurable: true,
  })
} else if (!('randomUUID' in (globalThis.crypto as CryptoWithUUID))) {
  Object.defineProperty(globalThis.crypto, 'randomUUID', {
    value: randomUUID,
    configurable: true,
  })
}
