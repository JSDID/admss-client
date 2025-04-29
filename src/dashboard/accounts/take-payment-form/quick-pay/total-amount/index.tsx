import { ACCOUNT_PAYMENT_METHODS } from "common/constants/account-options";
import { TOAST_LIFETIME } from "common/settings";
import { ComboBox } from "dashboard/common/form/dropdown";
import { DateInput, CurrencyInput } from "dashboard/common/form/inputs";
import { useToast } from "dashboard/common/toast";
import { checkAccountPaymentInfo } from "http/services/accounts.service";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ReactElement, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "store/hooks";

export const AccountTotalAmount = observer((): ReactElement => {
    const { id } = useParams();
    const store = useStore().accountStore;
    const toast = useToast();
    const [fieldChanged, setFieldChanged] = useState<Record<string, boolean>>({});

    const {
        accountTakePayment: {
            PaymentDate,
            PaymentMethod,
            CheckNumber,
            TotalAmount,
            BreakdownDownPayment,
            BreakdownFees,
            BreakdownPrincipal,
            BreakdownContractPayment,
        },
        changeAccountTakePayment,
    } = store;

    const handleCheckPayment = async () => {
        if (TotalAmount && id) {
            const response = await checkAccountPaymentInfo(id, {
                TotalAmount,
            });

            if (response?.error) {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: response.error,
                    life: TOAST_LIFETIME,
                });
            }
        }
    };

    const markFieldChanged = (field: string) => {
        setFieldChanged((prev) => ({ ...prev, [field]: true }));
    };

    return (
        <div className='take-payment__card'>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Payment Date</label>
                <DateInput
                    className={`take-payment__input ${
                        fieldChanged["PaymentDate"] ? "input-change" : ""
                    }`}
                    date={PaymentDate}
                    onChange={(e) => {
                        markFieldChanged("PaymentDate");
                        changeAccountTakePayment("PaymentDate", e.target.value as string);
                    }}
                />
            </div>

            <div className='take-payment__item'>
                <label className='take-payment__label'>Pmt Method</label>
                <ComboBox
                    id='pmtMethod'
                    className={`take-payment__input ${
                        fieldChanged["PaymentMethod"] ? "input-change" : ""
                    }`}
                    options={[...ACCOUNT_PAYMENT_METHODS]}
                    value={PaymentMethod}
                    onChange={(e) => {
                        markFieldChanged("PaymentMethod");
                        changeAccountTakePayment("PaymentMethod", e.value);
                    }}
                    optionValue='name'
                    optionLabel='name'
                />
            </div>

            <div className='take-payment__item'>
                <label className='take-payment__label'>Check#</label>
                <InputText
                    id='checkNumber'
                    className={`take-payment__input ${
                        fieldChanged["CheckNumber"] ? "input-change" : ""
                    }`}
                    value={CheckNumber}
                    onChange={(e) => {
                        markFieldChanged("CheckNumber");
                        changeAccountTakePayment("CheckNumber", e.target.value);
                    }}
                />
            </div>

            <hr className='form-line' />

            <div className='quick-pay__total'>
                <h3 className='quick-pay__title color-green'>Total Amount Paid:</h3>
                <div className='quick-pay__input'>
                    <CurrencyInput
                        className={`quick-pay__total-input ${
                            fieldChanged["TotalAmount"] ? "input-change" : ""
                        }`}
                        value={TotalAmount}
                        onChange={({ value }) => {
                            markFieldChanged("TotalAmount");
                            changeAccountTakePayment("TotalAmount", value as number);
                        }}
                    />
                    <Button
                        severity='secondary'
                        icon='pi pi-arrow-right'
                        onClick={handleCheckPayment}
                    />
                </div>
            </div>

            <hr className='form-line' />

            <h3 className='take-payment__title'>Breakdown of Total Paid</h3>

            <div className='take-payment__item color-dusty-blue'>
                <label className='take-payment__label'>Down/ Pickup:</label>
                <CurrencyInput
                    className={`take-payment__input ${
                        fieldChanged["BreakdownDownPayment"] ? "input-change" : ""
                    }`}
                    value={BreakdownDownPayment}
                    onChange={({ value }) => {
                        markFieldChanged("BreakdownDownPayment");
                        changeAccountTakePayment("BreakdownDownPayment", value as number);
                    }}
                />
            </div>
            <div className='take-payment__item color-red'>
                <label className='take-payment__label'>Fees:</label>
                <CurrencyInput
                    className={`take-payment__input ${
                        fieldChanged["BreakdownFees"] ? "input-change" : ""
                    }`}
                    value={BreakdownFees}
                    onChange={({ value }) => {
                        markFieldChanged("BreakdownFees");
                        changeAccountTakePayment("BreakdownFees", value as number);
                    }}
                />
            </div>
            <div className='take-payment__item color-green'>
                <label className='take-payment__label'>Direct to Principal:</label>
                <CurrencyInput
                    className={`take-payment__input ${
                        fieldChanged["BreakdownPrincipal"] ? "input-change" : ""
                    }`}
                    value={BreakdownPrincipal}
                    onChange={({ value }) => {
                        markFieldChanged("BreakdownPrincipal");
                        changeAccountTakePayment("BreakdownPrincipal", value as number);
                    }}
                />
            </div>
            <div className='take-payment__item color-green'>
                <label className='take-payment__label'>Contract Payment:</label>
                <CurrencyInput
                    className={`take-payment__input ${
                        fieldChanged["BreakdownContractPayment"] ? "input-change" : ""
                    }`}
                    value={BreakdownContractPayment}
                    onChange={({ value }) => {
                        markFieldChanged("BreakdownContractPayment");
                        changeAccountTakePayment("BreakdownContractPayment", value as number);
                    }}
                />
            </div>
        </div>
    );
});
