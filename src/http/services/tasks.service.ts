import { isAxiosError } from "axios";
import { BaseResponseError, Status } from "common/models/base-response";
import { QueryParams } from "common/models/query-params";
import { PostDataTask, Task, TaskStatus, TaskUser } from "common/models/tasks";

import { authorizedUserApiInstance } from "http/index";

export const getAllTasks = async (useruid: string, params?: QueryParams) => {
    try {
        const response = await authorizedUserApiInstance
            .get<Task[] & BaseResponseError>(`tasks/${useruid}/list`, {
                params,
            })
            .then((response) => response.data)
            .catch((err) => err.response.data);
        return response;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting tasks",
            };
        }
    }
};

export const getCurrentUserTasks = async (useruid: string, params?: QueryParams) => {
    try {
        const response = await authorizedUserApiInstance
            .get<Task[] & BaseResponseError>(`tasks/${useruid}/listcurrent`, {
                params,
            })
            .then((response) => response.data)
            .catch((err) => err.response.data);
        return response;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting current user tasks",
            };
        }
    }
};

export const createTask = async (taskData: Partial<PostDataTask>, taskuid?: string | undefined) => {
    try {
        const response = await authorizedUserApiInstance.post<BaseResponseError>(
            `tasks/${taskuid || 0}/set`,
            taskData
        );
        if (response.data.status === Status.OK) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.error ||
                    `Error while ${taskuid ? "update" : "create"} task`,
            };
        }
    }
};

export const getTasksUserList = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<TaskUser[]>(`user/${useruid}/users`);
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while getting tasks user list",
            };
        }
    }
};

export const getTasksSubUserList = async (useruid: string) => {
    try {
        const request = await authorizedUserApiInstance.get<TaskUser[]>(
            `user/${useruid || 0}/subusers`
        );
        return request.data;
    } catch (error) {
        return {
            status: Status.ERROR,
            error: "Error while getting tasks sub user list",
        };
    }
};

export const deleteTask = async (taskIndex: number) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError>(
            `tasks/${taskIndex}/delete`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while deleting task",
            };
        }
    }
};

export const setTaskStatus = async (taskuid: string, taskStatus: TaskStatus) => {
    try {
        const request = await authorizedUserApiInstance.post<BaseResponseError>(
            `tasks/${taskuid || 0}/status`,
            {
                status: taskStatus,
            }
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || `Error while set task status to ${taskStatus}`,
            };
        }
    }
};
