import { DialogProps } from "primereact/dialog";
import "./index.css";
import { DashboardDialog } from "dashboard/common/dialog";
import { Task } from "common/models/tasks";

interface TaskSummaryDialogProps extends DialogProps {
    currentTask?: Task;
}

const TaskSummaryRow = ({ title, value }: { title: string; value: string }): JSX.Element => (
    <div className='task-summary__row'>
        <div className='task-summary__row-title'>{title}</div>
        <div className='task-summary__row-value white-space-nowrap overflow-hidden text-overflow-ellipsis'>
            {value}
        </div>
    </div>
);

export const TaskSummaryDialog = ({
    visible,
    onHide,
    header,
    currentTask,
}: TaskSummaryDialogProps) => {
    return (
        <DashboardDialog
            onHide={onHide}
            visible={visible}
            header={header}
            className={"dialog__task-summary task-summary"}
        >
            <div className='task-summary__body flex flex-column'>
                <TaskSummaryRow title='Assigned to:' value={currentTask?.username || ""} />
                <TaskSummaryRow title='Start date:' value={currentTask?.startdate || ""} />
                <TaskSummaryRow title='Due date:' value={currentTask?.deadline || ""} />
                <TaskSummaryRow title='Account:' value={currentTask?.accountname || ""} />
                <TaskSummaryRow title='Deal:' value={currentTask?.dealname || ""} />
                <TaskSummaryRow title='Contact:' value={currentTask?.contactname || ""} />
                <TaskSummaryRow title='Phone number:' value={currentTask?.phone || ""} />
                <TaskSummaryRow title='Description:' value={currentTask?.description || ""} />
            </div>
        </DashboardDialog>
    );
};
