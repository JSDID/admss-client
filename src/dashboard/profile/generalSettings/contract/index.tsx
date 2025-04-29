import { PercentInput } from "dashboard/common/form/inputs";

import "./index.css";
import { ComboBox } from "dashboard/common/form/dropdown";

interface SettingsAccountProps {
    settings?: any;
}

export const SettingsContract = ({ settings }: SettingsAccountProps) => {
    return (
        <div className='settings-form'>
            <div className='settings-form__title'>Contract Settings</div>
            <div className='grid settings-contract'>
                <div className='col-3'>
                    <PercentInput
                        className='settings-contract__input'
                        title='Late fee percentage'
                        labelPosition='top'
                    />
                </div>
                <div className='col-3'>
                    <ComboBox className='settings-contract__dropdown' label='Payment frequency' />
                </div>
            </div>
        </div>
    );
};
