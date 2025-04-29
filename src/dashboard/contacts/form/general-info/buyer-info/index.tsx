import { observer } from "mobx-react-lite";
import { TabPanel, TabView } from "primereact/tabview";
import { ReactElement, useEffect } from "react";
import { ContactsAddressInfo } from "dashboard/contacts/form/general-info/tabs/address";
import { ContactsGeneralInfo } from "dashboard/contacts/form/general-info/tabs/general";
import { ContactsIdentificationInfo } from "dashboard/contacts/form/general-info/tabs/identification";
import { ContactsOfacCheck } from "dashboard/contacts/form/general-info/tabs/ofac-check";
import { GENERAL_CONTACT_TYPE } from "dashboard/contacts/form/general-info";
import { useNavigate, useLocation } from "react-router-dom";
import { useStore } from "store/hooks";

const { BUYER } = GENERAL_CONTACT_TYPE;

const tabs = [
    { header: "General", component: <ContactsGeneralInfo /> },
    { header: "Address", component: <ContactsAddressInfo type={BUYER} /> },
    { header: "Identification", component: <ContactsIdentificationInfo /> },
    { header: "OFAC CHECK", component: <ContactsOfacCheck type={BUYER} /> },
];

export const ContactsBuyerInfo = observer((): ReactElement => {
    const store = useStore().contactStore;
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
        <div className='col-12 p-0'>
            <TabView
                className='contact-form__tabs'
                activeIndex={activeTab || 0}
                onTabChange={handleTabChange}
            >
                {tabs.map((tab, index) => (
                    <TabPanel key={index} header={tab.header}>
                        {tab.component}
                    </TabPanel>
                ))}
            </TabView>
        </div>
    );
});
