import { BorderedCheckbox } from "dashboard/common/form/inputs";
import "./index.css";
import { useStore } from "store/hooks";
import { GeneralSettings } from "common/models/general-settings";
import { observer } from "mobx-react-lite";

export const SettingsInventoryDefaults = observer(() => {
    const store = useStore().generalSettingsStore;
    const { settings, changeSettings } = store;

    const handleChange = (name: keyof GeneralSettings) => {
        changeSettings(name, settings[name] ? 0 : 1);
    };

    return (
        <div className='settings-inventory-default'>
            <BorderedCheckbox
                name='Mark Inventory PAID by default'
                checked={!!settings.defInvMarkPaid}
                onChange={() => handleChange("defInvMarkPaid")}
            />
            <BorderedCheckbox
                name='Mark Inventory TITLE RECEIVED by default'
                checked={!!settings.defInvTitleReceived}
                onChange={() => handleChange("defInvTitleReceived")}
            />
            <BorderedCheckbox
                name='Mark Inventory EXPORT TO WEB by default'
                checked={!!settings.defInvExportToWeb}
                onChange={() => handleChange("defInvExportToWeb")}
            />
            <BorderedCheckbox
                name='Mark Expenses DO NOT BILL by default'
                checked={!!settings.defInvDoNotBill}
                onChange={() => handleChange("defInvDoNotBill")}
            />
            <BorderedCheckbox
                name='Mark Expenses DO NOT POST by default'
                checked={!!settings.defInvDoNotPost}
                onChange={() => handleChange("defInvDoNotPost")}
            />
        </div>
    );
});
