interface SortableItem {
  title?: string | null;
  author?: string | null;
  provider?: string | null;
}

/**
 * Safely sorts an array of items based on the specified sort option
 * Handles null, undefined, and non-string values gracefully
 */
export function sortItems(items: SortableItem[], sortBy: string): SortableItem[] {
  // Create a copy to avoid mutating the original array
  const sorted = [...items];
  
  // Helper function to safely convert values to strings for comparison
  const safeString = (value: string | null | undefined): string => {
    if (value === null || value === undefined) return '';
    if (typeof value !== 'string') return '';
    return value.trim(); // Also trim whitespace for better sorting
  };
 
  switch (sortBy) {
    case 'title-asc':
      return sorted.sort((a, b) => {
        const aVal = safeString(a.title);
        const bVal = safeString(b.title);
        return aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      });
    case 'title-desc':
      return sorted.sort((a, b) => {
        const aVal = safeString(a.title);
        const bVal = safeString(b.title);
        return bVal.localeCompare(aVal, undefined, { numeric: true, sensitivity: 'base' });
      });
    case 'author-asc':
      return sorted.sort((a, b) => {
        const aVal = safeString(a.author);
        const bVal = safeString(b.author);
        return aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      });
    case 'author-desc':
      return sorted.sort((a, b) => {
        const aVal = safeString(a.author);
        const bVal = safeString(b.author);
        return bVal.localeCompare(aVal, undefined, { numeric: true, sensitivity: 'base' });
      });
    case 'provider-asc':
      return sorted.sort((a, b) => {
        const aVal = safeString(a.provider);
        const bVal = safeString(b.provider);
        return aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      });
    case 'provider-desc':
      return sorted.sort((a, b) => {
        const aVal = safeString(a.provider);
        const bVal = safeString(b.provider);
        return bVal.localeCompare(aVal, undefined, { numeric: true, sensitivity: 'base' });
      });
    default:
      return sorted; // Return original order if sort option is not recognized
  }
}

// Export the interface so other files can use it
export type { SortableItem };