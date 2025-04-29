import { AccountHistory } from "common/models/accounts";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { DashboardDialog, DashboardDialogProps } from "dashboard/common/dialog";
import { TextInput } from "dashboard/common/form/inputs";
import { useToast } from "dashboard/common/toast";
import { setOrUpdateHistoryInfo } from "http/services/accounts.service";
import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { useStore } from "store/hooks";

interface AddNoteDialogProps extends DashboardDialogProps {
    visible: boolean;
    accountuid?: string;
    action: () => void;
    onHide: () => void;
    payments: AccountHistory[];
}

export const AddPaymentNoteDialog = ({
    visible,
    onHide,
    action,
    accountuid,
    payments,
    ...props
}: AddNoteDialogProps): ReactElement => {
    const toast = useToast();
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [noteTaker, setNoteTaker] = useState<string>(authUser?.loginname || "");
    const [note, setNote] = useState<string>(payments[0]?.Comment || "");
    const currentTime = useMemo(
        () => `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        []
    );

    useEffect(() => {
        if (noteTaker && note) {
            setIsButtonDisabled(false);
        }
    }, [note, noteTaker]);

    const handleAddNote = () => {
        payments.forEach((payment) => {
            accountuid &&
                setOrUpdateHistoryInfo(accountuid, {
                    ...payment,
                    Comment: note,
                }).then((res) => {
                    if (res && res.status === Status.ERROR) {
                        toast.current?.show({
                            severity: "error",
                            summary: Status.ERROR,
                            detail: res.error,
                            life: TOAST_LIFETIME,
                        });
                    } else {
                        toast.current?.show({
                            severity: "success",
                            summary: "Success",
                            detail: "Note added successfully",
                            life: TOAST_LIFETIME,
                        });
                        setNote("");
                        action();
                        onHide();
                    }
                });
        });
    };

    return (
        <DashboardDialog
            className='add-note'
            footer='Save'
            header='Add Note'
            cancelButton
            visible={visible}
            onHide={onHide}
            action={handleAddNote}
            buttonDisabled={isButtonDisabled}
            {...props}
        >
            <div className='grid gap-3'>
                <div className='add-note__info m-3'>
                    <strong>Date & Time: </strong>
                    <span className='add-note__time'>{currentTime}</span>
                </div>
                <TextInput
                    colWidth={12}
                    name='Note Taker'
                    value={noteTaker}
                    onChange={({ target: { value } }) => setNoteTaker(value)}
                />

                <div className='col-12'>
                    <span className='p-float-label'>
                        <InputTextarea
                            className='w-full account-note__textarea'
                            value={note}
                            onChange={({ target: { value } }) => setNote(value)}
                        />
                        <label className='float-label'>Note</label>
                    </span>
                </div>
            </div>
        </DashboardDialog>
    );
};
