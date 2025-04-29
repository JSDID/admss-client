import { isAxiosError } from "axios";
import { BaseResponseError, Status } from "common/models/base-response";
import {
    GeneralInventoryOptions,
    GeneralSettings,
    WatermarkPostProcessing,
} from "common/models/general-settings";
import { authorizedUserApiInstance } from "http/index";

export const getUserGeneralSettings = async () => {
    try {
        const request = await authorizedUserApiInstance.get<GeneralSettings>(`user/settings`);
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting user general settings",
            };
        }
    }
};

export const updateUserGeneralSettings = async (body?: Partial<GeneralSettings>) => {
    try {
        const request = await authorizedUserApiInstance.post<any>(`user/settings`, body);
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while updating user general settings",
            };
        }
    }
};

export const getWatermark = async (
    mediauid: string
): Promise<string | BaseResponseError | undefined> => {
    try {
        const response = await authorizedUserApiInstance.get<any>(`media/${mediauid}/watermark`, {
            responseType: "blob",
        });

        const dataUrl = await new Promise<string>((resolve) => {
            const reader = new window.FileReader();
            reader.addEventListener("load", (event) => {
                resolve(event.target?.result as string);
            });
            reader.readAsDataURL(response.data);
        });

        return dataUrl;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.info ||
                    error.response?.data.error ||
                    "Error while getting watermark",
            };
        }
    }
};

export const updateWatermark = async (mediauid: string, body?: any) => {
    try {
        const request = await authorizedUserApiInstance.post<any>(
            `media/${mediauid}/watermark`,
            body
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while updating watermark",
            };
        }
    }
};

export const getPostProcessing = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<WatermarkPostProcessing>(
            `user/${useruid}/postprocessing`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting postprocessing",
            };
        }
    }
};

export const updatePostProcessing = async (
    useruid: string,
    body?: Partial<WatermarkPostProcessing>[]
) => {
    try {
        const request = await authorizedUserApiInstance.post<any>(
            `user/${useruid}/postprocessing`,
            body
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while updating postprocessing",
            };
        }
    }
};

export const setInventoryGroupOption = async (
    groupuid: string,
    option: Partial<GeneralInventoryOptions>
) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError>(
            `inventory/${groupuid}/groupoption`,
            option
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while updating inventory group option",
            };
        }
    }
};

export const deleteInventoryGroupOption = async (groupoptionuid: string) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError>(
            `inventory/${groupoptionuid}/deletegroupoption`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.message ||
                    error.response?.data.error ||
                    "Error while deleting inventory group option",
            };
        }
    }
};

export const restoreInventoryGroupDefaults = async (groupuid: string) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError>(
            `inventory/${groupuid}/grouprestoredefaults`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.error || "Error while restoring inventory group defaults",
            };
        }
    }
};
