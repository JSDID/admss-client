/* eslint-disable @typescript-eslint/no-unused-vars */

import { AxiosResponse, isAxiosError } from "axios";
import { ListData } from "common/models";
import { BaseResponse, BaseResponseError, Status } from "common/models/base-response";
import {
    Inventory,
    TotalInventoryList,
    EndpointType,
    InventorySetResponse,
    InventoryWebInfo,
    InventoryExportWebHistory,
    InventoryPrintForm,
    InventoryStockNumber,
    InventoryWebCheck,
    InventoryCheckVIN,
    InventoryPaymentBack,
    InventoryOptions,
    LocationsListData,
    MakesListData,
    OptionsListData,
} from "common/models/inventory";
import { QueryParams } from "common/models/query-params";
import { authorizedUserApiInstance } from "http/index";

export const getInventoryList = async (uid: string, queryParams: QueryParams) => {
    try {
        const request = await authorizedUserApiInstance.get<Inventory[] | TotalInventoryList>(
            `inventory/${uid}/list`,
            {
                params: queryParams,
            }
        );
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getInventoryInfo = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<Inventory>(`inventory/${uid}/info`);
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting inventory info",
            };
        }
    }
};

export const fetchInventoryList = async <T>(
    endpoint: EndpointType | string
): Promise<T | undefined> => {
    try {
        const response: AxiosResponse<T> = await authorizedUserApiInstance.get(
            `inventory/list/constants/${endpoint}`
        );
        return response.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getInventoryOptionsList = async (): Promise<OptionsListData[] | undefined> =>
    await fetchInventoryList<OptionsListData[]>("options");
export const getInventoryBodyTypesList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("bodytypes");
export const getInventoryExteriorColorsList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("exteriorcolors");
export const getInventoryInteriorColorsList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("interiorcolors");
export const getInventoryCylindersList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("cylinders");
export const getInventoryDrivelineList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("driveline");
export const getInventoryEngineList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("engine");
export const getInventoryExpenseTypesList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("expensetypes");
export const getInventoryFuelTypesList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("fueltypes");
export const getInventoryTransmissionTypesList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("transmissiontypes");
export const getInventoryAutomakesList = async (): Promise<MakesListData[] | undefined> =>
    await fetchInventoryList<MakesListData[]>("automakes");
export const getInventoryCategoryList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("category");
export const getInventoryStatusList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("status");
export const getInventoryGroupList = async (): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>("group");
export const getAutoMakeModelList = async (make: string): Promise<ListData[] | undefined> =>
    await fetchInventoryList<ListData[]>(make);

export const getInventoryDeleteReasonsList = async (
    useruid: string
): Promise<string[] | unknown> => {
    try {
        const request = await authorizedUserApiInstance.get<ListData[]>(
            `inventory/${useruid}/listdeletionreasons`
        );
        if (request.status === 200) {
            return request.data;
        } else throw new Error();
    } catch (error) {
        return error;
    }
};

export const getInventoryWebCheck = async (inventoryuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryWebCheck>(
            `inventory/${inventoryuid}/webcheck`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting inventory web check",
            };
        }
    }
};

export const getInventoryOptions = async (inventoryuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryOptions>(
            `inventory/${inventoryuid}/options`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting inventory options",
            };
        }
    }
};

export const getInventoryGroupOptions = async (groupuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<OptionsListData & BaseResponseError>(
            `inventory/${groupuid}/groupoptions`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting inventory group options",
            };
        }
    }
};

export const getInventoryPaymentBack = async (inventoryuid: string) => {
    try {
        const response = await authorizedUserApiInstance.get<InventoryPaymentBack>(
            `inventory/${inventoryuid}/paymentpack`
        );
        if (response.data.status === Status.OK) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error on get inventory expense",
            };
        }
    }
};

export const getVINCheck = async (VIN: string) => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryCheckVIN>(
            `inventory/${VIN}/checkvin`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while VIN check",
            };
        }
    }
};

export const setInventory = async (
    inventoryUid: string,
    inventoryData: Partial<Inventory>
): Promise<InventorySetResponse | undefined> => {
    try {
        const response = await authorizedUserApiInstance.post<InventorySetResponse>(
            `inventory/${inventoryUid || 0}/set`,
            inventoryData
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const deleteInventory = async (inventoryuid: string, data: Record<string, string>) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `inventory/${inventoryuid}/delete`,
            data
        );
        if (response.data.status === Status.OK) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error,
            };
        }
    }
};

export const getInventoryWebInfo = async (inventoryuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryWebInfo>(
            `inventory/${inventoryuid}/webinfo`
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getInventoryWebInfoHistory = async (inventoryuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryExportWebHistory[]>(
            `external/${inventoryuid}/history`
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const setInventoryExportWeb = async (
    inventoryUid: string,
    inventoryData: Partial<InventoryWebInfo>
): Promise<InventorySetResponse | undefined> => {
    try {
        const response = await authorizedUserApiInstance.post<InventorySetResponse>(
            `inventory/${inventoryUid || 0}/webadd`,
            inventoryData
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getInventoryPrintForms = async (inventoryuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryPrintForm[]>(
            `print/${inventoryuid}/listforms`
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getInventoryPrintFormTemplate = async (inventoryuid: string, templateuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<any>(
            `print/${inventoryuid}/${templateuid}/form`,
            {
                responseType: "blob",
            }
        );
        if (request.status === 200) {
            return request.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const getInventoryLocations = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<LocationsListData>(
            `user/${useruid}/locations`
        );
        if (request.status === 200 && request.data.status === Status.OK) {
            return request.data.locations;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const checkStockNoAvailability = async (stockno: string) => {
    try {
        const request = await authorizedUserApiInstance.post<InventoryStockNumber>(
            `inventory/stocknumber`,
            {
                stockno,
            }
        );
        if (request.data.status === Status.OK) {
            return request.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error on check stock no availability",
            };
        }
    }
};

export const setInventoryWebCheck = async (
    inventoryuid: string,
    { enabled }: Pick<InventoryWebCheck, "enabled">
) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `inventory/${inventoryuid}/webcheck`,
            { enabled }
        );
        if (response.data.status === Status.OK) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error,
            };
        }
    }
};

export const setInventoryPaymentBack = async (
    inventoryuid: string,
    inventoryPayment: Partial<InventoryPaymentBack>
) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `inventory/${inventoryuid}/paymentpack`,
            inventoryPayment
        );
        if (response.data.status === Status.OK) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error on set inventory expense",
            };
        }
    }
};
