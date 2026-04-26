const UPLOAD_URL = '/assets/uploads';
const PLACEHOLDER = '/assets/images/placeholder.jpg';

export function getImageUrl(filename: string | null | undefined, folder: string): string {
  if (!filename) return PLACEHOLDER;
  if (filename.startsWith('http')) return filename;
  return `${UPLOAD_URL}/${folder}/${filename}`;
}
