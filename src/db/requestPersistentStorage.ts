/**
 * Asks the browser not to evict IndexedDB under storage pressure.
 * Safari may still ignore it; JSON backups remain the real safety net.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}
