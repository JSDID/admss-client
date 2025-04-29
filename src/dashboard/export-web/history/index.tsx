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
import { ROWS_PER_PAGE } from "common/settings";
import { store } from "store";
import { getExportHistoryList } from "http/services/export-to-web.service";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
import { ExportWebHistoryList } from "common/models/export-web";
import { QueryParams } from "common/models/query-params";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";
import { getUserSettings, setUserSettings } from "http/services/auth-user.service";
import { ExportWebUserSettings, ServerUserSettings, TableState } from "common/models/user";
import { Status } from "common/models/base-response";
import { InputText } from "primereact/inputtext";

interface HistoryColumnProps extends ColumnProps {
    field: keyof ExportWebHistoryList;
}

type HistoryColumnsList = Pick<HistoryColumnProps, "header" | "field"> & { checked: boolean };

const historyColumns: HistoryColumnsList[] = [
    { field: "id", header: "#", checked: true },
    { field: "taskstatus", header: "Status", checked: true },
    { field: "created", header: "Created", checked: true },
    { field: "tasktype", header: "Type", checked: true },
    { field: "info", header: "Info", checked: true },
    { field: "lastrun", header: "Last Run", checked: true },
];

export const ExportHistory = (): ReactElement => {
    const userStore = store.userStore;
    const { authUser } = userStore;
    const [historyList, setHistoryList] = useState<ExportWebHistoryList[]>([]);
    const [activeHistoryColumns, setActiveHistoryColumns] =
        useState<HistoryColumnsList[]>(historyColumns);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);
    const [serverSettings, setServerSettings] = useState<ServerUserSettings>();
    const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);
    const [globalSearch, setGlobalSearch] = useState<string>("");

    const handleGetExportHistoryList = async (params: QueryParams) => {
        if (!authUser) return;
        const [totalResponse, dataResponse] = await Promise.all([
            getExportHistoryList(authUser.useruid, { ...params, total: 1 }),
            getExportHistoryList(authUser.useruid, params),
        ]);

        if (totalResponse && !Array.isArray(totalResponse)) {
            setTotalRecords(totalResponse.total ?? 0);
        }

        if (Array.isArray(dataResponse)) {
            setHistoryList(dataResponse);
        } else {
            setHistoryList([]);
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
            exportHistory: { ...serverSettings?.exportHistory, ...settings },
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
                const { exportHistory: settings } = allSettings;
                if (settings?.activeColumns?.length) {
                    const uniqueColumns = Array.from(new Set(settings?.activeColumns));
                    const serverColumns = historyColumns.filter((column) =>
                        uniqueColumns.find((col) => col === column.field)
                    );
                    setActiveHistoryColumns(serverColumns);
                } else {
                    setActiveHistoryColumns(historyColumns.filter(({ checked }) => checked));
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
        if (!settingsLoaded) return;
        let qry: string = "";

        if (globalSearch) {
            qry += globalSearch;
        }

        const params: QueryParams = {
            ...(lazyState.sortOrder === 1 && { type: "asc" }),
            ...(lazyState.sortOrder === -1 && { type: "desc" }),
            ...(lazyState.sortField && { column: lazyState.sortField }),
            qry,
            skip: lazyState.first,
            top: lazyState.rows,
        };

        handleGetExportHistoryList(params);
    }, [lazyState, settingsLoaded, globalSearch]);

    const handleCheckboxChange = () => {
        if (historyColumns.length === activeHistoryColumns.length) {
            setActiveHistoryColumns(historyColumns.filter(({ checked }) => checked));
            changeSettings({ activeColumns: [] });
        } else {
            setActiveHistoryColumns(historyColumns);
            changeSettings({
                activeColumns: historyColumns.map(({ field }) => field),
            });
        }
    };

    const handleDropdownHeaderColumnToggle = () => {
        changeSettings({ activeColumns: [] });
        return setActiveHistoryColumns(historyColumns.filter(({ checked }) => checked));
    };

    const dropdownHeaderPanel = (
        <div className='dropdown-header flex pb-1'>
            <label className='cursor-pointer dropdown-header__label'>
                <Checkbox
                    checked={historyColumns.length === activeHistoryColumns.length}
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
                    return activeHistoryColumns.find((column) => column.field === field) || null;
                })
                .filter((column): column is HistoryColumnsList => column !== null);

            setActiveHistoryColumns(newActiveColumns);

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
                    ...serverSettings?.exportHistory?.columnWidth,
                    ...newColumnWidth,
                },
            });
        }
    };

    const handleColumnToggle = ({ value, stopPropagation }: MultiSelectChangeEvent) => {
        stopPropagation();
        const sortedValue = value.sort((a: HistoryColumnsList, b: HistoryColumnsList) => {
            const firstIndex = historyColumns.findIndex((col) => col.field === a.field);
            const secondIndex = historyColumns.findIndex((col) => col.field === b.field);
            return firstIndex - secondIndex;
        });
        changeSettings({
            activeColumns: value.map(({ field }: { field: string }) => field),
        });
        setActiveHistoryColumns(sortedValue);
    };

    return (
        <div className='card-content history'>
            <div className='grid datatable-controls'>
                <div className='col-12 export-web-controls'>
                    <div className='export-web-controls__input'>
                        <MultiSelect
                            showSelectAll={false}
                            value={activeHistoryColumns}
                            optionLabel='header'
                            options={historyColumns}
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
                    <span className='p-input-icon-right export-web__search ml-auto'>
                        <i className='icon adms-search' />
                        <InputText
                            value={globalSearch}
                            placeholder='Search'
                            onChange={(e) => setGlobalSearch(e.target.value)}
                        />
                    </span>
                </div>
            </div>
            <div className='grid'>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        lazy
                        value={historyList}
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
                        {activeHistoryColumns.map(({ field, header }) => {
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
                                                width: serverSettings?.exportHistory?.columnWidth?.[
                                                    field
                                                ],
                                                maxWidth:
                                                    serverSettings?.exportHistory?.columnWidth?.[
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
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
