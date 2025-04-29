import { ComboBox } from "dashboard/common/form/dropdown";
import { CurrencyInput } from "dashboard/common/form/inputs";
import { observer } from "mobx-react-lite";
import { InputText } from "primereact/inputtext";
import { ReactElement, useState } from "react";
import { useStore } from "store/hooks";

export const AccountAuditInfo = observer((): ReactElement => {
    const store = useStore().accountStore;
    const [fieldChanged, setFieldChanged] = useState<Record<string, boolean>>({});

    const {
        accountTakePayment: { CashDrawer, PaymentTakenBy, AmountTendered, Notes, Charge },
        changeAccountTakePayment,
        accountDrawers,
    } = store;

    const markFieldChanged = (field: string) => {
        setFieldChanged((prev) => ({ ...prev, [field]: true }));
    };

    return (
        <div className='take-payment__card'>
            <h3 className='take-payment__title'>Audit Information</h3>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Cash Drawer</label>
                <ComboBox
                    id='cashDrawer'
                    className={`take-payment__input--small ${
                        fieldChanged["CashDrawer"] ? "input-change" : ""
                    }`}
                    value={CashDrawer}
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
                <label className='take-payment__label'>Payment Taken By:</label>
                <InputText
                    className={`take-payment__input--small ${
                        fieldChanged["PaymentTakenBy"] ? "input-change" : ""
                    }`}
                    value={PaymentTakenBy}
                    onChange={(e) => {
                        markFieldChanged("PaymentTakenBy");
                        changeAccountTakePayment("PaymentTakenBy", e.target.value);
                    }}
                />
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Payment Notes:</label>
                <InputText
                    className={`take-payment__input--small ${
                        fieldChanged["Notes"] ? "input-change" : ""
                    }`}
                    value={Notes}
                    onChange={(e) => {
                        markFieldChanged("Notes");
                        changeAccountTakePayment("Notes", e.target.value);
                    }}
                />
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Amount Tendered:</label>
                <CurrencyInput
                    value={AmountTendered}
                    className={`take-payment__input--small ${
                        fieldChanged["AmountTendered"] ? "input-change" : ""
                    }`}
                    onChange={({ value }) => {
                        markFieldChanged("AmountTendered");
                        changeAccountTakePayment("AmountTendered", value as number);
                    }}
                />
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Change:</label>
                <CurrencyInput
                    value={Charge}
                    className={`take-payment__input--small ${
                        fieldChanged["Charge"] ? "input-change" : ""
                    }`}
                    onChange={({ value }) => {
                        markFieldChanged("Charge");
                        changeAccountTakePayment("Charge", value as number);
                    }}
                />
            </div>
        </div>
    );
});
