import { isAxiosError } from "axios";
import { BaseResponseError, Status } from "common/models/base-response";
import { QueryParams } from "common/models/query-params";
import {
    ReportACL,
    ReportCollection,
    ReportCollectionUpdate,
    ReportCreate,
    ReportInfo,
    ReportServiceColumns,
    ReportServices,
    ReportSetParams,
    ReportsPostData,
} from "common/models/reports";
import { authorizedUserApiInstance } from "http/index";

export const Document = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<any>(`reports/${uid}/get`);
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting report template",
            };
        }
    }
};

export const getReportInfo = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<ReportInfo>(
            `reports/${uid}/reportinfo`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting report info",
            };
        }
    }
};

export const getReportTaskResult = async (taskuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<any>(`reports/${taskuid}/report`, {
            headers: {
                Accept: "application/pdf",
            },
            responseType: "blob",
        });
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting report task result",
            };
        }
    }
};

export const makeShortReports = async (uid: string | undefined, body?: ReportsPostData) => {
    try {
        const request = await authorizedUserApiInstance.post<any>(
            `reports/${uid}/shortreport`,
            body,
            {
                headers: {
                    Accept: "application/pdf",
                },
                responseType: "blob",
            }
        );
        return request.data;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while making short report",
        };
    }
};

export const createReportCollection = async (
    useruid: string,
    { name, documents, itemuid }: Partial<ReportCollectionUpdate>
) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError>(
            `reports/${useruid}/collection`,
            { name, documents, itemuid }
        );
        return request.data;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while creating report collection",
        };
    }
};

export const getUserReportCollectionsContent = async (uid: string, params?: { qry?: string }) => {
    try {
        const request = await authorizedUserApiInstance.get<ReportCollection>(
            `reports/${uid}/collectionscontent`,
            {
                params,
            }
        );
        return request.data;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while getting user report collections content",
        };
    }
};

export const getUserFavoriteReportList = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<BaseResponseError | ReportCollection>(
            `reports/${uid}/favorites`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.error || "Error while getting user favorite report list",
            };
        }
    }
};

export const getReportAccessList = async (reportuid: string, params?: QueryParams) => {
    try {
        const request = await authorizedUserApiInstance.get<BaseResponseError | ReportACL>(
            `user/${reportuid}/reportacl`,
            { params }
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting user report access list",
            };
        }
    }
};

export const getReportDocumentTemplate = async (documentuid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<BaseResponseError | any>(
            `reports/${documentuid}/template`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.error ||
                    "Error while getting user report document template",
            };
        }
    }
};

export const getReportDatasets = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<BaseResponseError | any>(
            `reports/${useruid}/datasets`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting report datasets",
            };
        }
    }
};

export const getReportColumns = async ({
    service,
    useruid,
}: {
    service: ReportServices;
    useruid: string;
}) => {
    try {
        const request = await authorizedUserApiInstance.get<BaseResponseError | any>(
            `${service}/${useruid}/reportcolumns`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting report columns",
            };
        }
    }
};

export const createCustomReport = async (
    body: Partial<ReportCreate> & { columns: ReportServiceColumns[] }
) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError>(
            `reports/0/set`,
            body
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while creating custom report",
            };
        }
    }
};

export const updateReportInfo = async (uid: string, body: Partial<ReportSetParams>) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError>(
            `reports/${uid}/reportinfo`,
            body
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while updating report info",
            };
        }
    }
};

export const printReportInfo = async (
    useruid: string,
    {
        itemUID,
        columns,
    }: { itemUID: string; columns: { name: string; data: string; with: number }[] }
) => {
    try {
        const request = await authorizedUserApiInstance.post<
            BaseResponseError & { taskuid: string }
        >(`reports/${useruid}/report`, { itemUID, columns });
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while updating report info",
            };
        }
    }
};

export const setReportDocumentTemplate = async (
    documentuid: string,
    templateParams: ReportSetParams
) => {
    try {
        const request = await authorizedUserApiInstance.post<any>(
            `reports/${documentuid}/template`,
            templateParams,
            {
                headers: {
                    Accept: "application/pdf",
                },
                responseType: "blob",
            }
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while setting report document template",
            };
        }
    }
};

export const copyReportDocument = async (documentuid: string) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError>(
            `reports/${documentuid}/copy`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while copying report document",
            };
        }
    }
};

export const deleteReportDocument = async (documentuid: string) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError>(
            `reports/${documentuid}/delete`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while deleting report document",
            };
        }
    }
};

export const setReportAccessList = async (reportuid: string, reportACL: Partial<ReportACL>) => {
    try {
        const request = await authorizedUserApiInstance.post<any>(`user/${reportuid}/reportacl`, {
            ...reportACL,
        });
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while setting report access list",
            };
        }
    }
};

export const deleteReportCollection = async (collectionuid: string, reportuid?: string) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError | undefined>(
            `reports/${collectionuid}/${reportuid || 0}/delete`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while deleting report collection",
            };
        }
    }
};

export const moveReportToCollection = async (
    collectionuid: string,
    reportuid: string,
    newCollectionuid: string
) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError | undefined>(
            `reports/${collectionuid}/${reportuid}/move`,
            { collectionuid: newCollectionuid }
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while moving report to collection",
            };
        }
    }
};

export const addReportToCollection = async (collectionuid: string, reportuid: string) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError | undefined>(
            `reports/${collectionuid}/${reportuid}/add`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while adding report to collection",
            };
        }
    }
};

export const setReportOrder = async (collectionuid: string, reportuid: string, order: number) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError | undefined>(
            `reports/${collectionuid}/${reportuid}/order`,
            { order }
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while changing report order",
            };
        }
    }
};

export const setCollectionOrder = async (collectionuid: string, order: number) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError | undefined>(
            `reports/${collectionuid}/order`,
            { order }
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while changing collection order",
            };
        }
    }
};
