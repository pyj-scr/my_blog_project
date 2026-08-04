import { AppItem } from '@/types/app';

/**
 * Sorts apps by updatedAt date in descending order (newest date first).
 * If dates are equal or missing, sorts by numeric ID descending.
 */
export function sortAppsByNewest(apps: AppItem[]): AppItem[] {
  return [...apps].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

    const validA = isNaN(dateA) ? 0 : dateA;
    const validB = isNaN(dateB) ? 0 : dateB;

    if (validB !== validA) {
      return validB - validA; // Descending: Newest date first
    }

    const numA = parseInt(a.id.replace(/\D/g, '') || '0', 10);
    const numB = parseInt(b.id.replace(/\D/g, '') || '0', 10);
    return numB - numA;
  });
}
