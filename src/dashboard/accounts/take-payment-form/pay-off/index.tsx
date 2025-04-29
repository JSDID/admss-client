import { ReactElement } from "react";
import { observer } from "mobx-react-lite";
import "./index.css";
import { TakePaymentInfo } from "dashboard/accounts/take-payment-form/take-payment-info";
import { AccountCashDealInfo } from "./cash-deal";
import { PayOffInfo } from "./pay-off-account";
import { WhiteOffsInfo } from "./white-offs-info";
import { useStore } from "store/hooks";

export const AccountPayOff = observer((): ReactElement => {
    const store = useStore().accountStore;

    const {
        accountPaymentsInfo: { CashDealPayoff },
    } = store;
    return (
        <div className='grid pay-off'>
            <div className='col-12 md:col-4'>
                <AccountCashDealInfo />
                <div className='take-payment__card mt-3'>
                    <h3 className='take-payment__title'>Unearned Interest</h3>

                    <div className='take-payment__item'>
                        <label className='take-payment__label'>Unearned Interest</label>
                        <span className='take-payment__value ml-auto pr-4'>
                            $ {CashDealPayoff?.UnearnedInterest || "0.00"}
                        </span>
                    </div>

                    <div className='take-payment__item px-8 text-center pt-3'>
                        <span>
                            <span className='take-payment__warning-sign'>!</span>
                            Note: You do
                            <span className='take-payment__warning-sign'>NOT</span>
                            owe this amount to the customer
                        </span>
                    </div>
                </div>
            </div>

            <div className='col-12 md:col-4'>
                <PayOffInfo />
                <WhiteOffsInfo />
            </div>

            <div className='col-12 md:col-4'>
                <TakePaymentInfo />
            </div>
        </div>
    );
});
