import { CurrencyInput } from "dashboard/common/form/inputs";
import "./index.css";
import { InputNumber } from "primereact/inputnumber";
import { ComboBox } from "dashboard/common/form/dropdown";
export const SettingsLease = () => {
    return (
        <div className='settings-form'>
            <div className='settings-form__title'>Lease Settings</div>
            <div className='grid settings-lease'>
                <div className='col-3'>
                    <span className='p-float-label'>
                        <InputNumber
                            value={0}
                            id='settings-lease__factor'
                            className='settings-lease__input'
                        />
                        <label
                            htmlFor='settings-lease__factor'
                            className='float-label settings-lease__label'
                        >
                            Money factor
                        </label>
                    </span>
                </div>
                <div className='col-3'>
                    <ComboBox className='settings-lease__dropdown' label='Default mileage' />
                </div>
                <div className='col-3'>
                    <CurrencyInput
                        className='settings-lease-currency__input'
                        title='Overage amount'
                        labelPosition='top'
                        value={0.15}
                    />
                </div>
                <div className='col-3'>
                    <ComboBox
                        id='settings-lease__term'
                        className='settings-lease__dropdown'
                        label='Term (months)'
                    />
                </div>
                <div className='col-3'>
                    <ComboBox className='settings-lease__dropdown' label='Payment frequency' />
                </div>
            </div>
        </div>
    );
};
