export type DeliveryResult = 'shared' | 'downloaded' | 'cancelled';

function download(file: File): void {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  // Revoking immediately can abort the download on Safari.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * iOS share sheet when available ("Enregistrer dans Fichiers", AirDrop, iCloud…),
 * plain download otherwise.
 */
export async function deliverFile(name: string, text: string): Promise<DeliveryResult> {
  const file = new File([text], name, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    }
  }
  download(file);
  return 'downloaded';
}
