import { createContext, useContext, type ReactNode } from 'react';
import type { BackupRepository } from './BackupRepository';

const BackupRepositoryContext = createContext<BackupRepository | null>(null);

/** The implementation is chosen by the app's composition root, never by the UI. */
export function BackupRepositoryProvider(props: { value: BackupRepository; children: ReactNode }) {
  return <BackupRepositoryContext value={props.value}>{props.children}</BackupRepositoryContext>;
}

export function useBackupRepository(): BackupRepository {
  const repository = useContext(BackupRepositoryContext);
  if (!repository) throw new Error('BackupRepositoryProvider is missing');
  return repository;
}
