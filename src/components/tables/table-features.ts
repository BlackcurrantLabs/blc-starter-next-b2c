import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";
import type { TableState } from "@tanstack/react-table";

/**
 * TanStack Table v9 is opt-in: a table only gets the state, options and APIs
 * of the features it registers. Every data table in the app shares this set so
 * the shared toolbar / pagination / column-header components can be typed once.
 *
 * Add a feature here (and a row-model slot on the table, if it should run
 * client-side) when a table needs something new, e.g. row selection.
 */
export const appTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  rowPaginationFeature,
});

export type AppTableFeatures = typeof appTableFeatures;

export type AppTableState = TableState<AppTableFeatures>;

/** Replaces v8's `InitialTableState`. */
export type AppInitialTableState = Partial<AppTableState>;

/**
 * The slices of table state a server action needs to run a search.
 * Import it with `import type` from server code so nothing is bundled.
 */
export type TableQuery = Pick<
  AppTableState,
  "globalFilter" | "columnFilters" | "sorting" | "pagination"
>;
