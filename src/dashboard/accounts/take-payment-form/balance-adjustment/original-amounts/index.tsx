import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import { useStore } from "store/hooks";

export const AccountOriginalAmounts = observer((): ReactElement => {
    const store = useStore().accountStore;
    const {
        accountPaymentsInfo: { OriginalAmounts },
    } = store;
    return (
        <div className='take-payment__card'>
            <h3 className='take-payment__title'>Original Amounts</h3>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Amount Financed:</label>
                <span className='take-payment__value'>
                    $ {OriginalAmounts?.AmountFinanced || "0.00"}
                </span>
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Expected Interest:</label>
                <span className='take-payment__value'>
                    $ {OriginalAmounts?.ExpectedInterest || "0.00"}
                </span>
            </div>

            <hr className='form-line' />

            <div className='take-payment__item'>
                <label className='take-payment__label'>Principal Paid:</label>
                <span className='take-payment__value'>
                    $ {OriginalAmounts?.PrincipalPaid || "0.00"}
                </span>
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Interest Paid:</label>
                <span className='take-payment__value'>
                    $ {OriginalAmounts?.InterestPaid || "0.00"}
                </span>
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Extra Principal Pmts:</label>
                <span className='take-payment__value'>
                    $ {OriginalAmounts?.ExtraPrincipalPmts || "0.00"}
                </span>
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Down Payment Paid:</label>
                <span className='take-payment__value'>
                    $ {OriginalAmounts?.DownPaymentPaid || "0.00"}
                </span>
            </div>
            <div className='take-payment__item take-payment__item--bold'>
                <label className='take-payment__label'>Total Paid:</label>
                <span className='take-payment__value'>
                    $ {OriginalAmounts?.TotalPaid || "0.00"}
                </span>
            </div>

            <hr className='form-line' />

            <div className='take-payment__item take-payment__item--bold color-green'>
                <label className='take-payment__label text-lg'>Current Balance:</label>
                <span className='take-payment__value text-lg'>
                    $ {OriginalAmounts?.CurrentBalance || "0.00"}
                </span>
            </div>
            <div className='take-payment__item'>
                <label className='take-payment__label'>Next Payment Due:</label>
                <span className='take-payment__value'>{OriginalAmounts?.NextPmtDue}</span>
            </div>
        </div>
    );
});
