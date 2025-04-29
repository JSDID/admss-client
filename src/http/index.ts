import axios, { AxiosInstance } from "axios";
import { getKeyValue } from "services/local-storage.service";
import { AuthUser } from "./services/auth.service";
import { LS_APP_USER } from "common/constants/localStorage";

export const APP_TYPE: string = process.env.REACT_APP_TYPE || "client";
export const APP_VERSION: string = process.env.REACT_APP_VERSION || "0.1";
export const APP_MAGIC: string = process.env.REACT_APP_MAGIC || "avansoft";
export const APP_API_URL: string = process.env.REACT_APP_API_URL || "https://app.admss.com/api/v1/";

export let authorizedUserApiInstance: AxiosInstance;

function getToken() {
    const authUser: AuthUser = getKeyValue(LS_APP_USER);
    if (authUser) {
        return authUser.token;
    }
    return null;
}

export const nonAuthorizedUserApiInstance = axios.create({
    baseURL: APP_API_URL,
});

const handleErrorResponse = (error: any, navigate: any) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem("useruid");
        navigate("/");
        return Promise.reject(error.response);
    } else {
        return Promise.reject(error);
    }
};

export function createApiDashboardInstance(navigate: any) {
    authorizedUserApiInstance = axios.create({
        baseURL: APP_API_URL,
        headers: {
            common: { Authorization: `Bearer ${getToken()}` },
        },
    });

    authorizedUserApiInstance.interceptors.request.use((config) => {
        if (config.params) {
            const params: URLSearchParams = new URLSearchParams();

            for (const [key, value] of Object.entries(config.params)) {
                if (value !== "" && value !== null && value !== undefined) {
                    params.append(key, value as string);
                }
            }

            config.params = params;
        }

        return config;
    });

    authorizedUserApiInstance.interceptors.response.use(
        (response) => {
            if (response.status === 200) {
                return response;
            } else {
                return Promise.reject({ messages: response.statusText });
            }
        },
        (error) => handleErrorResponse(error, navigate)
    );
}
