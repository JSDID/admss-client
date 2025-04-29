import { Expenses, ExpensesSetResponse, ExpensesTotal } from "common/models/expenses";
import { authorizedUserApiInstance } from "http/index";
import { BaseResponse, Status } from "common/models/base-response";
import { Contact } from "common/models/contact";
import { ListData } from "common/models";

interface ExpensesListTypes extends BaseResponse {
    contact_types: ListData[];
}

interface ExpensesData {
    expenseuid?: string | null;
    expenseData: Partial<Expenses>;
}

export const getExpensesList = async (inventoryuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<Expenses[]>(
            `inventory/${inventoryuid}/expenses`
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getExpensesTotal = async (inventoryuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<ExpensesTotal>(
            `inventory/${inventoryuid}/expensestotal`
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getExpensesListTypes = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<ExpensesListTypes>(
            `contacts/${useruid}/listtypes`
        );
        if (request.status === 200 && request.data.status === Status.OK) {
            return request.data.contact_types;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getExpensesListVendors = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<Contact[]>(`contacts/${useruid}/list`);
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const setExpensesItem = async ({ expenseuid, expenseData }: ExpensesData) => {
    try {
        const body = expenseData;
        if (expenseuid && expenseuid !== "0") {
            body.itemuid = expenseuid;
        }
        const request = await authorizedUserApiInstance.post<ExpensesSetResponse>(
            `inventory/${expenseuid || 0}/expense`,
            body
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const deleteExpensesItem = async (expenseuid: string) => {
    try {
        const request = await authorizedUserApiInstance.post<ExpensesSetResponse>(
            `inventory/${expenseuid}/deleteexpense`
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};
