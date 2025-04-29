import { authorizedUserApiInstance } from "http/index";
import { QueryParams } from "common/models/query-params";
import { BaseResponse, BaseResponseError, Status } from "common/models/base-response";
import {
    Deal,
    DealFinance,
    DealPickupPayment,
    DealPrintFormResponse,
    HowToKnow,
    IndexedDealList,
} from "common/models/deals";
import { AxiosError, isAxiosError } from "axios";

export interface TotalDealsList extends BaseResponse {
    total: number;
}

export const getDealsList = async (uid: string, queryParams: QueryParams) => {
    try {
        const request = await authorizedUserApiInstance.get<Deal[] | TotalDealsList>(
            `deals/${uid}/list`,
            {
                params: queryParams,
            }
        );
        return request.data;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while getting deals list",
        };
    }
};

export const getDealInfo = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<Deal>(`deals/${uid}/info`);
        if (request.data.status === Status.OK) {
            return request.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting deal info",
            };
        }
    }
};

interface DealTypeResponse extends BaseResponse {
    deal_types: IndexedDealList[];
}
interface DealStatusList extends BaseResponse {
    deal_status: IndexedDealList[];
}
interface SaleTypeResponse extends BaseResponse {
    sale_types: IndexedDealList[];
}
interface InventoryStatusResponse extends BaseResponse {
    inventory_status: IndexedDealList[];
}

export const getDealTypes = async () => {
    try {
        const request =
            await authorizedUserApiInstance.get<DealTypeResponse>("deals/listdealtypes");
        return request.data.deal_types;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while get deal types",
        };
    }
};

export const getDealStatuses = async () => {
    try {
        const request =
            await authorizedUserApiInstance.get<DealStatusList>("deals/listdealstatuses");
        return request.data.deal_status;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while get deal statuses",
        };
    }
};

export const getSaleTypes = async () => {
    try {
        const request =
            await authorizedUserApiInstance.get<SaleTypeResponse>("deals/listsaletypes");
        return request.data.sale_types;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while get deal sale types",
        };
    }
};

export const getDealInventoryStatuses = async () => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryStatusResponse>(
            "deals/listinventorystatuses"
        );
        return request.data.inventory_status;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while get deal inventory statuses",
        };
    }
};

export const setDeal = async (
    dealuid: string,
    dealData: Partial<Deal>
): Promise<BaseResponseError | undefined> => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `deals/${dealuid || 0}/set`,
            dealData
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.info ||
                    error.response?.data.error ||
                    "Error while set deal",
            };
        }
    }
};

export const dealFinancesWashout = async (
    dealuid: string
): Promise<BaseResponseError | undefined> => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `deals/${dealuid || 0}/washout`
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while washout deal finance",
        };
    }
};

export const dealFinancesRecalculate = async (
    dealuid: string
): Promise<BaseResponseError | undefined> => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `deals/${dealuid || 0}/recalculate`
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while recalculate deal finance",
        };
    }
};

export const getDealFinance = async (dealuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<DealFinance | BaseResponseError>(
            `deals/${dealuid || 0}/finance`
        );
        return request.data;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while getting deal finance",
        };
    }
};

export const setDealFinance = async (
    dealuid: string,
    dealFinanceData: Partial<DealFinance>
): Promise<BaseResponseError | undefined> => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `deals/${dealuid || 0}/finance`,
            dealFinanceData
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while setting deal finance",
        };
    }
};

export const getDealPayments = async (dealuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<
            DealPickupPayment[] | BaseResponseError
        >(`deals/${dealuid || 0}/ppayments`);
        return request.data;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while getting user report collections",
        };
    }
};

export const setDealPayments = async (
    dealuid: string,
    dealPaymentData: Partial<DealPickupPayment>
) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponse>(
            `deals/${dealuid}/ppayment`,
            dealPaymentData
        );

        return request.data;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while setting deal payments",
        };
    }
};

export const getDealPaymentsTotal = async (dealuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<any>(
            `deals/${dealuid || 0}/ppaymenttotal`
        );
        return request.data;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while getting deal payments total",
        };
    }
};

export const getDealPrintForms = async (dealuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<DealPrintFormResponse>(
            `print/${dealuid}/deallistforms `
        );
        if (request.data.status === Status.OK) {
            const { status, ...dataWithoutStatus } = request.data;
            return dataWithoutStatus;
        }
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while getting deal print forms",
        };
    }
};

export const getDealPrintFormTemplate = async (
    dealuid: string,
    templateuid: string
): Promise<Blob | BaseResponseError> => {
    const printErrorMessage = "Error while getting deal print form template";
    try {
        const request = await authorizedUserApiInstance.get<Blob>(
            `print/${dealuid}/${templateuid}/dealform`,
            {
                responseType: "blob",
            }
        );

        const contentType = request.headers["content-type"];
        if (contentType.includes("application/json")) {
            const textResponse = await request.data.text();
            const errorResponse: BaseResponseError = JSON.parse(textResponse);
            return errorResponse;
        }

        return request.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            debugger;
            return {
                status: Status.ERROR,
                error: error.response.data?.message || printErrorMessage,
            };
        }

        return {
            status: Status.ERROR,
            error: printErrorMessage,
        };
    }
};

export const getHowToKnowList = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<HowToKnow[]>(
            `user/${useruid}/howtoknow`
        );
        if (request.status === 200) {
            return request.data;
        } else {
            throw new Error("Error while getting how to know list");
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting how to know list",
            };
        }
    }
};

export const setHowToKnow = async (
    useruid: string,
    howToKnowData: Partial<HowToKnow>
): Promise<BaseResponseError | undefined> => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `user/${useruid}/howtoknow`,
            howToKnowData
        );
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.info ||
                    error.response?.data.error ||
                    "Error while setting how to know item",
            };
        }
    }
};

export const deleteHowToKnow = async (itemuid: string): Promise<BaseResponseError | undefined> => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `user/${itemuid}/deletehowtoknow`
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.info ||
                    error.response?.data.error ||
                    "Error while deleting how to know item",
            };
        }
    }
};
