import { FilterOptions } from "dashboard/common/filter";

export const isObjectValuesEmpty = (obj: Record<string, string | number>) =>
    Object.values(obj).every((value) =>
        typeof value === "string" ? !value.trim().length : !value
    );

export const filterParams = (
    obj: Record<string, string | number>
): Record<string, string | number> => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) =>
            typeof value === "string"
                ? value.trim().length > 0
                : value !== null && value !== undefined
        )
    );
};

export const createStringifySearchQuery = (obj: Record<string, string | number>): string => {
    const filteredObj = filterParams(obj);

    if (Object.keys(filteredObj).length === 0) {
        return "";
    }

    return Object.entries(filteredObj)
        .map(([key, value], index) => {
            return `${index > 0 ? "+" : ""}${value}.${key}`;
        })
        .join("");
};

export const createStringifyFilterQuery = (filterArray: FilterOptions[]): string => {
    return filterArray
        .map(({ column, value }, index) => {
            if (value.includes("-")) {
                const [wordFrom, wordTo] = value.split("-");
                return `${index > 0 ? "+" : ""}${wordFrom}.${wordTo}.${column}`;
            }
            return `${value.trim()}.${column}`;
        })
        .join("+");
};

export function debounce<T extends (...args: any[]) => any>(
    callee: T,
    timeoutMs: number
): (...args: Parameters<T>) => void {
    let lastCall: number | null = null;
    let lastCallTimer: NodeJS.Timeout | null = null;

    return function perform(...args: Parameters<T>): void {
        if (lastCall !== null && Date.now() - lastCall <= timeoutMs) {
            if (lastCallTimer) {
                clearTimeout(lastCallTimer);
            }
        }

        lastCall = Date.now();

        lastCallTimer = setTimeout(() => {
            callee(...args);
        }, timeoutMs);
    };
}

export const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, "");
    let formatted = "";

    switch (true) {
        case digits.length === 11 && digits.startsWith("1"):
            formatted = `${digits[0]}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
            break;
        case digits.length === 10:
            formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
            break;
        case digits.length > 6:
            formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
            break;
        case digits.length > 3:
            formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}`;
            break;
        case digits.length > 0:
            formatted = digits.slice(0, 3);
            break;
    }

    return formatted;
};

interface FormatCurrencyOptions {
    digitsAfterDecimal?: number;
}

export const formatCurrency = (
    value: string | number,
    options: FormatCurrencyOptions = {}
): string => {
    const { digitsAfterDecimal = 2 } = options;

    if (typeof value === "string") {
        value = Number(value);
    }

    const formattedValue = value
        .toFixed(digitsAfterDecimal)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    return `$ ${formattedValue}`;
};

export const centsToDollars = (cents: number): number => {
    const dollars = cents * 100;

    return Number(dollars.toFixed(2));
};

export const setCursorToStart = (element: HTMLInputElement | null) => {
    if (element) {
        setTimeout(() => element.setSelectionRange(0, 0), 0);
    }
};

export const truncateText = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const formatDateForServer = (date: Date | number): string => {
    const parsedDate = new Date(date);
    const pad = (num: number) => num.toString().padStart(2, "0");

    const { month, day, year, hours, minutes, seconds } = {
        month: parsedDate.getMonth() + 1,
        day: parsedDate.getDate(),
        year: parsedDate.getFullYear(),
        hours: parsedDate.getHours(),
        minutes: parsedDate.getMinutes(),
        seconds: parsedDate.getSeconds(),
    };

    return `${pad(month)}/${pad(day)}/${year} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const parseDateFromServer = (dateString: string): number => {
    if (!dateString) return 0;
    const parts = dateString.split(" ");
    const dateParts = parts[0].split("/");
    const timeParts = parts[1].split(":");

    return new Date(
        parseInt(dateParts[2]),
        parseInt(dateParts[0]) - 1,
        parseInt(dateParts[1]),
        parseInt(timeParts[0]),
        parseInt(timeParts[1]),
        parseInt(timeParts[2])
    ).getTime();
};

export const parseCustomDate = (dateAsString: string): number => {
    if (dateAsString.length !== 8) {
        throw new Error(
            `Invalid date string length: expected 8 characters, got ${dateAsString.length}`
        );
    }

    if (!/^\d{8}$/.test(dateAsString)) {
        throw new Error("Invalid date string: must contain only digits");
    }

    const month = parseInt(dateAsString.slice(0, 2), 10) - 1;
    const day = parseInt(dateAsString.slice(2, 4), 10);
    const year = parseInt(dateAsString.slice(4, 8), 10);

    const MIN_DAY = 1;
    const MAX_DAY = 31;
    const MIN_MONTH = 0;
    const MAX_MONTH = 11;
    const MIN_YEAR = 1900;
    const MAX_YEAR = 9999;

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
        throw new Error("Invalid date string: failed to parse month, day, or year");
    }

    if (month < MIN_MONTH || month > MAX_MONTH) {
        throw new Error(
            `Invalid month: ${month + 1} (must be between ${MIN_MONTH + 1} and ${MAX_MONTH + 1})`
        );
    }
    if (day < MIN_DAY || day > MAX_DAY) {
        throw new Error(`Invalid day: ${day} (must be between ${MIN_DAY} and ${MAX_DAY})`);
    }
    if (year < MIN_YEAR || year > MAX_YEAR) {
        throw new Error(`Invalid year: ${year} (must be between ${MIN_YEAR} and ${MAX_YEAR})`);
    }

    const date = new Date(year, month, day);

    if (isNaN(date.getTime()) || date.getMonth() !== month || date.getDate() !== day) {
        throw new Error(`Invalid date: ${dateAsString} does not represent a valid date`);
    }

    return date.getTime();
};

export const validateDates = (
    start: string | number,
    due: string | number
): { isValid: boolean; error?: string } => {
    if (new Date(start) > new Date(due)) {
        return { isValid: false, error: "Start Date must be before Due Date" };
    }
    return { isValid: true };
};
