import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { ReactElement, useState } from "react";
import "./index.css";
import { Button } from "primereact/button";

enum LateFeeType {
    PERCENT = "percent",
    CURRENCY = "currency",
}

type ActiveValue = LateFeeType.PERCENT | LateFeeType.CURRENCY;

interface LateFeeInputProps extends InputNumberProps {
    percentValue: number;
    currencyValue: number;
    percentChange: (value: number) => void;
    currencyChange: (value: number) => void;
}

export const LateFeeInput = ({
    percentValue,
    currencyValue,
    percentChange,
    currencyChange,
    ...props
}: LateFeeInputProps): ReactElement => {
    const [activeValue, setActiveValue] = useState<ActiveValue | null>(null);

    return (
        <div className={"flex align-items-center justify-content-between late-fee relative"}>
            <label className='late-fee__label label-top'>Late Fee</label>
            <div className='late-fee__input flex justify-content-center'>
                <Button
                    type='button'
                    label='%'
                    severity={activeValue === LateFeeType.PERCENT ? "success" : "secondary"}
                    onClick={() => setActiveValue(LateFeeType.PERCENT)}
                    className='late-fee__button late-fee__button-percent'
                />
                <Button
                    type='button'
                    label='$'
                    severity={activeValue === LateFeeType.CURRENCY ? "success" : "secondary"}
                    onClick={() => setActiveValue(LateFeeType.CURRENCY)}
                    className='late-fee__button late-fee__button-currency'
                />
                {activeValue === LateFeeType.PERCENT ? (
                    <InputNumber
                        minFractionDigits={2}
                        min={0}
                        locale='en-US'
                        value={percentValue || 0}
                        onChange={({ value }) => value && percentChange(value)}
                        {...props}
                    />
                ) : (
                    <InputNumber
                        minFractionDigits={2}
                        min={0}
                        locale='en-US'
                        value={currencyValue || 0}
                        onChange={({ value }) => value && currencyChange(value)}
                        {...props}
                    />
                )}
            </div>
        </div>
    );
};
