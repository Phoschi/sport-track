import { useEffect, useRef, type ReactNode } from 'react';
import styles from './BottomSheet.module.css';

type BottomSheetProps = { title: string; onClose: () => void; children: ReactNode };

/** Modal anchored to the bottom of the screen, within thumb reach. Mount it to open it. */
export function BottomSheet({ title, onClose, children }: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.sheet}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <h2>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
