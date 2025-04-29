import {
    ACCOUNT_PAYMENT_METHODS,
    ACCOUNT_PAYMENT_METHODS_NAMES,
} from "common/constants/account-options";
import { AccountDownPayments } from "common/models/accounts";
import { TOAST_LIFETIME } from "common/settings";
import { DashboardDialog } from "dashboard/common/dialog";
import { CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import { useToast } from "dashboard/common/toast";
import { DialogProps } from "primereact/dialog";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { useStore } from "store/hooks";
import "./index.css";
import { InputText } from "primereact/inputtext";
import { ComboBox } from "dashboard/common/form/dropdown";

interface DownPaymentDialogProps extends DialogProps {
    visible: boolean;
    onHide: () => void;
    payments: AccountDownPayments[];
}

export const DownPaymentDialog = ({
    visible,
    onHide,
    ...props
}: DownPaymentDialogProps): ReactElement => {
    const toast = useToast();
    const store = useStore().accountStore;
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const currentTime = useMemo(
        () => `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        []
    );
    const [paymentDate, setPaymentDate] = useState<string>(currentTime);
    const [paymentType, setPaymentType] = useState<ACCOUNT_PAYMENT_METHODS_NAMES | null>(null);
    const [checkNumber, setCheckNumber] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    useEffect(() => {
        if (paymentDate && paymentType && amount) {
            setIsButtonDisabled(false);
        }
    }, [amount, paymentDate, paymentType]);

    const isCheckNumberActive = useMemo(
        () => paymentType === ACCOUNT_PAYMENT_METHODS_NAMES.CHECK,
        [paymentType, amount]
    );

    const handleDownPayment = () => {
        if (!authUser) return;
        toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Payment paid successfully!",
            life: TOAST_LIFETIME,
        });
        store.isAccountChanged = true;
        onHide();
    };

    return (
        <DashboardDialog
            className='payment-dialog'
            footer='Apply'
            header='Down Payment'
            cancelButton
            visible={visible}
            onHide={onHide}
            action={handleDownPayment}
            buttonDisabled={isButtonDisabled}
            {...props}
        >
            <div className='flex flex-column gap-4 pt-3'>
                <DateInput
                    name='Payment Date'
                    date={paymentDate}
                    value={paymentDate}
                    emptyDate
                    onChange={(e) => setPaymentDate(e.target.value as string)}
                />

                <ComboBox
                    options={[...ACCOUNT_PAYMENT_METHODS]}
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.value)}
                    optionValue='name'
                    label='Payment Type'
                    optionLabel='name'
                    className='w-full payment-dialog__dropdown'
                />

                {isCheckNumberActive && (
                    <span className='p-float-label'>
                        <InputText
                            value={checkNumber}
                            onChange={({ target: { value } }) => setCheckNumber(value)}
                            className='payment-dialog__text-input w-full'
                        />
                        <label className='float-label'>Check#</label>
                    </span>
                )}
                <CurrencyInput
                    value={amount}
                    title='Amount'
                    labelPosition='top'
                    onChange={({ value }) => setAmount(value as number)}
                />
            </div>
        </DashboardDialog>
    );
};
