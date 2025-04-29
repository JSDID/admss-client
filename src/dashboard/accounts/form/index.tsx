import { Button } from "primereact/button";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { TabPanel, TabView } from "primereact/tabview";
import { AccountInformation } from "dashboard/accounts/form/information";
import { AccountDownPayment } from "dashboard/accounts/form/down-payment";
import { AccountInsurance } from "dashboard/accounts/form/insuranse";
import { AccountManagement } from "dashboard/accounts/form/management";
import { AccountNotes } from "dashboard/accounts/form/notes";
import { AccountPaymentHistory } from "dashboard/accounts/form/payment-history";
import { AccountPromiseToPay } from "dashboard/accounts/form/promise-to-pay";
import { AccountSettings } from "dashboard/accounts/form/settings";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { Loader } from "dashboard/common/loader";
import { NoticeAlert } from "./common";

interface TabItem {
    tabName: string;
    component?: ReactElement;
}

const tabItems: TabItem[] = [
    { tabName: "Account information", component: <AccountInformation /> },
    { tabName: "Account Management", component: <AccountManagement /> },
    { tabName: "Payment History", component: <AccountPaymentHistory /> },
    { tabName: "Down Payment", component: <AccountDownPayment /> },
    { tabName: "Account Settings", component: <AccountSettings /> },
    { tabName: "Notes", component: <AccountNotes /> },
    { tabName: "Promise To Pay", component: <AccountPromiseToPay /> },
    { tabName: "Insurance", component: <AccountInsurance /> },
];

const transformTabName = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const AccountsForm = observer((): ReactElement => {
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = useToast();
    const location = useLocation();
    const store = useStore().accountStore;
    const {
        getAccount,
        isAccountChanged,
        accountNote,
        getNotes,
        account: { accountnumber, accountstatus },
        isLoading,
    } = store;
    const [activeTab, setActiveTab] = useState<number>(0);

    useEffect(() => {
        store.prevPath = `${location.pathname}${location.search}`;
    }, [location.pathname, location.search, store]);

    useEffect(() => {
        id &&
            getAccount(id).then((response) => {
                if (response?.status === Status.ERROR) {
                    toast.current?.show({
                        severity: "error",
                        summary: Status.ERROR,
                        detail: (response?.error as string) || "",
                        life: TOAST_LIFETIME,
                    });
                    navigate(`/dashboard/accounts`);
                } else {
                    getNotes(id);
                }
            });
        return () => {
            accountNote.note = "";
            accountNote.alert = "";
        };
    }, [id]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get("tab");
        const tabIndex = tab
            ? tabItems.findIndex((item) => transformTabName(item.tabName) === tab)
            : 0;
        setActiveTab(tabIndex >= 0 ? tabIndex : 0);
    }, [location.search]);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        const tabName = transformTabName(tabItems[index].tabName);
        const queryParams = new URLSearchParams(location.search);
        queryParams.set("tab", tabName);
        navigate(`/dashboard/accounts/${id}?${queryParams.toString()}`, { replace: true });
    };

    return isLoading ? (
        <Loader overlay />
    ) : (
        <div className='grid relative'>
            <Button
                icon='pi pi-times'
                className='p-button close-button'
                onClick={() => navigate("/dashboard/accounts")}
            />
            <div className='col-12'>
                <div className='card account'>
                    <div className='card-header flex'>
                        <h2 className='card-header__title uppercase m-0'>Edit account</h2>
                        {id && (
                            <div className='card-header-info'>
                                Account Number
                                <span className='card-header-info__data'>{accountnumber}</span>
                                Status
                                <span className='card-header-info__data uppercase'>
                                    {accountstatus}
                                </span>
                                Overdue Status
                                <span className='card-header-info__data'>54</span>
                                {(accountNote.alert || accountNote.note) && <NoticeAlert />}
                            </div>
                        )}
                    </div>
                    <div className='card-content account__card grid'>
                        <div className='col-12'>
                            <TabView
                                className='account__tabs'
                                activeIndex={activeTab}
                                onTabChange={(e) => handleTabChange(e.index)}
                                panelContainerClassName='card-content__wrapper'
                            >
                                {tabItems.map(({ tabName, component }) => {
                                    return (
                                        <TabPanel
                                            header={tabName}
                                            key={tabName}
                                            className='account__panel h-full'
                                        >
                                            {component}
                                        </TabPanel>
                                    );
                                })}
                            </TabView>
                        </div>
                    </div>
                    <div className='account__footer gap-3 ml-auto mr-3'>
                        <Button
                            className='uppercase px-6 account__button'
                            onClick={() => handleTabChange(activeTab - 1)}
                            disabled={activeTab <= 0}
                            outlined
                            severity={activeTab <= 0 ? "secondary" : "success"}
                        >
                            Back
                        </Button>
                        <Button
                            className='uppercase px-6 account__button'
                            onClick={() => handleTabChange(activeTab + 1)}
                            disabled={activeTab === tabItems.length - 1}
                            outlined
                        >
                            Next
                        </Button>
                        <Button
                            disabled={!isAccountChanged}
                            severity={isAccountChanged ? "success" : "secondary"}
                            className='uppercase px-6 account__button'
                        >
                            Update
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});
