import { ReactElement } from "react";
import { InfoSection } from "./info-section";
import "./index.css";
import { Button } from "primereact/button";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { AppColors } from "common/models/css-variables";
import { AccountTakePaymentTabs } from "dashboard/accounts/take-payment-form";
import { formatPhoneNumber } from "common/helpers";

export const AccountInformation = observer((): ReactElement => {
    const store = useStore().accountStore;
    const {
        account: { startingballance },
        accountExtData: {
            APR,
            Term,
            Curr_Due,
            buyerName,
            buyerWorkPhone,
            buyerMobile,
            cobuyerName,
            Principal_Paid,
            Interest_Paid,
            Total_Paid,
            Total_Adjustments,
            Balance,
            Con_Amt_To_Finance,
            Con_Pmt_Amt,
            dateeffective,
            Down_Pmt_Balance,
            Fees,
            Next_Pmt_Due,
            DaysOverdue,
            Last_Paid,
            Last_Paid_Date,
        },
    } = store;
    const navigate = useNavigate();

    return (
        <div className='account-info'>
            <h3 className='account-info__title account-title'>Account Information</h3>
            <div className='account-details grid'>
                <div className='col-6'>
                    <InfoSection
                        sectionTitle='Contact Information'
                        info={[
                            { title: "Full Name", value: buyerName || "" },
                            { title: "Work Phone", value: formatPhoneNumber(buyerWorkPhone || "") },
                            { title: "Mobile", value: formatPhoneNumber(buyerMobile || "") },
                            { title: "Co-Buyer", value: cobuyerName || "" },
                        ]}
                    />

                    <InfoSection
                        sectionTitle='Selling Dealer'
                        info={[
                            { title: "Full Name", value: "Selling Dealer Name" },
                            { title: "Address", value: "0540 Marquardt Meadows, Tallahassee" },
                        ]}
                    />
                    <InfoSection
                        sectionTitle='Account Balance'
                        info={[
                            { title: "Starting Balance", value: `$ ${startingballance || "0.00"}` },
                            {
                                title: "Principal Paid",
                                value: `$ ${Principal_Paid?.toFixed(2) || "0.00"}`,
                            },
                            {
                                title: "Interest Paid",
                                value: `$ ${Interest_Paid?.toFixed(2) || "0.00"}`,
                            },
                            { title: "Total Paid", value: `$ ${Total_Paid?.toFixed(2) || "0.00"}` },
                            {
                                title: "Total Adjustments",
                                value: `$ ${Total_Adjustments?.toFixed(2) || "0.00"}`,
                            },
                            {
                                title: "Current Balance",
                                value: `$ ${Balance?.toFixed(2) || "0.00"}`,
                            },
                        ]}
                    />
                </div>
                <div className='col-6'>
                    <InfoSection
                        sectionTitle='Contact Values'
                        info={[
                            {
                                title: "Atm Financed",
                                value: `$ ${Con_Amt_To_Finance?.toFixed(2) || "0.00"}`,
                            },
                            { title: "APR (%)", value: `${APR?.toFixed(2) || "0.00"} %` },
                            { title: "Term", value: `${Term || "0"} months` },
                            {
                                title: "Payment Amount",
                                value: `$ ${Con_Pmt_Amt?.toFixed(2) || "0.00"}`,
                            },
                            { title: "Deal's Date", value: dateeffective || "" },
                        ]}
                    />
                    <InfoSection
                        sectionTitle='Account Standing'
                        info={[
                            { title: "Current Due", value: `$ ${Curr_Due || "0.00"}` },
                            { title: "Down Pmt Balance", value: `$ ${Down_Pmt_Balance || "0.00"}` },
                            { title: "Fees", value: `$ ${Fees || "0.00"}` },
                            { title: "Due Date", value: Next_Pmt_Due || "" },
                            {
                                title: "Days Overdue",
                                value: DaysOverdue || "0",
                                valueColor: AppColors.RED,
                                valueClass: "font-bold",
                            },
                            { title: "Last Paid", value: `$ ${Last_Paid || "0.00"}` },
                            {
                                title: "Last Paid Date",
                                value: Last_Paid_Date || "0",
                                valueClass: "font-bold",
                            },
                        ]}
                    />
                    <Button
                        className='account-info__button'
                        onClick={() =>
                            navigate(`take-payment?tab=${AccountTakePaymentTabs.PAY_OFF}`)
                        }
                        outlined
                    >
                        Calculate Payoff
                    </Button>
                </div>
            </div>
        </div>
    );
});
