import { DialogProps } from "primereact/dialog";
import { useEffect, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { createTask, getTasksSubUserList } from "http/services/tasks.service";
import { DashboardDialog } from "dashboard/common/dialog";
import { useToast } from "dashboard/common/toast";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { DateInput } from "dashboard/common/form/inputs";
import { InputMask } from "primereact/inputmask";
import { useStore } from "store/hooks";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { DealSearch } from "dashboard/deals/common/deal-search";
import { AccountSearch } from "dashboard/accounts/common/account-search";
import { PostDataTask, Task, TaskUser } from "common/models/tasks";
import { formatDateForServer, parseDateFromServer } from "common/helpers";
import "./index.css";
import { observer } from "mobx-react-lite";
import { ContactUser } from "common/models/contact";
import { Deal } from "common/models/deals";
import { Account } from "common/models/accounts";
import { useDateRange } from "common/hooks";
import { ComboBox } from "dashboard/common/form/dropdown";
enum DATE_TYPE {
    START = "startdate",
    DEADLINE = "deadline",
}

interface AddTaskDialogProps extends DialogProps {
    currentTask?: Task;
    onAction?: () => void;
}

const initializeTaskState = (task?: Task): Partial<PostDataTask> => ({
    startdate: task?.startdate ? String(parseDateFromServer(task.startdate)) : "",
    deadline: task?.deadline ? String(parseDateFromServer(task.deadline)) : "",
    useruid: task?.useruid || "",
    accountuid: task?.accountuid || "",
    accountname: task?.accountname || "",
    dealuid: task?.dealuid || "",
    dealname: task?.dealname || "",
    contactuid: task?.contactuid || "",
    contactname: task?.contactname || "",
    phone: task?.phone || "",
    description: task?.description || "",
});

export const AddTaskDialog = observer(
    ({ visible, onHide, header, currentTask, onAction }: AddTaskDialogProps) => {
        const userStore = useStore().userStore;
        const { authUser } = userStore;
        const toast = useToast();
        const [taskState, setTaskState] = useState<Partial<PostDataTask>>(initializeTaskState());
        const [assignToData, setAssignToData] = useState<TaskUser[] | null>(null);
        const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
        const [isSaving, setIsSaving] = useState<boolean>(false);
        const { startDate, endDate, handleDateChange } = useDateRange();

        const isSubmitDisabled = !taskState.description?.trim() || !isFormChanged || isSaving;

        const handleGetTasksSubUserList = async () => {
            const response = await getTasksSubUserList(authUser!.useruid);
            if (response && Array.isArray(response)) setAssignToData(response);
            setTaskState(initializeTaskState(currentTask));
        };

        useEffect(() => {
            if (authUser && visible) {
                handleGetTasksSubUserList();
            }
        }, [visible, currentTask]);

        useEffect(() => {
            if (!visible) {
                setTaskState(initializeTaskState());
                setIsFormChanged(false);
                setAssignToData(null);
            }
        }, [visible]);

        useEffect(() => {
            if (startDate) {
                setTaskState((prev) => ({
                    ...prev,
                    [DATE_TYPE.START]: String(startDate),
                }));
                setIsFormChanged(true);
            }
        }, [startDate]);

        useEffect(() => {
            if (endDate) {
                setTaskState((prev) => ({
                    ...prev,
                    [DATE_TYPE.DEADLINE]: String(endDate),
                }));
                setIsFormChanged(true);
            }
        }, [endDate]);

        const handleInputChange = (key: keyof PostDataTask, value: string) => {
            setTaskState((prev) => ({ ...prev, [key]: value }));
            setIsFormChanged(true);
        };

        const handleSaveTaskData = async () => {
            setIsSaving(true);

            const taskDataToSave = {
                ...taskState,
                startdate: formatDateForServer(Number(taskState.startdate)),
                deadline: formatDateForServer(Number(taskState.deadline)),
            };
            if (taskDataToSave.contactuid) {
                delete taskDataToSave.contactname;
            }

            const response = await createTask(taskDataToSave, currentTask?.itemuid);

            if (response?.status === Status.ERROR) {
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
                    detail: `Task ${currentTask ? "updated" : "created"} successfully!`,
                    life: TOAST_LIFETIME,
                });
                onHide();
                onAction?.();
            }

            setIsSaving(false);
        };

        const handleGetAccountInfo = (account: Account) => {
            handleInputChange("accountuid", account.accountuid);
            handleInputChange("accountname", account.name);
        };

        const handleGetContactInfo = (contact: ContactUser) => {
            handleInputChange("contactuid", contact.contactuid);
            handleInputChange(
                "contactname",
                contact.companyName ||
                    `${contact.firstName} ${contact.lastName}`.trim() ||
                    contact.userName
            );
        };

        const handleGetDealInfo = (deal: Deal) => {
            handleInputChange("dealuid", deal.dealuid);
            handleInputChange("dealname", deal.contactinfo);
        };

        return (
            <DashboardDialog
                position='top'
                onHide={onHide}
                visible={visible}
                header={header}
                className={"dialog__add-task"}
                footer='Save'
                action={handleSaveTaskData}
                buttonDisabled={isSubmitDisabled}
            >
                <ComboBox
                    value={taskState.useruid || ""}
                    options={assignToData || []}
                    optionLabel='username'
                    optionValue='useruid'
                    className='flex align-items-center'
                    onChange={(e) => handleInputChange("useruid", e.value)}
                    label='Assign to'
                />

                <div className='flex flex-column md:flex-row column-gap-3 relative'>
                    <div className='p-inputgroup'>
                        <DateInput
                            emptyDate
                            date={Number(taskState.startdate)}
                            name='Start Date'
                            showTime
                            hourFormat='12'
                            onChange={({ value }) => handleDateChange(Number(value), true)}
                        />
                    </div>
                    <div className='p-inputgroup'>
                        <DateInput
                            emptyDate
                            date={Number(taskState.deadline)}
                            name='Due Date'
                            showTime
                            hourFormat='12'
                            minDate={
                                Number(taskState.startdate)
                                    ? new Date(Number(taskState.startdate))
                                    : undefined
                            }
                            onChange={({ value }) => handleDateChange(Number(value), false)}
                        />
                    </div>
                </div>

                <AccountSearch
                    value={taskState.accountname || ""}
                    onChange={(e) => {
                        handleInputChange("accountuid", "");
                        handleInputChange("accountname", e.target.value);
                    }}
                    onRowClick={(value) => handleInputChange("accountname", value)}
                    getFullInfo={handleGetAccountInfo}
                    name='Account (optional)'
                />

                <DealSearch
                    value={taskState.dealname || ""}
                    onChange={(e) => {
                        handleInputChange("dealuid", "");
                        handleInputChange("dealname", e.target.value);
                    }}
                    onRowClick={(value) => handleInputChange("dealname", value)}
                    getFullInfo={handleGetDealInfo}
                    name='Deal (optional)'
                />

                <CompanySearch
                    value={taskState.contactname || ""}
                    onChange={(e) => {
                        handleInputChange("contactuid", "");
                        handleInputChange("contactname", e.target.value);
                    }}
                    onRowClick={(value) => handleInputChange("contactname", value)}
                    getFullInfo={handleGetContactInfo}
                    name='Contact'
                />
                <span className='p-float-label'>
                    <InputMask
                        type='tel'
                        mask='999-999-9999'
                        value={taskState.phone || ""}
                        className='w-full'
                        onChange={(e) => handleInputChange("phone", e.target?.value || "")}
                    />
                    <label className='float-label'>Phone Number (optional)</label>
                </span>
                <span className='p-float-label'>
                    <InputTextarea
                        required
                        value={taskState.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className='p-dialog-description w-full'
                    />
                    <label className='float-label'>Description (required)</label>
                </span>
            </DashboardDialog>
        );
    }
);
