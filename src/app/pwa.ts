// src/app/pwa.ts
import { registerSW } from 'virtual:pwa-register'

let updateSW: (() => Promise<void>) | undefined

function logUnknownError(ctx: string, err: unknown): void {
  if (err instanceof Error) {
    console.error(`[PWA] ${ctx}:`, err.message, err.stack)
  } else if (typeof err === 'object' && err !== null) {
    try {
      console.error(`[PWA] ${ctx}:`, JSON.stringify(err))
    } catch {
      console.error(`[PWA] ${ctx}:`, err)
    }
  } else {
    console.error(`[PWA] ${ctx}:`, String(err))
  }
}

export function setupPWA(): void {
  try {
    updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        // TODO: показати діалог і викликати triggerSWUpdate()
      },
      onOfflineReady() {
        // TODO: нотифікація "Доступно офлайн"
      },
      onRegistered() {
        // optional: console.info('[PWA] service worker registered')
      },
      onRegisterError(error: unknown) {
        logUnknownError('registration error', error)
      },
    })
  } catch (err: unknown) {
    logUnknownError('init error', err)
  }
}

export async function triggerSWUpdate(): Promise<void> {
  try {
    if (updateSW) await updateSW()
  } catch (err: unknown) {
    logUnknownError('update error', err)
  }
}
