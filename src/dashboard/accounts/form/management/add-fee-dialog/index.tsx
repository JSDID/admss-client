import { DashboardDialog, DashboardDialogProps } from "dashboard/common/dialog";
import "./index.css";
import { CurrencyInput } from "dashboard/common/form/inputs";
import { useMemo, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { addAccountFee } from "http/services/accounts.service";
import { useParams } from "react-router-dom";
import { useToast } from "dashboard/common/toast";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { ACCOUNT_FEE_TYPES } from "common/constants/account-options";
import { ComboBox } from "dashboard/common/form/dropdown";

interface AddFeeDialogProps extends DashboardDialogProps {}
type AddFeeInfo = {
    type: string;
    other: string;
    amount: number;
    reason: string;
    description: string;
};

const initialAddFee: AddFeeInfo = {
    type: "",
    other: "",
    amount: 0,
    reason: "",
    description: "",
};

export const AddFeeDialog = ({ onHide, action, visible }: AddFeeDialogProps) => {
    const { id } = useParams();
    const [addFee, setAddFee] = useState<AddFeeInfo>(initialAddFee);
    const toast = useToast();
    const [changedFields, setChangedFields] = useState<Record<string, boolean>>({});

    const handleSaveAddFee = () => {
        addAccountFee(id!, addFee).then((res) => {
            if (res?.status === Status.ERROR) {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: res.error,
                    life: TOAST_LIFETIME,
                });
            } else {
                action && action();
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Fee added successfully!",
                    life: TOAST_LIFETIME,
                });
                setAddFee(initialAddFee);
                setChangedFields({});
                onHide();
            }
        });
    };

    const buttonDisabled = useMemo(() => {
        return !addFee.amount || !addFee.reason;
    }, [addFee]);

    const handleOnCloseClick = () => {
        setAddFee(initialAddFee);
        setChangedFields({});
        onHide();
    };

    const handleInputChange = (field: keyof AddFeeInfo, value: any) => {
        setAddFee((prev) => ({ ...prev, [field]: value }));
        setChangedFields((prev) => ({ ...prev, [field]: true }));
    };

    return (
        <DashboardDialog
            className='dialog__add-fee add-fee'
            footer='Save'
            header='Add Fee'
            visible={visible}
            onHide={handleOnCloseClick}
            action={handleSaveAddFee}
            buttonDisabled={buttonDisabled}
            cancelButton
        >
            <ComboBox
                className={`w-full ${changedFields.type ? "" : "input--grey"}`}
                value={addFee.type}
                onChange={({ value }) => {
                    handleInputChange("type", value);
                    if (value !== "Other") {
                        handleInputChange("other", "");
                    }
                }}
                options={[...ACCOUNT_FEE_TYPES]}
                label='Type'
                optionLabel='name'
                optionValue='name'
            />

            <span className='p-float-label'>
                <InputText
                    className={`w-full ${changedFields.other ? "" : "input--grey"}`}
                    disabled={addFee.type !== "Other"}
                    value={addFee.other}
                    onChange={({ target: { value } }) => handleInputChange("other", value)}
                />
                <label className='float-label'>Other</label>
            </span>

            <div className='splitter mb-2'>
                <hr className='splitter__line flex-1' />
            </div>

            <div className='add-fee__control'>
                <CurrencyInput
                    className={`add-fee__input ${changedFields.amount ? "" : "input--grey"}`}
                    value={addFee.amount}
                    onFocus={() => setChangedFields((prev) => ({ ...prev, amount: true }))}
                    onChange={({ value }) => handleInputChange("amount", value || 0)}
                    title='Principal (required)'
                    labelPosition='top'
                />
            </div>

            <span className='p-float-label'>
                <InputText
                    className={`w-full ${changedFields.reason ? "" : "input--grey"}`}
                    value={addFee.reason}
                    onChange={({ target: { value } }) => handleInputChange("reason", value)}
                />
                <label className='float-label'>Reason (required)</label>
            </span>

            <span className='p-float-label'>
                <InputTextarea
                    className={`w-full add-fee__area ${changedFields.description ? "" : "input--grey"}`}
                    value={addFee.description}
                    onChange={({ target: { value } }) => handleInputChange("description", value)}
                />
                <label className='float-label'>Description</label>
            </span>

            <p className='add-fee__remember'>
                <span className='add-fee__remember--bold'>REMEMBER!</span> Crediting fees is not the
                same as taking a payment. Use this screen to add or remove a charge. If you are
                taking a payment, use the "Take Payment" Screen, and select "Misc / Fee Payment" as
                the payment type.
            </p>
        </DashboardDialog>
    );
};
