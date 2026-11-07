import type { Where } from "payload";

export type PhotoSortOrder = "asc" | "desc";

/**
 * Normalizes a `sort` search param into a sort direction. Anything other
 * than `desc` falls back to ascending so the UI always has a valid value.
 */
export function normalizePhotoSortOrder(
  value?: string | string[] | null
): PhotoSortOrder {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "desc" ? "desc" : "asc";
}

/** Normalizes a photo search param (title/name or ID) to a trimmed string. */
export function normalizePhotoSearch(
  value?: string | string[] | null
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

type PhotoSearchField = "title" | "name" | "studentName";

/**
 * Builds a Payload `where` clause that matches a photo by its title/name (and
 * any extra text fields) or by its numeric ID. Returns `undefined` when there
 * is no search term.
 */
export function buildPhotoSearchWhere(
  search: string,
  field: PhotoSearchField = "title",
  extraFields: PhotoSearchField[] = []
): Where | undefined {
  const term = search.trim();
  if (!term) return undefined;

  const conditions: Where[] = [field, ...extraFields].map((searchField) => ({
    [searchField]: { contains: term },
  }));

  // Allow IDs to be pasted with the "#" prefix shown in the UI (e.g. "#123").
  const numericId = Number(term.replace(/^#/, ""));
  if (Number.isInteger(numericId)) {
    conditions.push({ id: { equals: numericId } });
  }

  return { or: conditions };
}

/** Returns the Payload sort value for a photo collection using `field`. */
export function getPhotoSortValue(
  sortOrder: PhotoSortOrder,
  field: "title" | "name"
) {
  return sortOrder === "desc" ? `-${field}` : field;
}
