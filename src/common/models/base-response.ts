export enum Status {
    OK = "OK",
    ERROR = "ERROR",
}

export interface BaseResponse {
    status: Status;
}

export interface BaseResponseError extends BaseResponse {
    error?: string;
    errorField?: string;
    message?: string;
}

export interface TotalListCount extends BaseResponseError {
    total: number;
}
