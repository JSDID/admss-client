import { Task, TaskStatus } from "common/models/tasks";
import { FilterOptions } from "dashboard/common/filter";
import { Chip } from "primereact/chip";
import { ColumnProps } from "primereact/column";

export interface TableColumnProps extends ColumnProps {
    field: keyof Task;
}

type TableColumnsListExtend = { checked?: boolean; isSelectable?: boolean };

export type TableColumnsList = Pick<TableColumnProps, "header" | "field"> & TableColumnsListExtend;

export const tasksFilterOptions: FilterOptions[] = [
    { label: "Default", value: "default", column: "status" },
    { label: "Started", value: "started", column: "status" },
    { label: "In Progress", value: "inProgress", column: "status" },
    { label: "Cancelled", value: "cancelled", column: "status" },
    { label: "Postponed", value: "postponed", column: "status" },
    { label: "Paused", value: "paused", column: "status" },
    { label: "Completed", value: "completed", column: "status" },
    { label: "Outdated", value: "outdated", column: "status" },
    { label: "Deleted", value: "deleted", column: "status" },
];

export const renderTaskStatus = (task_status: TaskStatus) => {
    switch (task_status) {
        case TaskStatus.IN_PROGRESS:
            return (
                <Chip
                    label={TaskStatus.IN_PROGRESS}
                    className='tasks-widget__chip task-status--in-progress'
                />
            );
        case TaskStatus.PAUSED:
            return (
                <Chip
                    label={TaskStatus.PAUSED}
                    className='tasks-widget__chip task-status--paused'
                />
            );
        case TaskStatus.POSTPONED:
            return (
                <Chip
                    label={TaskStatus.POSTPONED}
                    className='tasks-widget__chip task-status--postponed'
                />
            );
        case TaskStatus.STARTED:
            return (
                <Chip
                    label={TaskStatus.STARTED}
                    className='tasks-widget__chip task-status--started'
                />
            );
        case TaskStatus.COMPLETED:
            return (
                <Chip
                    label={TaskStatus.COMPLETED}
                    className='tasks-widget__chip task-status--completed'
                />
            );
        case TaskStatus.CANCELLED:
            return (
                <Chip
                    label={TaskStatus.CANCELLED}
                    className='tasks-widget__chip task-status--cancelled'
                />
            );
        case TaskStatus.OUTDATED:
            return (
                <Chip
                    label={TaskStatus.OUTDATED}
                    className='tasks-widget__chip task-status--outdated'
                />
            );
        case TaskStatus.DELETED:
            return (
                <Chip
                    label={TaskStatus.DELETED}
                    className='tasks-widget__chip task-status--deleted'
                />
            );
        default:
            return (
                <Chip
                    label={TaskStatus.DEFAULT}
                    className='tasks-widget__chip task-status--default'
                />
            );
    }
};
