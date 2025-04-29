import "./index.css";
import { DashboardRadio } from "dashboard/common/form/inputs";

interface SettingsDealsProps {
    settings: {
        name: string;
        title: string;
        value: number;
    }[];
}

export const SettingsDeals = ({ settings }: SettingsDealsProps): JSX.Element => {
    return (
        <div className='settings-form settings-deals'>
            <div className='settings-form__title'>Deals</div>
            {settings && <DashboardRadio radioArray={settings} />}
        </div>
    );
};
