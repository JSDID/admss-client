import { Checkbox } from "primereact/checkbox";
import { ReactElement, useState } from "react";
import "./index.css";
import { Button } from "primereact/button";
import { ACCOUNT_STATUS_LIST } from "common/constants/account-options";
import { TotalPaidDialog } from "./total-paid-dialog";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { ComboBox } from "dashboard/common/form/dropdown";

export const AccountSettings = observer((): ReactElement => {
    const [accountStatus, setAccountStatus] = useState<string>("");
    const [isDialogActive, setIsDialogActive] = useState<boolean>(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const store = useStore().accountStore;
    const {
        accountExtData: { DoNotReport, CashOnly },
        changeAccountExtData,
    } = store;

    const handleNavigate = (tabName: string) => {
        const params = new URLSearchParams();
        params.set("tab", tabName);
        navigate(`/dashboard/accounts/${id}?${params.toString()}`, { replace: true });
    };

    return (
        <div className='account-settings'>
            <h3 className='account-settings__title account-title'>Account Settings</h3>

            <div className='account-settings__header grid'>
                <div className='col-3'>
                    <ComboBox
                        className='w-full'
                        options={ACCOUNT_STATUS_LIST}
                        optionValue='name'
                        optionLabel='name'
                        value={accountStatus}
                        onChange={({ value }) => setAccountStatus(value)}
                        label='Account Status'
                    />
                </div>
                <div className='col-3 account-settings__checkbox'>
                    <Checkbox
                        inputId='account-settings-cash-only'
                        name='account-settings-cash-only'
                        checked={!!CashOnly}
                        onChange={() => changeAccountExtData("CashOnly", !!CashOnly ? 0 : 1)}
                    />
                    <label htmlFor='account-settings-cash-only' className='ml-2'>
                        Mark Account Cash Only
                    </label>
                </div>
                <div className='col-3 account-settings__checkbox'>
                    <Checkbox
                        inputId='account-settings-report'
                        name='account-settings-report'
                        checked={!!DoNotReport}
                        onChange={() => changeAccountExtData("DoNotReport", !!DoNotReport ? 0 : 1)}
                    />
                    <label htmlFor='account-settings-report' className='ml-2'>
                        Do Not Report To Credit Bureau
                    </label>
                </div>

                <hr className='form-line' />

                <div className='col-6'>
                    <Button
                        className='account-settings__button'
                        outlined
                        onClick={() => handleNavigate("promise-to-pay")}
                    >
                        Change Payment Due Date
                    </Button>
                </div>
                <div className='col-6'>
                    <Button
                        className='account-settings__button'
                        onClick={() => setIsDialogActive(true)}
                    >
                        Update Total Amount Paid
                    </Button>
                </div>
            </div>
            <TotalPaidDialog visible={isDialogActive} onHide={() => setIsDialogActive(false)} />
        </div>
    );
});
