import { ReactElement } from "react";
import { observer } from "mobx-react-lite";
import "./index.css";
import { TakePaymentInfo } from "dashboard/accounts/take-payment-form/take-payment-info";
import { AccountOriginalAmounts } from "./original-amounts";
import { AccountNewAmounts } from "./new-amounts";
import { AccountAdjustments } from "./adjusments";

export const AccountBalanceAdjustment = observer((): ReactElement => {
    return (
        <div className='grid balance-adjustment'>
            <div className='col-12 md:col-4'>
                <AccountOriginalAmounts />
                <AccountNewAmounts />
            </div>

            <div className='col-12 md:col-4'>
                <AccountAdjustments />
            </div>

            <div className='col-12 md:col-4'>
                <TakePaymentInfo />
            </div>
        </div>
    );
});
