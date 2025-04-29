import "./index.css";
import { ReactElement, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { SettingsFees } from "dashboard/profile/generalSettings/fees";
import { SettingsDeals } from "dashboard/profile/generalSettings/deals";
import { SettingsTaxes } from "dashboard/profile/generalSettings/taxes";
import { SettingsLease } from "dashboard/profile/generalSettings/lease";
import { SettingsAccount } from "dashboard/profile/generalSettings/account";
import { SettingsContract } from "dashboard/profile/generalSettings/contract";
import { SettingsWatermarking } from "dashboard/profile/generalSettings/watermarking";
import { InventorySettings } from "dashboard/profile/generalSettings/inventory-settings";
import { SettingsOther } from "dashboard/profile/generalSettings/other";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";

interface TabItem {
    settingName: string;
    component: ReactElement;
    route: string;
}

export const GeneralSettings = observer((): ReactElement => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const store = useStore().generalSettingsStore;
    const toast = useToast();
    const { isSettingsChanged, saveSettings, getSettings } = store;

    useEffect(() => {
        getSettings();
    }, []);

    const handleSave = async () => {
        const response = await saveSettings();
        if (response.error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: response.error,
                life: TOAST_LIFETIME,
            });
        } else {
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Settings saved successfully!",
                life: TOAST_LIFETIME,
            });
        }
    };

    useEffect(() => {
        const defaultTabRoute = tabItems[0].route;
        const currentTab = searchParams.get("section");
        if (!currentTab) {
            setSearchParams({ section: defaultTabRoute });
        }
    }, [searchParams, setSearchParams]);

    const tabItems: TabItem[] = [
        {
            settingName: "Deals",
            route: "deals",
            component: (
                <SettingsDeals
                    settings={[
                        { name: "deal1", title: "Default deal type", value: 0 },
                        { name: "deal3", title: "Default deal status", value: 1 },
                    ]}
                />
            ),
        },
        { settingName: "Fees", route: "fees", component: <SettingsFees /> },
        { settingName: "Taxes", route: "taxes", component: <SettingsTaxes /> },
        {
            settingName: "Inventory settings",
            route: "inventory-settings",
            component: <InventorySettings />,
        },
        {
            settingName: "Account Settings",
            route: "account-settings",
            component: <SettingsAccount />,
        },
        {
            settingName: "Contract Settings",
            route: "contract-settings",
            component: <SettingsContract />,
        },
        { settingName: "Lease Settings", route: "lease-settings", component: <SettingsLease /> },
        {
            settingName: "Watermarking",
            route: "watermarking",
            component: <SettingsWatermarking />,
        },
        {
            settingName: "Other",
            route: "other",
            component: <SettingsOther />,
        },
    ];

    const activeTabParam = searchParams.get("section") || tabItems[0].route;
    const activeTabIndex = tabItems.findIndex((section) => section.route === activeTabParam);

    const handleTabChange = (index: number) => {
        const selectedTabRoute = tabItems[index].route;
        setSearchParams({ section: selectedTabRoute });
    };

    const handleBackClick = () => {
        const newIndex = Math.max(activeTabIndex - 1, 0);
        handleTabChange(newIndex);
    };

    const handleNextClick = () => {
        const newIndex = Math.min(activeTabIndex + 1, tabItems.length - 1);
        handleTabChange(newIndex);
    };

    return (
        <div className='grid relative general-settings'>
            <Button
                icon='pi pi-times'
                className='p-button close-button'
                onClick={() => navigate("/dashboard")}
            />
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header flex'>
                        <h2 className='card-header__title uppercase m-0'>General settings</h2>
                    </div>
                    <TabView
                        className='general-settings__tabs'
                        activeIndex={activeTabIndex}
                        onTabChange={(e) => handleTabChange(e.index)}
                    >
                        {tabItems.map(({ settingName, component }) => {
                            return (
                                <TabPanel
                                    header={settingName}
                                    children={component}
                                    key={settingName}
                                    className='general-settings__panel'
                                />
                            );
                        })}
                    </TabView>
                    <div className='general-settings__buttons'>
                        <Button
                            onClick={handleBackClick}
                            className='uppercase px-6 form__button'
                            disabled={activeTabIndex <= 0}
                            severity={activeTabIndex <= 0 ? "secondary" : "success"}
                            outlined
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNextClick}
                            disabled={activeTabIndex >= tabItems.length - 1}
                            severity={
                                activeTabIndex >= tabItems.length - 1 ? "secondary" : "success"
                            }
                            className='uppercase px-6 form__button'
                            outlined
                        >
                            Next
                        </Button>
                        <Button
                            className='uppercase px-6 form__button'
                            onClick={handleSave}
                            severity={isSettingsChanged ? "success" : "secondary"}
                            disabled={!isSettingsChanged}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});
