interface SortableItem {
  title?: string | null;
  author?: string | null;
  provider?: string | null;
}

export function sortItems(items: SortableItem[], sortBy: string): SortableItem[] {
  const sorted = [...items];
  const safeString = (value: string | null | undefined): string => {
    if (value === null || value === undefined) return '';
    if (typeof value !== 'string') return '';
    return value.trim();
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
      return sorted;
  }
}

export type { SortableItem };