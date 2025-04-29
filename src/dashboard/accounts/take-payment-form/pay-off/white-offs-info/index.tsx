import { observer } from "mobx-react-lite";
import { Checkbox } from "primereact/checkbox";
import { ReactElement } from "react";
import { useStore } from "store/hooks";

export const WhiteOffsInfo = observer((): ReactElement => {
    const store = useStore().accountStore;
    const {
        accountPaymentsInfo: { WriteOff },
    } = store;
    return (
        <div className='take-payment__card mt-3'>
            <h3 className='take-payment__title'>White Offs</h3>
            <div className='take-payment__item justify-content-start align-items-start'>
                <Checkbox checked inputId='whiteOffs' disabled className='mt-1' />
                <label className='take-payment__label ml-2 flex-1'>
                    Do not write off these amounts, show them <br /> as still owing.
                </label>
            </div>

            <div className='take-payment__item'>
                <label className='take-payment__label'>Principal White Off:</label>
                <span className='take-payment__value ml-auto pr-4'>
                    $ {WriteOff?.PrincipalWriteOff || "0.00"}
                </span>
            </div>

            <div className='take-payment__item'>
                <label className='take-payment__label'>Interest White Off:</label>
                <span className='take-payment__value ml-auto pr-4'>
                    $ {WriteOff?.InterestWriteOff || "0.00"}
                </span>
            </div>

            <div className='take-payment__item'>
                <label className='take-payment__label'>Late Charge White Off:</label>
                <span className='take-payment__value ml-auto pr-4'>
                    $ {WriteOff?.LateChargeWriteOff || "0.00"}
                </span>
            </div>
        </div>
    );
});
