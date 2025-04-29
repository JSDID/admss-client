import { isAxiosError } from "axios";
import { BaseResponse, BaseResponseError, Status } from "common/models/base-response";
import { MediaType } from "common/models/enums";
import {
    InventoryMedia,
    CreateMediaItemRecordResponse,
    InventorySetResponse,
    InventoryMediaInfo,
    InventoryMediaPostData,
} from "common/models/inventory";
import { authorizedUserApiInstance } from "http/index";

export const getInventoryMediaItemList = async (
    inventoryID: string
): Promise<InventoryMedia[] | undefined> => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryMedia[]>(
            `inventory/${inventoryID}/media`
        );
        if (request) {
            return request.data;
        } else throw new Error();
    } catch (error) {
        // TODO: add error handler
    }
};

export const getInventoryMediaItem = async (mediaID: string): Promise<string | undefined> => {
    try {
        const response = await authorizedUserApiInstance.get(`media/${mediaID}/media`, {
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
        // TODO: add error handler
        return undefined;
    }
};

export const getInventoryMediaInfo = async (mediauid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<InventoryMediaInfo>(
            `inventory/${mediauid}/mediaitem`
        );
        if (request) {
            return request.data;
        } else throw new Error();
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting media info",
            };
        }
    }
};

export const createMediaItemRecord = async (mediaType?: MediaType) => {
    try {
        const response = await authorizedUserApiInstance.post<CreateMediaItemRecordResponse>(
            "media/0/meta",
            { mediaType }
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
                    "Error while creating media item record",
            };
        }
    }
};

export const uploadInventoryMedia = async (inventoryUid: string, inventoryData: FormData) => {
    try {
        const response = await authorizedUserApiInstance.post<InventorySetResponse>(
            `media/${inventoryUid || 0}/media`,
            inventoryData,
            { headers: { "Content-Type": "multipart/form-data" } }
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
                    "Error while uploading media",
            };
        }
    }
};

export const setMediaItemData = async (
    inventoryUid: string,
    {
        mediaitemuid,
        notes,
        itemuid,
        order,
        mediaurl,
        contenttype,
        useruid,
        type,
    }: Partial<InventoryMediaPostData>
) => {
    try {
        const id = inventoryUid ? inventoryUid : 0;
        const response = await authorizedUserApiInstance.post<BaseResponseError>(
            `inventory/${id}/media`,
            {
                mediaitemuid,
                mediaurl,
                useruid,
                itemuid,
                contenttype,
                notes,
                order,
                type,
            }
        );

        if (response.data.status === Status.OK) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.info ||
                    error.response?.data.error ||
                    "Error while setting media item data",
            };
        }
    }
};

export const setMediaItemMeta = async (
    mediaitemuid: string,
    { order }: Partial<InventoryMediaPostData>
) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `media/${mediaitemuid}/meta`,
            {
                order,
            }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        // TODO: add error handler
    }
};

export const deleteMediaImage = async (itemuid: string) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(
            `inventory/${itemuid}/deletemedia`
        );
        if (response.status === 200) {
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
