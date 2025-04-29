import { ACCOUNT_NOTE_CONTACT_TYPE } from "common/constants/account-options";
import { AccountNote } from "common/models/accounts";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { DashboardDialog } from "dashboard/common/dialog";
import { ComboBox } from "dashboard/common/form/dropdown";
import { TextInput } from "dashboard/common/form/inputs";
import { useToast } from "dashboard/common/toast";
import { addAccountNote } from "http/services/accounts.service";
import { DialogProps } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { useStore } from "store/hooks";

interface AddNoteDialogProps extends DialogProps {
    visible: boolean;
    accountuid?: string;
    action: () => void;
    onHide: () => void;
    currentNote?: AccountNote | null;
}

export const AddNoteDialog = ({
    visible,
    onHide,
    action,
    accountuid,
    currentNote,
    ...props
}: AddNoteDialogProps): ReactElement => {
    const toast = useToast();
    const store = useStore().accountStore;
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [noteTaker, setNoteTaker] = useState<string>(authUser!.loginname);
    const [contactType, setContactType] = useState(ACCOUNT_NOTE_CONTACT_TYPE[0]);
    const [note, setNote] = useState<string>("");
    const currentTime = useMemo(
        () => `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        []
    );

    useEffect(() => {
        if (visible) {
            if (currentNote) {
                setNoteTaker(currentNote.NoteBy);
                setContactType(currentNote.ContactMethod);
                setNote(currentNote.Note);
            } else {
                setNoteTaker(authUser?.loginname || "");
                setContactType(ACCOUNT_NOTE_CONTACT_TYPE[0]);
                setNote("");
            }
            setIsButtonDisabled(true);
        }
    }, [visible, currentNote, authUser?.loginname]);

    useEffect(() => {
        if (noteTaker && contactType && note) {
            setIsButtonDisabled(false);
        }
    }, [contactType, note, noteTaker]);

    const handleAddNote = async () => {
        const payload: Partial<AccountNote> = {
            NoteBy: noteTaker,
            Note: note,
            ContactMethod: contactType,
        };
        if (currentNote?.itemuid) {
            payload.itemuid = currentNote.itemuid;
        }
        const response = await addAccountNote(accountuid!, payload);
        if (response && response.status === Status.ERROR) {
            toast.current?.show({
                severity: "error",
                summary: Status.ERROR,
                detail: response.error,
                life: TOAST_LIFETIME,
            });
        } else {
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Note added successfully",
                life: TOAST_LIFETIME,
            });
            setContactType(ACCOUNT_NOTE_CONTACT_TYPE[0]);
            setIsButtonDisabled(true);
            store.isAccountChanged = true;
            setNote("");
            action();
            onHide();
        }
    };

    return (
        <DashboardDialog
            className='add-note'
            footer={currentNote ? "Update" : "Save"}
            header={currentNote ? "Edit Note" : "Add Note"}
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
                    <ComboBox
                        options={[...ACCOUNT_NOTE_CONTACT_TYPE]}
                        value={contactType}
                        onChange={(e) => setContactType(e.value)}
                        className='w-full'
                        label='Contact Type'
                    />
                </div>
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
