import { ACCOUNT_PAYMENT_METHODS } from "common/constants/account-options";
import { ComboBox } from "dashboard/common/form/dropdown";
import { CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ReactElement, useState } from "react";
import { useStore } from "store/hooks";

export const PayOffInfo = observer((): ReactElement => {
    const store = useStore().accountStore;
    const [fieldChanged, setFieldChanged] = useState<Record<string, boolean>>({});

    const {
        accountTakePayment: {
            PayOffBalancePaydown,
            PayOffDownPayment,
            PayOffFees,
            PaymentDate,
            PaymentMethod,
            CheckNumber,
            PaymentTakenBy,
        },
        accountExtData: { Total_Paid },
        changeAccountTakePayment,
        accountDrawers,
    } = store;

    const markFieldChanged = (field: string) => {
        setFieldChanged((prev) => ({ ...prev, [field]: true }));
    };

    return (
        <div className='take-payment__card pay-off'>
            <h3 className='take-payment__title'>Pay Off Account</h3>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Payment Date</label>
                <DateInput
                    className={`take-payment__input ${
                        fieldChanged["PaymentDate"] ? "input-change" : ""
                    }`}
                    date={PaymentDate ? new Date(PaymentDate).getTime() : undefined}
                    emptyDate
                    onChange={({ target: { value } }) => {
                        markFieldChanged("PaymentDate");
                        changeAccountTakePayment("PaymentDate", value ? String(value) : "");
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
                    optionValue='name'
                    optionLabel='name'
                    value={PaymentMethod}
                    onChange={(e) => {
                        markFieldChanged("PaymentMethod");
                        changeAccountTakePayment("PaymentMethod", e.value);
                    }}
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
            <div className='take-payment__item'>
                <label className='take-payment__label'>Balance Paydown</label>
                <CurrencyInput
                    className={`take-payment__input ${
                        fieldChanged["PayOffBalancePaydown"] ? "input-change" : ""
                    }`}
                    value={PayOffBalancePaydown}
                    onChange={(e) => {
                        markFieldChanged("PayOffBalancePaydown");
                        changeAccountTakePayment("PayOffBalancePaydown", e.value || 0);
                    }}
                />
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Down Payment</label>
                <CurrencyInput
                    className={`take-payment__input ${
                        fieldChanged["PayOffDownPayment"] ? "input-change" : ""
                    }`}
                    value={PayOffDownPayment}
                    onChange={(e) => {
                        markFieldChanged("PayOffDownPayment");
                        changeAccountTakePayment("PayOffDownPayment", e.value || 0);
                    }}
                />
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Fees Payment</label>
                <CurrencyInput
                    className={`take-payment__input ${
                        fieldChanged["PayOffFees"] ? "input-change" : ""
                    }`}
                    value={PayOffFees}
                    onChange={(e) => {
                        markFieldChanged("PayOffFees");
                        changeAccountTakePayment("PayOffFees", e.value || 0);
                    }}
                />
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label take-payment__label--green'>
                    Total Paid:
                </label>
                <span className='take-payment__value take-payment__value--green'>
                    $ {Total_Paid?.toFixed(2) || "0.00"}
                </span>
            </div>
            <hr className='form-line' />
            <div className='take-payment__item'>
                <label className='take-payment__label'>Cash Drawer</label>
                <ComboBox
                    id='cashDrawer'
                    className={`take-payment__input ${
                        fieldChanged["CashDrawer"] ? "input-change" : ""
                    }`}
                    optionLabel='drawer'
                    optionValue='drawer'
                    onChange={(e) => {
                        markFieldChanged("CashDrawer");
                        changeAccountTakePayment("CashDrawer", e.value);
                    }}
                    options={accountDrawers}
                />
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Payoff Taken By</label>
                <InputText
                    id='payoffTakenBy'
                    className={`take-payment__input ${
                        fieldChanged["PaymentTakenBy"] ? "input-change" : ""
                    }`}
                    value={PaymentTakenBy}
                    onChange={(e) => {
                        markFieldChanged("PaymentTakenBy");
                        changeAccountTakePayment("PaymentTakenBy", e.target.value);
                    }}
                />
            </div>
            <Button label='Apply Payment' className='pay-off__button' outlined />
        </div>
    );
});
