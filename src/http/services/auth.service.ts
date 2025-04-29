import { LoginForm } from "sign/sign-in";
import { authorizedUserApiInstance, nonAuthorizedUserApiInstance } from "../index";
import { BaseResponse } from "common/models/base-response";
import { UserPermissionsResponse } from "common/models/user";
import { AxiosError } from "axios";

export interface AppError {
    status: "Error";
    error?: string;
    message?: string;
}

export interface AuthUser {
    companyname: string;
    firstname: string;
    isadmin: 0 | 1;
    islocaladmin: 0 | 1;
    ismanager: 0 | 1;
    issalesperson: 0 | 1;
    lastname: string;
    loginname: string;
    locationname: string;
    locationuid: string;
    modified: string;
    sessionuid: string;
    started: string;
    status: "OK";
    token: string;
    username: string;
    useruid: string;
    permissions: UserPermissionsResponse;
}

export const auth = async ({
    username,
    password,
    rememberme,
    application,
    version,
}: LoginForm): Promise<AuthUser | AppError> => {
    try {
        const response = await nonAuthorizedUserApiInstance.post<AuthUser | AppError>("user", {
            user: username,
            secret: password,
            rememberme,
            application,
            version,
        });

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<AppError>;

        if (axiosError.response) {
            return {
                status: "Error",
                error: axiosError.response.data.error || "Authentication failed",
                message: axiosError.response.data.message || axiosError.message,
            };
        } else if (axiosError.request) {
            return {
                status: "Error",
                error: "No response from server",
                message: axiosError.message,
            };
        } else {
            return {
                status: "Error",
                error: "Request setup error",
                message: axiosError.message,
            };
        }
    }
};

export const logout = async (uid: string): Promise<BaseResponse | AppError> => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponse>(`user/${uid}/logout`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<AppError>;

        if (axiosError.response) {
            return {
                status: "Error",
                error: axiosError.response.data.error || "Logout failed",
                message: axiosError.response.data.message || axiosError.message,
            };
        } else if (axiosError.request) {
            return {
                status: "Error",
                error: "No response from server during logout",
                message: axiosError.message,
            };
        } else {
            return {
                status: "Error",
                error: "Logout request setup error",
                message: axiosError.message,
            };
        }
    }
};
