import { ReactElement, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { InfoSection } from "dashboard/accounts/form/information/info-section";
import { useStore } from "store/hooks";
import { AccountNoteData } from "store/stores/account";
import { Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { updateAccountNote } from "http/services/accounts.service";
import { useLocation, useParams } from "react-router-dom";
import { TOAST_LIFETIME } from "common/settings";
import { AppColors } from "common/models/css-variables";
import { NoteEditor } from "dashboard/accounts/form/common";

export const TakePaymentInfo = observer((): ReactElement => {
    const { id } = useParams();
    const store = useStore().accountStore;
    const {
        accountNote,
        getNotes,
        accountPaymentsInfo: { CurrentStatus, CollectionDetails },
    } = store;
    const toast = useToast();
    const location = useLocation();

    useEffect(() => {
        if (id) {
            getNotes(id);
        }
    }, [id, location.pathname]);

    const handleSaveNote = (saveItem: keyof AccountNoteData, value: string) => {
        id &&
            updateAccountNote(id, { [saveItem]: value }).then((res) => {
                if (res?.status === Status.ERROR) {
                    toast.current?.show({
                        severity: "error",
                        summary: Status.ERROR,
                        detail: res.error,
                        life: TOAST_LIFETIME,
                    });
                }
            });
    };

    return (
        <div className='take-payment__info'>
            <InfoSection
                sectionTitle='Current Status'
                info={[
                    {
                        title: "Past Due Amt",
                        titleColor: AppColors.PRIMARY,
                        value: `$ ${CurrentStatus?.PastDueAmount || "0.00"}`,
                    },
                    {
                        title: "Current Due",
                        titleColor: AppColors.PRIMARY,
                        value: `$ ${CurrentStatus?.CurrentDue || "0.00"}`,
                    },
                    {
                        title: "Down/Pickup Due",
                        titleColor: AppColors.PRIMARY,
                        value: `$ ${CurrentStatus?.DownPickupDue || "0.00"}`,
                    },
                    {
                        title: "Fees",
                        titleColor: AppColors.PRIMARY,
                        value: `$ ${CurrentStatus?.Fees || "0.00"}`,
                    },
                    {
                        title: "Total Due",
                        titleColor: AppColors.PRIMARY,
                        value: `$ ${CurrentStatus?.TotalDue || "0.00"}`,
                    },
                    {
                        title: "Current Balance",
                        titleColor: AppColors.PRIMARY,
                        value: `$ ${CurrentStatus?.CurrentBalance || "0.00"}`,
                    },
                ]}
            />

            <InfoSection
                sectionTitle='Collection Details'
                info={[
                    {
                        title: "Regular Pmt",
                        titleColor: AppColors.PRIMARY,
                        value: `$ ${CollectionDetails?.RegularPayment || "0.00"}`,
                    },
                    {
                        title: "Next Pmt. due",
                        titleColor: AppColors.PRIMARY,
                        value: `${CollectionDetails?.NextPmtDue || "0.00"}`,
                    },
                    {
                        title: "Days Overdue",
                        titleColor: AppColors.PRIMARY,
                        valueColor: AppColors.RED,
                        valueClass: "font-bold",
                        value: `${CollectionDetails?.DaysOverdue || "0"}`,
                    },
                    {
                        title: "Last Paid",
                        titleColor: AppColors.PRIMARY,
                        value: `${CollectionDetails?.LastPaid || "Never"}`,
                    },
                    {
                        title: "Last Paid Days",
                        titleColor: AppColors.PRIMARY,
                        value: `${CollectionDetails?.LastPaidDays || "n/a"}`,
                    },
                    {
                        title: "Last Late",
                        titleColor: AppColors.PRIMARY,
                        value: `${CollectionDetails?.LastLate || "Never"}`,
                    },
                ]}
            />

            <NoteEditor
                id='account-memo'
                value={accountNote.note}
                label='Account Memo'
                onSave={() => handleSaveNote("note", accountNote.note)}
                onClear={() => {
                    store.accountNote = { ...accountNote, note: "" };
                    handleSaveNote("note", "");
                }}
                onChange={(value) => (store.accountNote = { ...accountNote, note: value })}
            />
            <NoteEditor
                id='account-payment'
                value={accountNote.alert}
                className='mt-4'
                label='Payment Alert'
                onSave={() => handleSaveNote("alert", accountNote.alert)}
                onClear={() => {
                    store.accountNote = { ...accountNote, alert: "" };
                    handleSaveNote("alert", "");
                }}
                onChange={(value) => (store.accountNote = { ...accountNote, alert: value })}
            />
        </div>
    );
});
