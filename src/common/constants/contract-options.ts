import { TypeList } from "common/models";

export const PAYMENT_FREQUENCY_LIST: readonly Partial<TypeList>[] = [
    { name: "Weekly", id: 1 },
    { name: "Bi-Weekly", id: 2 },
    { name: "Monthly", id: 3 },
    { name: "Semi-Monthly", id: 4 },
];
export const TERM_MONTH_LIST: readonly number[] = [3, 6, 9, 12, 24, 36, 48, 60, 72];

export enum DLSides {
    FRONT = "front",
    BACK = "back",
}

export const SexList = [
    {
        name: "Male",
        id: 1,
    },
    {
        name: "Female",
        id: 2,
    },
];
