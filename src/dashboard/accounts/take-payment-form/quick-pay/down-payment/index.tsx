import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import { useStore } from "store/hooks";

const date = new Date();
const currentDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

export const AccountDownPaymentInfo = observer((): ReactElement => {
    const store = useStore().accountStore;
    const {
        accountPaymentsInfo: { QuickPay },
    } = store;
    return (
        <div className='take-payment__card pr-5'>
            <div className='take-payment__item'>
                <label className='take-payment__label flex-1'>Down Payment Balance:</label>
                <span className='take-payment__value'>
                    $ {QuickPay?.DownPaymentBalance || "0.00"}
                </span>
            </div>
            <div className='take-payment__item color-red'>
                <label className='take-payment__label flex-1'>Fees Balance:</label>
                <span className='take-payment__value'>$ {QuickPay?.FeesBalance || "0.00"}</span>
            </div>
            <div className='take-payment__item color-red'>
                <label className='take-payment__label flex-1'>
                    New late fees due as of {currentDate}:
                </label>
                <span className='take-payment__value'>$ {QuickPay?.NewLateFeesDue || "0.00"}</span>
            </div>
            <div className='take-payment__item color-green'>
                <label className='take-payment__label flex-1'>
                    Interest Due as of ${currentDate}:
                </label>
                <span className='take-payment__value'>$ {QuickPay?.InterestDue || "0.00"}</span>
            </div>
            <div className='take-payment__item color-green'>
                <label className='take-payment__label flex-1'>Principal Balance:</label>
                <span className='take-payment__value'>
                    $ {QuickPay?.PrincipalBalance || "0.00"}
                </span>
            </div>

            <hr className='form-line' />

            <div className='take-payment__item color-bold'>
                <label className='take-payment__label flex-1'>
                    Total Payoff as of {currentDate}:
                </label>
                <span className='take-payment__value'>$0.00</span>
            </div>
        </div>
    );
});
