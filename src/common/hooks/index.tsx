import { setCursorToStart } from "common/helpers";
import { RefObject, useEffect, useState } from "react";

export const useCursorToStart = (containerRef: RefObject<HTMLDivElement>) => {
    useEffect(() => {
        const realInput = containerRef.current?.querySelector("input");
        if (realInput) {
            realInput.addEventListener("focus", () => setCursorToStart(realInput));
        }
    }, [containerRef]);
};

interface DateRangeResult {
    startDate: string | number;
    endDate: string | number;
    isButtonDisabled: boolean;
    handleDateChange: (date: number, isStartDate: boolean) => void;
}

export const useDateRange = (): DateRangeResult => {
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string | number>("");
    const [endDate, setEndDate] = useState<string | number>("");

    useEffect(() => {
        if (!startDate || !endDate) {
            setIsButtonDisabled(true);
        } else {
            setIsButtonDisabled(false);
        }
    }, [startDate, endDate]);

    const handleDateChange = (date: number, isStartDate: boolean) => {
        if (isStartDate) {
            setStartDate(date);
            if (!endDate || Number(endDate) < date) {
                setEndDate(date);
            }
        } else {
            setEndDate(date);
        }
    };

    return {
        startDate,
        endDate,
        isButtonDisabled,
        handleDateChange,
    };
};
