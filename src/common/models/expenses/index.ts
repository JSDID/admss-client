import { BaseResponse } from "../base-response";

export interface Expenses {
    amount: number;
    amount_text: string;
    checknumber: string;
    comment: string;
    contactuid: string;
    created: string;
    description: string;
    id: number;
    itemuid: string;
    notbillable: 1 | 0;
    operationdate: string;
    ponumber: string;
    type: number;
    type_name: string;
    updated: string;
    useruid: string;
    vendor: string;
}

export interface ExpensesTotal {
    status: string;
    error?: string;
    info?: string;
    message?: string;
    total?: string;
    total_i?: number;
}

export interface ExpensesSetResponse extends BaseResponse {
    itemuid: string;
}
