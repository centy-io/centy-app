/**
 * Allowed MIME types for asset uploads
 */
export const ALLOWED_TYPES: Record<string, 'image' | 'video' | 'pdf'> = {
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'video/mp4': 'video',
  'video/webm': 'video',
  'application/pdf': 'pdf',
}
