import { ReactElement } from "react";
import { InputText } from "primereact/inputtext";
import { DateInput } from "dashboard/common/form/inputs";
import { CalendarChangeEvent } from "primereact/calendar";

interface EditableFieldProps {
    label: string;
    value: string | undefined;
    onChange?: (value: string) => void;
    editMode: boolean;
    inputType?: "text" | "date";
}

export const InsuranceInfoField = ({
    label,
    value,
    editMode,
    onChange,
    inputType = "text",
}: EditableFieldProps): ReactElement => {
    const handleDateChange = (e: CalendarChangeEvent) => {
        const dateInMs = new Date(e.target.value as string).getTime();
        if (onChange) {
            onChange(dateInMs.toString());
        }
    };
    if (editMode) {
        return inputType === "date" ? (
            <DateInput
                id='account-insurance-title-num'
                className='insurance-info__input w-full'
                value={value}
                name={label}
                date={Number(value) || new Date()}
                onChange={handleDateChange}
            />
        ) : (
            <span className='p-float-label'>
                <InputText
                    id='account-insurance-title-num'
                    className='insurance-info__input w-full'
                    value={value || ""}
                    onChange={(e) => onChange && onChange(e.target.value)}
                />
                <label className='float-label'>{label}</label>
            </span>
        );
    } else {
        return (
            <div className='insurance-field'>
                <label className='insurance-field__label'>{label}:</label>
                <span className='insurance-field__value'>{value}</span>
            </div>
        );
    }
};
