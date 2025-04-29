import { ROWS_PER_PAGE } from "common/settings";

export interface DatatableQueries {
    [key: string]: any;
}

export const initialDataTableQueries: DatatableQueries = {
    first: 0,
    skip: 0,
    rows: ROWS_PER_PAGE[0],
    top: ROWS_PER_PAGE[0],
    page: 1,
    column: "",
    sortField: "",
    sortOrder: null,
};
