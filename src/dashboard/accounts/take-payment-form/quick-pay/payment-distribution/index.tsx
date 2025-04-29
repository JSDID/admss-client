import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import { useStore } from "store/hooks";

export const AccountPaymentDistribution = observer((): ReactElement => {
    const store = useStore().accountStore;
    const {
        accountPaymentsInfo: { PaymentDistribution },
    } = store;

    return (
        <div className='take-payment__card'>
            <h3 className='take-payment__title'>Payment Distribution</h3>
            <div className='take-payment__item'>
                <label className='take-payment__label color-dusty-blue'>Down/ Pickup Pmt:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.DownPickupPayment || "0.00"}
                </span>
            </div>
            <div className='take-payment__item color-red'>
                <label className='take-payment__label'>Fees:</label>
                <span className='take-payment__value'>$ {PaymentDistribution?.Fees || "0.00"}</span>
            </div>
            <div className='take-payment__item color-green'>
                <label className='take-payment__label'>Principal:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.Principal || "0.00"}
                </span>
            </div>
            <div className='take-payment__item color-green'>
                <label className='take-payment__label'>Additional Principal:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.AdditionalPrincipal || "0.00"}
                </span>
            </div>
            <div className='take-payment__item color-green'>
                <label className='take-payment__label'>Interest:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.Interest || "0.00"}
                </span>
            </div>
            <div className='take-payment__item color-purple'>
                <label className='take-payment__label'>Taxes Paid:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.TaxesPaid || "0.00"}
                </span>
            </div>
            <div className='take-payment__item take-payment__item--bold'>
                <label className='take-payment__label color-deep-blue'>Total Paid:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.TotalPaid || "0.00"}
                </span>
            </div>

            <hr className='form-line' />

            <div className='take-payment__item'>
                <label className='take-payment__label'>Next Pmt Due:</label>
                <span className='take-payment__value'>{PaymentDistribution?.NextPmtDue}</span>
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Remaining Past Due:</label>
                <span className='take-payment__value'>
                    ${PaymentDistribution?.RemainingPastDue || "0.00"}
                </span>
            </div>

            <hr className='form-line' />

            <div className='take-payment__item take-payment__item--bold'>
                <label className='take-payment__label color-green'>New Acct Balance:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.NewAccountBalance || "0.00"}
                </span>
            </div>
            <div className='take-payment__item take-payment__item--bold'>
                <label className='take-payment__label color-violet'>New Down Pmt Balance:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.NewDownPaymentBalance || "0.00"}
                </span>
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label color-red'>New Fees Added:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.NewFeesAdded || "0.00"}
                </span>
            </div>
            <div className='take-payment__item color-red take-payment__item--bold'>
                <label className='take-payment__label'>New Fees Balance:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.NewFeesBalance || "0.00"}
                </span>
            </div>

            <hr className='form-line' />

            <div className='take-payment__item take-payment__item--bold take-payment__item--subtitle'>
                <label className='take-payment__label'>New Total Balance:</label>
                <span className='take-payment__value'>
                    $ {PaymentDistribution?.NewTotalBalance || "0.00"}
                </span>
            </div>
        </div>
    );
});
