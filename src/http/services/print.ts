import { isAxiosError } from "axios";
import { Status } from "common/models/base-response";
import { TestDrive } from "common/models/test-drive";
import { authorizedUserApiInstance } from "http/index";

export const printTestDrive = async (useruid: string, body?: Partial<TestDrive>) => {
    try {
        const request = await authorizedUserApiInstance.post<any>(
            `print/${useruid}/printtestdrive`,
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
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error:
                    error.response?.data.error ||
                    error.response?.statusText ||
                    "Error while print for test drive",
            };
        }
    }
};
