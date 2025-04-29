import { ReactElement, useEffect, useState } from "react";
import {
    DataTable,
    DataTableColReorderEvent,
    DataTableColumnResizeEndEvent,
    DataTablePageEvent,
    DataTableSortEvent,
} from "primereact/datatable";
import { Button } from "primereact/button";
import { Column, ColumnProps } from "primereact/column";
import { ROWS_PER_PAGE, TOAST_LIFETIME } from "common/settings";
import { store } from "store";
import {
    exportTaskScheduleContinue,
    exportTaskScheduleDelete,
    exportTaskSchedulePause,
    getExportScheduleList,
} from "http/services/export-to-web.service";
import "./index.css";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
import { ExportWebScheduleList } from "common/models/export-web";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";
import { QueryParams } from "common/models/query-params";
import { ExportWebUserSettings, ServerUserSettings, TableState } from "common/models/user";
import { getUserSettings, setUserSettings } from "http/services/auth-user.service";
import { Status } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { ConfirmModal } from "dashboard/common/dialog/confirm";

interface ScheduleColumnProps extends ColumnProps {
    field: keyof ExportWebScheduleList;
}

type ScheduleColumnsList = Pick<ScheduleColumnProps, "header" | "field"> & { checked: boolean };

const scheduleColumns: ScheduleColumnsList[] = [
    { field: "id", header: "#", checked: true },
    { field: "lasttatus", header: "Status", checked: true },
    { field: "created", header: "Created", checked: true },
    { field: "tasktype", header: "Type", checked: true },
    { field: "info", header: "Info", checked: true },
    { field: "lasttrun", header: "Last Run", checked: true },
    { field: "nextrun", header: "Next Run", checked: true },
];

enum ExportWebScheduleAction {
    PAUSE = "pause",
    CONTINUE = "continue",
    DELETE = "delete",
}

export const ExportSchedule = (): ReactElement => {
    const userStore = store.userStore;
    const { authUser } = userStore;
    const [scheduleList, setScheduleList] = useState<ExportWebScheduleList[]>([]);
    const [activeScheduleColumns, setActiveScheduleColumns] =
        useState<ScheduleColumnsList[]>(scheduleColumns);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);
    const [serverSettings, setServerSettings] = useState<ServerUserSettings>();
    const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);
    const [deletedId, setDeletedId] = useState<string | null>(null);
    const toast = useToast();

    const handleGetExportScheduleList = async (params: QueryParams) => {
        if (!authUser) return;
        const [totalResponse, dataResponse] = await Promise.all([
            getExportScheduleList(authUser.useruid, { ...params, total: 1 }),
            getExportScheduleList(authUser.useruid, params),
        ]);

        if (totalResponse && !Array.isArray(totalResponse)) {
            setTotalRecords(totalResponse.total ?? 1);
        }

        if (Array.isArray(dataResponse)) {
            setScheduleList(dataResponse);
        } else {
            setScheduleList([]);
        }
    };

    const pageChanged = (event: DataTablePageEvent) => {
        setLazyState(event);
        changeSettings({ table: event as TableState });
    };

    const sortData = (event: DataTableSortEvent) => {
        setLazyState(event);
        changeSettings({ table: event as TableState });
    };

    const changeSettings = (settings: Partial<ExportWebUserSettings>) => {
        if (!authUser) return;
        const newSettings = {
            ...serverSettings,
            exportSchedule: { ...serverSettings?.exportSchedule, ...settings },
        } as ServerUserSettings;
        setUserSettings(authUser.useruid, newSettings).then((response) => {
            if (response?.status === Status.OK) setServerSettings(newSettings);
        });
    };

    useEffect(() => {
        if (!authUser) return;
        getUserSettings(authUser.useruid).then((response) => {
            if (response?.profile.length) {
                let allSettings: ServerUserSettings = {} as ServerUserSettings;
                if (response.profile) {
                    try {
                        allSettings = JSON.parse(response.profile);
                    } catch (error) {
                        allSettings = {} as ServerUserSettings;
                    }
                }
                setServerSettings(allSettings);
                const { exportSchedule: settings } = allSettings;
                if (settings?.activeColumns?.length) {
                    const uniqueColumns = Array.from(new Set(settings?.activeColumns));
                    const serverColumns = scheduleColumns.filter((column) =>
                        uniqueColumns.find((col) => col === column.field)
                    );
                    setActiveScheduleColumns(serverColumns);
                } else {
                    setActiveScheduleColumns(scheduleColumns.filter(({ checked }) => checked));
                }
                settings?.table &&
                    setLazyState({
                        first: settings.table.first || initialDataTableQueries.first,
                        rows: settings.table.rows || initialDataTableQueries.rows,
                        page: settings.table.page || initialDataTableQueries.page,
                        column: settings.table.column || initialDataTableQueries.column,
                        sortField: settings.table.sortField || initialDataTableQueries.sortField,
                        sortOrder: settings.table.sortOrder || initialDataTableQueries.sortOrder,
                    });
            }
            setSettingsLoaded(true);
        });
    }, [authUser]);

    useEffect(() => {
        if (settingsLoaded) {
            let qry: string = "";

            const params: QueryParams = {
                ...(lazyState.sortOrder === 1 && { type: "asc" }),
                ...(lazyState.sortOrder === -1 && { type: "desc" }),
                ...(lazyState.sortField && { column: lazyState.sortField }),
                qry,
                skip: lazyState.first,
                top: lazyState.rows,
            };

            handleGetExportScheduleList(params);
        }
    }, [lazyState, settingsLoaded]);

    const handleCheckboxChange = () => {
        if (scheduleColumns.length === activeScheduleColumns.length) {
            setActiveScheduleColumns(scheduleColumns.filter(({ checked }) => checked));
            changeSettings({ activeColumns: [] });
        } else {
            setActiveScheduleColumns(scheduleColumns);
            changeSettings({
                activeColumns: scheduleColumns.map(({ field }) => field),
            });
        }
    };

    const handleDropdownHeaderColumnToggle = () => {
        changeSettings({ activeColumns: [] });
        return setActiveScheduleColumns(scheduleColumns.filter(({ checked }) => checked));
    };

    const dropdownHeaderPanel = (
        <div className='dropdown-header flex pb-1'>
            <label className='cursor-pointer dropdown-header__label'>
                <Checkbox
                    checked={scheduleColumns.length === activeScheduleColumns.length}
                    onChange={handleCheckboxChange}
                    className='dropdown-header__checkbox mr-2'
                />
                Select All
            </label>
            <button
                className='p-multiselect-close p-link'
                onClick={handleDropdownHeaderColumnToggle}
            >
                <i className='pi pi-times' />
            </button>
        </div>
    );

    const handleColumnReorder = (event: DataTableColReorderEvent) => {
        if (authUser && Array.isArray(event.columns)) {
            const orderArray = event.columns?.map((column: any) => column.props.field);

            const newActiveColumns = orderArray
                .map((field: string) => {
                    return activeScheduleColumns.find((column) => column.field === field) || null;
                })
                .filter((column): column is ScheduleColumnsList => column !== null);

            setActiveScheduleColumns(newActiveColumns);

            changeSettings({
                activeColumns: newActiveColumns,
            });
        }
    };

    const handleColumnResize = (event: DataTableColumnResizeEndEvent) => {
        if (event.column.props.field) {
            const newColumnWidth = {
                [event.column.props.field as string]: event.element.offsetWidth,
            };
            changeSettings({
                columnWidth: {
                    ...serverSettings?.exportSchedule?.columnWidth,
                    ...newColumnWidth,
                },
            });
        }
    };

    const handleColumnToggle = ({ value, stopPropagation }: MultiSelectChangeEvent) => {
        stopPropagation();
        const sortedValue = value.sort((a: ScheduleColumnsList, b: ScheduleColumnsList) => {
            const firstIndex = scheduleColumns.findIndex((col) => col.field === a.field);
            const secondIndex = scheduleColumns.findIndex((col) => col.field === b.field);
            return firstIndex - secondIndex;
        });
        changeSettings({
            activeColumns: value.map(({ field }: { field: string }) => field),
        });
        setActiveScheduleColumns(sortedValue);
    };

    const handleTaskAction = (taskuid: string, action: ExportWebScheduleAction) => {
        let actionPromise;

        switch (action) {
            case ExportWebScheduleAction.PAUSE:
                actionPromise = exportTaskSchedulePause(taskuid);
                break;
            case ExportWebScheduleAction.CONTINUE:
                actionPromise = exportTaskScheduleContinue(taskuid);
                break;
            case ExportWebScheduleAction.DELETE:
                actionPromise = exportTaskScheduleDelete(taskuid);
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }

        actionPromise.then((response) => {
            if (response?.status === Status.ERROR) {
                toast?.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: response?.error,
                    life: TOAST_LIFETIME,
                });
            } else {
                let qry: string = "";

                const params: QueryParams = {
                    ...(lazyState.sortOrder === 1 && { type: "asc" }),
                    ...(lazyState.sortOrder === -1 && { type: "desc" }),
                    ...(lazyState.sortField && { column: lazyState.sortField }),
                    qry,
                    skip: lazyState.first,
                    top: lazyState.rows,
                };

                handleGetExportScheduleList(params);
            }
        });
    };

    return (
        <div className='card-content schedule'>
            <div className='grid datatable-controls'>
                <div className='col-12 export-web-controls'>
                    <div className='export-web-controls__input'>
                        <MultiSelect
                            showSelectAll={false}
                            value={activeScheduleColumns}
                            optionLabel='header'
                            options={scheduleColumns}
                            onChange={handleColumnToggle}
                            className='w-full pb-0 h-full flex align-items-center column-picker'
                            panelHeaderTemplate={dropdownHeaderPanel}
                            display='chip'
                            pt={{
                                header: {
                                    className: "column-picker__header",
                                },
                                wrapper: {
                                    className: "column-picker__wrapper",
                                    style: {
                                        maxHeight: "500px",
                                    },
                                },
                            }}
                        />
                    </div>
                    <Button
                        severity='success'
                        type='button'
                        icon='icon adms-print'
                        tooltip='Print export to web form'
                    />
                    <Button
                        severity='success'
                        type='button'
                        icon='icon adms-download'
                        tooltip='Download export to web form'
                    />
                </div>
            </div>
            <div className='grid'>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        lazy
                        value={scheduleList}
                        scrollable
                        scrollHeight='70vh'
                        rowsPerPageOptions={ROWS_PER_PAGE}
                        reorderableColumns
                        resizableColumns
                        className='export-web-table'
                        paginator
                        first={lazyState.first}
                        rows={lazyState.rows}
                        totalRecords={totalRecords || 1}
                        onPage={pageChanged}
                        onSort={sortData}
                        sortOrder={lazyState.sortOrder}
                        sortField={lazyState.sortField}
                        onColReorder={handleColumnReorder}
                        onColumnResizeEnd={handleColumnResize}
                    >
                        {activeScheduleColumns.map(({ field, header }) => {
                            return (
                                <Column
                                    field={field}
                                    key={field}
                                    sortable
                                    header={header}
                                    reorderable={false}
                                    pt={{
                                        root: {
                                            style: {
                                                width: serverSettings?.exportSchedule
                                                    ?.columnWidth?.[field],
                                                maxWidth:
                                                    serverSettings?.exportSchedule?.columnWidth?.[
                                                        field
                                                    ],
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            },
                                        },
                                    }}
                                />
                            );
                        })}
                        {!!scheduleList.length && (
                            <Column
                                bodyStyle={{ textAlign: "center" }}
                                reorderable={false}
                                resizeable={false}
                                body={({ taskuid }: ExportWebScheduleList) => {
                                    return (
                                        <div className='schedule-control'>
                                            <Button
                                                outlined
                                                tooltip='Pause'
                                                className='text schedule-button'
                                                icon='icon adms-pause'
                                                onClick={() =>
                                                    handleTaskAction(
                                                        taskuid,
                                                        ExportWebScheduleAction.PAUSE
                                                    )
                                                }
                                            />
                                            <Button
                                                outlined
                                                tooltip='Play'
                                                className='text schedule-button'
                                                icon='icon adms-play-prev'
                                                onClick={() =>
                                                    handleTaskAction(
                                                        taskuid,
                                                        ExportWebScheduleAction.CONTINUE
                                                    )
                                                }
                                            />
                                            <Button
                                                outlined
                                                tooltip='Delete'
                                                className='text schedule-button'
                                                icon='icon adms-trash-can'
                                                onClick={() => setDeletedId(taskuid)}
                                            />
                                        </div>
                                    );
                                }}
                                pt={{
                                    root: {
                                        style: {
                                            width: "100px",
                                            padding: "0 15px",
                                        },
                                    },
                                }}
                            />
                        )}
                    </DataTable>
                </div>
            </div>
            <ConfirmModal
                visible={!!deletedId}
                bodyMessage='Do you really want to delete this record? 
                This process cannot be undone.'
                confirmAction={() =>
                    deletedId && handleTaskAction(deletedId, ExportWebScheduleAction.DELETE)
                }
                draggable={false}
                rejectLabel='Cancel'
                acceptLabel='Delete'
                className='schedule-confirm-dialog'
                onHide={() => setDeletedId(null)}
            />
        </div>
    );
};
