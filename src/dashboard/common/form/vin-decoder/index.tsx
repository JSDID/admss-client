import { VehicleDecodeInfo, inventoryDecodeVIN } from "http/services/vin-decoder.service";
import { Button } from "primereact/button";
import { InputText, InputTextProps } from "primereact/inputtext";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";

interface VINDecoderProps extends InputTextProps {
    onAction: (vin: VehicleDecodeInfo) => void;
    buttonClassName?: string;
}
export const MIN_VIN_LENGTH = 1;
export const MAX_VIN_LENGTH = 17;

const validateVin = (vin: string): boolean => {
    return typeof vin === "string" && vin.length >= 1 && vin.length <= 17;
};

export const VINDecoder = ({
    value,
    onAction,
    onChange,
    disabled,
    buttonClassName,
    ...props
}: VINDecoderProps): ReactElement => {
    const toast = useToast();
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

    const handleGetVinInfo = () => {
        const trimedValue = value?.replaceAll(" ", "");
        if (!buttonDisabled && trimedValue && validateVin(trimedValue)) {
            inventoryDecodeVIN(trimedValue).then((response) => {
                if (response && response?.status === Status.ERROR) {
                    toast.current?.show({
                        severity: "error",
                        summary: Status.ERROR,
                        detail: response.error,
                        life: TOAST_LIFETIME,
                    });
                } else {
                    const stringifiedResponse =
                        response &&
                        (Object.fromEntries(
                            Object.entries(response).map(([key, val]) => [key, String(val)])
                        ) as unknown as VehicleDecodeInfo);
                    onAction(stringifiedResponse as VehicleDecodeInfo);
                    toast.current?.show({
                        severity: "success",
                        summary: "Success",
                        detail: "VIN decoded successfully",
                        life: TOAST_LIFETIME,
                    });
                }
            });
        }
    };

    const handleInputChange = (event: any) => {
        onChange && onChange(event);
    };

    useEffect(() => {
        if (value) {
            const valueLength = value.replaceAll(" ", "").length;
            setButtonDisabled(valueLength < MIN_VIN_LENGTH || valueLength > MAX_VIN_LENGTH);
        } else {
            setButtonDisabled(true);
        }
    }, [disabled, value, buttonDisabled]);

    return (
        <span className='p-float-label vin-decoder'>
            <InputText
                {...props}
                className={`vin-decoder__text-input ${props.className}`}
                value={value?.toUpperCase()}
                onChange={handleInputChange}
            />
            <Button
                className={`vin-decoder__decode-button ${buttonClassName}`}
                disabled={buttonDisabled || disabled}
                type='button'
                onClick={handleGetVinInfo}
            >
                Decode
            </Button>
            <label className='float-label'>VIN (required)</label>
        </span>
    );
};
