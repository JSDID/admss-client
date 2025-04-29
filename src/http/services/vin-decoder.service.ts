import { isAxiosError } from "axios";
import { BaseResponseError, Status } from "common/models/base-response";
import { authorizedUserApiInstance } from "http/index";

export interface VehicleDecodeInfo extends BaseResponseError {
    BodyStyle: string;
    Category: string;
    Cylinders: string;
    Cylinders_id: number;
    DriveLine: string;
    DriveLine_id: number;
    Engine: string;
    Engine_id: number;
    ExteriorColor: string;
    GroupClass: number;
    GroupClassName: string;
    GroupClassName_uid: string;
    InteriorColor: string;
    Make: string;
    Model: string;
    Notes: string;
    Options: number;
    Status: string;
    StockNo: string;
    Transmission: string;
    Transmission_id: number;
    Trim: string;
    TypeOfFuel: string;
    TypeOfFuel_id: number;
    VIN: string;
    Year: string;
    mileage: string;
    options_codes: string[];
    options_info: string[];
}

export const inventoryDecodeVIN = async (vin: string) => {
    try {
        const request = await authorizedUserApiInstance.get<VehicleDecodeInfo>(
            `decoder/${vin}/vindecode`
        );
        return request.data;
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: Status.ERROR,
                error: error.response?.data.error || "Error while decoding VIN",
            };
        }
    }
};
