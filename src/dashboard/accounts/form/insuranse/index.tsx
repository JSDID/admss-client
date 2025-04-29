import { TabView, TabPanel } from "primereact/tabview";
import { ReactElement } from "react";
import { AccountInsuranceHistory } from "./insurance-history";
import { AccountInsuranceInfo } from "./insurance-info";
import "./index.css";

export const AccountInsurance = (): ReactElement => (
    <div className='account-insurance'>
        <div className='grid'>
            <div className='col-12'>
                <TabView className='account-insurance__tabs'>
                    <TabPanel header='Insurance'>
                        <AccountInsuranceInfo />
                    </TabPanel>
                    <TabPanel header='Insurance history'>
                        <AccountInsuranceHistory />
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </div>
);
