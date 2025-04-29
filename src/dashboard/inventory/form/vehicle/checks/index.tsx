import { ReactElement, useEffect } from "react";
import "./index.css";
import { observer } from "mobx-react-lite";
import { TabPanel, TabView } from "primereact/tabview";
import { useStore } from "store/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { VehicleInspections } from "dashboard/inventory/form/vehicle/checks/vehicle-inspections";
import { StateInspections } from "dashboard/inventory/form/vehicle/checks/state-inspections";

const tabs = [
    { header: "State inspections", component: <StateInspections /> },
    { header: "Vehicle inspections", component: <VehicleInspections /> },
];

export const VehicleChecklist = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const { activeTab } = store;
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");

    useEffect(() => {
        store.activeTab = tabParam ? parseInt(tabParam, 10) : 0;
        store.tabLength = tabs.length;
        return () => {
            store.activeTab = null;
            store.tabLength = 0;
        };
    }, [tabParam]);

    const handleTabChange = (e: { index: number }) => {
        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.set("tab", e.index.toString());
        navigate({
            pathname: location.pathname,
            search: newSearchParams.toString(),
        });
    };
    return (
        <TabView
            className='inventory-form__tabs'
            activeIndex={activeTab || 0}
            onTabChange={handleTabChange}
        >
            {tabs.map((tab, index) => (
                <TabPanel key={index} header={tab.header}>
                    {tab.component}
                </TabPanel>
            ))}
        </TabView>
    );
});
