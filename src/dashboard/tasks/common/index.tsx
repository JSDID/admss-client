import { Task, TaskStatus } from "common/models/tasks";
import { FilterOptions } from "dashboard/common/filter";
import { Chip } from "primereact/chip";
import { ColumnProps } from "primereact/column";

export interface TableColumnProps extends ColumnProps {
    field: keyof Task;
}

type TableColumnsListExtend = { checked?: boolean; isSelectable?: boolean };

export type TableColumnsList = Pick<TableColumnProps, "header" | "field"> & TableColumnsListExtend;

interface TasksFilterOptions {
    name: string;
    value: string;
    code: number;
}

export const TASKS_STATUS_LIST: TasksFilterOptions[] = [
    { name: TaskStatus.DEFAULT, value: "0.status", code: 0 },
    { name: TaskStatus.STARTED, value: "1.status", code: 1 },
    { name: TaskStatus.IN_PROGRESS, value: "2.status", code: 2 },
    { name: TaskStatus.CANCELLED, value: "3.status", code: 3 },
    { name: TaskStatus.POSTPONED, value: "4.status", code: 4 },
    { name: TaskStatus.PAUSED, value: "5.status", code: 5 },
    { name: TaskStatus.COMPLETED, value: "6.status", code: 6 },
    { name: TaskStatus.OUTDATED, value: "7.status", code: 7 },
    { name: TaskStatus.DELETED, value: "8.status", code: 8 },
];

export const tasksFilterOptions: FilterOptions[] = [
    { label: TaskStatus.DEFAULT, value: "default", column: "status" },
    { label: TaskStatus.STARTED, value: "started", column: "status" },
    { label: TaskStatus.IN_PROGRESS, value: "inProgress", column: "status" },
    { label: TaskStatus.CANCELLED, value: "cancelled", column: "status" },
    { label: TaskStatus.POSTPONED, value: "postponed", column: "status" },
    { label: TaskStatus.PAUSED, value: "paused", column: "status" },
    { label: TaskStatus.COMPLETED, value: "completed", column: "status" },
    { label: TaskStatus.OUTDATED, value: "outdated", column: "status" },
    { label: TaskStatus.DELETED, value: "deleted", column: "status" },
];

const statusClassNames = TASKS_STATUS_LIST.reduce(
    (acc, { code, name }) => ({
        ...acc,
        [code]: name.toLowerCase().replace(" ", "-"),
    }),
    {} as Record<number, string>
);

export const renderTaskStatus = (statuscode: number) => {
    const currentTaskClassName = statusClassNames[statuscode] || TaskStatus.DEFAULT.toLowerCase();
    const label = TASKS_STATUS_LIST.find((s) => s.code === statuscode)?.name || TaskStatus.DEFAULT;
    return (
        <Chip label={label} className={`tasks-widget__chip task-status--${currentTaskClassName}`} />
    );
};
