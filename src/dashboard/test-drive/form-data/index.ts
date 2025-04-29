import { TestDrive } from "common/models/test-drive";

export type TestDriver = Pick<
    TestDrive,
    | "dlNumber"
    | "dlExpirationDate"
    | "homePhone"
    | "customerName"
    | "customerLastName"
    | "dlState"
    | "dlIssuingDate"
>;

export type TestVehicle = Pick<TestDrive, "vclVIN" | "vclMake" | "vclModel" | "vclYear">;

export type TestDealer = Pick<TestDrive, "dealersName" | "outOdometer" | "comments" | "outDate">;

const currentDate = new Date().getDate().toString();

export const driverState: TestDriver = {
    customerName: "",
    customerLastName: "",
    homePhone: "",
    dlNumber: "",
    dlState: "",
    dlIssuingDate: currentDate,
    dlExpirationDate: currentDate,
};

export const vehicleState: TestVehicle = {
    vclVIN: "",
    vclMake: "",
    vclModel: "",
    vclYear: "",
};

export const dealerState: TestDealer = {
    dealersName: "",
    outDate: currentDate,
    outOdometer: "",
    comments: "",
};
