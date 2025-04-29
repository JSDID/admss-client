import { BaseResponse, Status } from "common/models/base-response";
import { authorizedUserApiInstance } from "../index";
import { ServerUserSettings, UserGroup, UserPermissionsResponse } from "common/models/user";
import { InventoryLocations } from "common/models/inventory";
import { isAxiosError } from "axios";

export interface ExtendedUserData extends BaseResponse {
    locations: InventoryLocations[];
    dealerName: string;
}

export interface UserSettings extends BaseResponse {
    created: string;
    profile: string;
    updated: string;
}

export const getExtendedData = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<ExtendedUserData>(`user/${uid}/info`);
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getUserSettings = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<UserSettings>(`user/${uid}/profile`);
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const setUserSettings = async (uid: string, settings: Partial<ServerUserSettings>) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponse>(`user/${uid}/profile`, {
            profile: JSON.stringify(settings),
        });
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getUserGroupList = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<UserGroup[]>(`user/${uid}/grouplist`);
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};
export const getUserGroupActiveList = async (uid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<UserGroup[]>(
            `user/${uid}/grouplistactive`
        );
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const addUserGroupList = async (
    uid: string,
    { description, enabled, itemuid, order, isdefault }: Partial<UserGroup>
) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponse>(
            `user/${uid}/grouplist`,
            {
                description,
                enabled,
                itemuid,
                order,
                isdefault,
            }
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while creating user inventory group",
            };
        }
    }
};

export const deleteUserGroupList = async (itemuid: string) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponse>(
            `user/${itemuid}/deletegroup`
        );
        return request.data;
    } catch (error) {
        // TODO: add error handler
    }
};

export const getUserPermissions = async (
    uid: string
): Promise<Partial<UserPermissionsResponse>> => {
    try {
        const request = await authorizedUserApiInstance.get<UserPermissionsResponse>(
            `user/${uid}/permissions`
        );
        return request.data;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while getting user permissions",
        };
    }
};
