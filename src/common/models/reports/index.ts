import { BaseResponseError } from "../base-response";

export interface ReportsColumn {
    name: string;
    data: string;
}

export interface ReportCollections {
    collectionuid: string;
    itemuid?: string;
}

export interface ReportsPostData {
    itemUID?: string;
    data?: Record<string, string>[];
    format?: string;
    columns?: ReportsColumn[];
}

export interface ReportDocument {
    accessed: string;
    count: number;
    created: string;
    collections?: ReportCollections[];
    documentUID: string;
    index: number;
    isNew: 0 | 1;
    isfavorite: 0 | 1;
    isdefault: 0 | 1;
    itemUID: string;
    order: number;
    name: string;
    updated: string;
    virtualUID: string;
}

export interface ReportCollection extends BaseResponseError {
    accessed: string;
    created: string;
    description: string;
    collections?: ReportCollection[];
    documents: ReportDocument[];
    index: number;
    isdefault: 0 | 1;
    isfavorite: 0 | 1;
    itemUID: string;
    order: number;
    name: string;
    updated: string;
    userUID: string;
}

export interface ReportCollectionUpdate {
    index: number;
    created: string;
    updated: string;
    itemuid: string;
    name: string;
    description: string;
    documents: ReportDocument[];
}

export interface ReportAccess {
    created: string;
    enabled: 0 | 1;
    index: number;
    itemuid: string;
    updated: string;
    username: string;
    userrole: string;
    useruid: string;
}

export interface ReportACL {
    status: string;
    error: string;
    info: string;
    message: string;
    useruid: string;
    username: string;
    reportuid: string;
    acl: ReportAccess[];
}

export interface ReportInfo extends BaseResponseError {
    message: string;
    created: string;
    updated: string;
    itemuid: string;
    useruid: string;
    name: string;
    isNew: 0 | 1;
    isdefault: 0 | 1;
    isfavorite: 0 | 1;
    ShowTotals: 0 | 1;
    ShowAverages: 0 | 1;
    ShowLineCount: 0 | 1;
    AskForStartAndEndDates: 0 | 1;
    order: number;
    listid: 0 | 1;
    columns: ReportServiceColumns[];
    collections?: ReportCollections[];
}

export interface ReportCreate extends BaseResponseError {
    info: string;
    name: string;
    version: string;
    description: string;
}

export interface ReportServiceColumns {
    data: string;
    dataset: string;
    datatype: string;
    index: number;
    name: string;
    width: number;
    originalDataSet?: ReportServices;
}

export interface ReportSetParams extends Omit<Partial<ReportInfo>, "columns"> {
    itemUID: string;
    timestamp?: number;
    timestamp_s?: string;
    from_date?: string;
    to_date?: string;
    type?: number;
    data?: Record<string, unknown>[];
    format?: Record<string, unknown>;
    columns?: ReportsColumn[];
}

export enum ReportServices {
    INVENTORY = "inventory",
    CONTACTS = "contacts",
    DEALS = "deals",
    ACCOUNTS = "accounts",
}

export enum TOAST_MESSAGES {
    SUCCESS = "Success",
    ERROR = "Error",
    MOVE_INTO_DEFAULT_ERROR = "This document cannot be moved into a default collection.",
    CANNOT_MOVE_INTO_DEFAULT_COLLECTION = "You cannot move anything into this default collection.",
    REPORT_MOVED_SUCCESS = "Report moved successfully!",
    COLLECTION_REORDERED_SUCCESS = "Collection re-ordered successfully!",
    ERROR_CANNOT_MOVE_FROM_DEFAULT_COLLECTION = "Report cannot be moved from a default collection.",
}

export enum REPORT_TYPES {
    FAVORITES = "Favorites",
    CUSTOM = "Custom reports",
}

export enum NODE_TYPES {
    DOCUMENT = "document",
    COLLECTION = "collection",
}

export interface Dataset {
    id: number;
    key: string;
    match: { id: number; name: string }[];
    name: ReportServices;
}
