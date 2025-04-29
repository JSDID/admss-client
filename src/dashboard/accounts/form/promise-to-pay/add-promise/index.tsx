import { TypeList } from "common/models";
import { AccountPromise } from "common/models/accounts";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { DashboardDialog, DashboardDialogProps } from "dashboard/common/dialog";
import { ComboBox } from "dashboard/common/form/dropdown";
import { CurrencyInput, DateInput, TextInput } from "dashboard/common/form/inputs";
import { useToast } from "dashboard/common/toast";
import { addAccountPromise } from "http/services/accounts.service";
import { observer } from "mobx-react-lite";
import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement, useEffect, useState } from "react";
import { useStore } from "store/hooks";

interface AddPromiseDialogProps extends DashboardDialogProps {
    visible: boolean;
    accountuid?: string;
    currentPromise?: AccountPromise | null;
    statusList: TypeList[];
    action: () => void;
    onHide: () => void;
}

type PromiseData = Partial<AccountPromise>;

const initialPromiseData: PromiseData = {
    username: "",
    notes: "",
    amount: 0,
    paydate: 0,
    pstatus: 0,
};

export const AddPromiseDialog = observer(
    ({
        visible,
        onHide,
        action,
        accountuid,
        statusList,
        currentPromise,
        ...props
    }: AddPromiseDialogProps): ReactElement => {
        const userStore = useStore().userStore;
        const { authUser } = userStore;
        const toast = useToast();

        const [promiseData, setPromiseData] = useState<PromiseData>({
            ...initialPromiseData,
        });
        const [isButtonDisabled, setIsButtonDisabled] = useState(true);

        const currentTime = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

        const handleChange = <K extends keyof PromiseData>(key: K, value: PromiseData[K]) => {
            setPromiseData((prev) => ({ ...prev, [key]: value }));
        };

        useEffect(() => {
            if (currentPromise) {
                const { username, notes, amount, paydate, pstatus } = currentPromise;
                setPromiseData({
                    username,
                    notes,
                    amount,
                    paydate,
                    pstatus,
                });
            } else {
                setPromiseData({
                    ...initialPromiseData,
                    username: authUser?.loginname || "",
                });
            }
        }, [currentPromise, authUser?.loginname]);

        useEffect(() => {
            setIsButtonDisabled(!promiseData.username || !promiseData.notes);
        }, [promiseData.username, promiseData.notes]);

        const handleAddPromise = async () => {
            if (!accountuid) return;

            const payload: Partial<AccountPromise> = {
                username: promiseData.username,
                amount: promiseData.amount,
                paydate: promiseData.paydate,
                pstatus: promiseData.pstatus,
                notes: promiseData.notes,
                ...(currentPromise?.itemuid && { itemuid: currentPromise.itemuid }),
            };

            const res = await addAccountPromise(accountuid, payload);
            if (res?.status === Status.ERROR) {
                return toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: res.error,
                    life: TOAST_LIFETIME,
                });
            }

            action();
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Promise added successfully!",
                life: TOAST_LIFETIME,
            });
            setPromiseData({
                ...initialPromiseData,
                username: authUser?.loginname || "",
            });
            onHide();
        };

        const handleOnClose = () => {
            setPromiseData({
                ...initialPromiseData,
                username: currentPromise?.username || authUser?.loginname || "",
            });
            onHide();
        };

        return (
            <DashboardDialog
                className='add-promise'
                footer='Save'
                header='Add Promise'
                cancelButton
                visible={visible}
                onHide={handleOnClose}
                action={handleAddPromise}
                buttonDisabled={isButtonDisabled}
                {...props}
            >
                <div className='grid row-gap-2'>
                    <div className='add-note__info m-3'>
                        <strong>Date & Time: </strong>
                        <span className='add-note__time'>{currentTime}</span>
                    </div>
                    <TextInput
                        colWidth={12}
                        name='Note Taker'
                        value={promiseData.username}
                        onChange={({ target: { value } }) => handleChange("username", value)}
                    />
                    <div className='col-6'>
                        <DateInput
                            name='Promise to Pay Date'
                            date={
                                typeof promiseData.paydate === "number"
                                    ? promiseData.paydate
                                    : new Date(String(promiseData.paydate)).getTime()
                            }
                            emptyDate
                            onChange={({ target: { value } }) => {
                                return handleChange("paydate", Number(value));
                            }}
                        />
                    </div>
                    <div className='col-6'>
                        <CurrencyInput
                            title='Amount'
                            labelPosition='top'
                            value={promiseData.amount}
                            onChange={({ value }) => handleChange("amount", Number(value))}
                        />
                    </div>
                    <div className='col-12'>
                        <span className='p-float-label'>
                            <InputTextarea
                                className='w-full add-promise__textarea'
                                value={promiseData.notes}
                                onChange={({ target: { value } }) => handleChange("notes", value)}
                            />
                            <label className='float-label'>Note</label>
                        </span>
                    </div>
                    <div className='col-12'>
                        <ComboBox
                            id='noteTaker'
                            value={promiseData.pstatus}
                            optionLabel='name'
                            optionValue='id'
                            onChange={(e) => {
                                return handleChange("pstatus", e.value);
                            }}
                            label='Status'
                            className='w-full'
                            options={[...statusList]}
                        />
                    </div>
                </div>
            </DashboardDialog>
        );
    }
);
