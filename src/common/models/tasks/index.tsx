import { BaseResponseError } from "common/models/base-response";

export enum TaskStatus {
    DEFAULT = "Default",
    STARTED = "Started",
    IN_PROGRESS = "In Progress",
    CANCELLED = "Cancelled",
    POSTPONED = "Postponed",
    PAUSED = "Paused",
    COMPLETED = "Completed",
    OUTDATED = "Outdated",
    DELETED = "Deleted",
}

export interface Task {
    accountname: string;
    accountnumber: string;
    accountuid: string;
    assignedto: string;
    contactname: string;
    contactuid: string;
    created: string;
    deadline: string;
    dealname: string;
    dealuid: string;
    description: string;
    index: number;
    itemuid: string;
    parentuid: string;
    phone: string;
    startdate: string;
    task_status: TaskStatus;
    taskname: string;
    statuscode: number;
    updated: string;
    username: string;
    useruid: string;
}

export interface TaskUser {
    created: string;
    createdbyuid: string;
    updated: string;
    username: string;
    useruid: string;
}

export interface PostDataTask extends BaseResponseError {
    index: number;
    created: string;
    updated: string;
    startdate: string;
    deadline: string;
    statuscode: number;
    task_status: TaskStatus;
    itemuid: string;
    parentuid: string;
    useruid: string;
    dealuid: string;
    dealname: string;
    accountuid: string;
    accountname: string;
    contactuid: string;
    contactname: string;
    phone: string;
    description: string;
}

export enum SEARCH_FORM_FIELDS {
    CREATION_DATE = "Creation Date",
    DESCRIPTION = "Description (keywords)",
}

export enum SEARCH_FORM_QUERY {
    CREATION_DATE = "date",
    DESCRIPTION = "description",
}

export interface AdvancedSearch {
    [key: string]: string | number;
    info: string;
    date: string;
}
