import { useEffect, useState } from "react";
import { AuthUser } from "http/services/auth.service";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";

import {
    DataTable,
    DataTablePageEvent,
    DataTableRowClickEvent,
    DataTableSortEvent,
} from "primereact/datatable";
import { getKeyValue } from "services/local-storage.service";
import { getAccountsList } from "http/services/accounts.service";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Column, ColumnProps } from "primereact/column";
import { QueryParams } from "common/models/query-params";
import { LS_APP_USER } from "common/constants/localStorage";
import { ROWS_PER_PAGE } from "common/settings";
import { getContacts } from "http/services/contacts-service";
import { makeReports, getReportById } from "http/services/reports.service";
import "./index.css";
import { useNavigate } from "react-router-dom";

const renderColumnsData: Pick<ColumnProps, "header" | "field">[] = [
    { field: "accountnumber", header: "Account" },
    { field: "accounttype", header: "Type" },
    { field: "accountstatus", header: "Name" },
    { field: "created", header: "Date" },
];

export default function Accounts() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [authUser, setUser] = useState<AuthUser | null>(null);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [globalSearch, setGlobalSearch] = useState<string>("");
    const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);
    const navigate = useNavigate();

    const printTableData = async (print: boolean = false) => {
        const columns: string[] = renderColumnsData.map((column) => column.field) as string[];
        const date = new Date();
        const name = `accounts_${date.getMonth()}-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;

        const params: QueryParams = {
            ...(globalSearch && { qry: globalSearch }),
        };
        if (authUser) {
            const data = await getContacts(authUser.useruid, params);
            const JSONreport = {
                name,
                type: "table",
                data,
                columns,
                format: "",
            };
            await makeReports(authUser.useruid, JSONreport).then((response) => {
                setTimeout(() => {
                    getReportById(response.taskuid).then((response) => {
                        const url = new Blob([response], { type: "application/pdf" });
                        let link = document.createElement("a");
                        link.href = window.URL.createObjectURL(url);
                        link.download = "Report.pdf";
                        link.click();

                        if (print) {
                            window.open(
                                link.href,
                                "_blank",
                                "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=1280,height=720"
                            );
                        }
                    });
                }, 5000);
            });
        }
    };

    const pageChanged = (event: DataTablePageEvent) => {
        setLazyState(event);
    };

    const sortData = (event: DataTableSortEvent) => {
        setLazyState(event);
    };

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        if (authUser) {
            setUser(authUser);
            getAccountsList(authUser.useruid, { total: 1 }).then((response) => {
                response && !Array.isArray(response) && setTotalRecords(response.total ?? 0);
            });
        }
    }, []);

    useEffect(() => {
        const params: QueryParams = {
            ...(lazyState.sortOrder === 1 && { type: "asc" }),
            ...(lazyState.sortOrder === -1 && { type: "desc" }),
            ...(globalSearch && { qry: globalSearch }),
            ...(lazyState.sortField && { column: lazyState.sortField }),
            skip: lazyState.first,
            top: lazyState.rows,
        };
        if (authUser) {
            getAccountsList(authUser.useruid, params).then((response) => {
                if (Array.isArray(response)) {
                    setAccounts(response);
                } else {
                    setAccounts([]);
                }
            });
        }
    }, [lazyState, authUser, globalSearch]);

    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Accounts</h2>
                    </div>
                    <div className='card-content'>
                        <div className='grid datatable-controls'>
                            <div className='col-6'>
                                <div className='contact-top-controls'>
                                    <Button
                                        className='contact-top-controls__button'
                                        icon='pi pi-plus-circle'
                                        severity='success'
                                        type='button'
                                        tooltip='Add new account'
                                        onClick={() => navigate("create")}
                                    />
                                    <Button
                                        severity='success'
                                        type='button'
                                        icon='icon adms-print'
                                        tooltip='Print accounts form'
                                        onClick={() => printTableData(true)}
                                    />
                                    <Button
                                        severity='success'
                                        type='button'
                                        icon='icon adms-blank'
                                        tooltip='Download accounts form'
                                        onClick={() => printTableData()}
                                    />
                                </div>
                            </div>
                            <div className='col-6 text-right'>
                                <Button
                                    className='contact-top-controls__button m-r-20px'
                                    label='Advanced search'
                                    severity='success'
                                    type='button'
                                />
                                <span className='p-input-icon-right'>
                                    <i className='pi pi-search' />
                                    <InputText
                                        value={globalSearch}
                                        onChange={(e) => setGlobalSearch(e.target.value)}
                                    />
                                </span>
                            </div>
                        </div>
                        <div className='grid'>
                            <div className='col-12'>
                                <DataTable
                                    showGridlines
                                    value={accounts}
                                    lazy
                                    paginator
                                    first={lazyState.first}
                                    rows={lazyState.rows}
                                    rowsPerPageOptions={ROWS_PER_PAGE}
                                    totalRecords={totalRecords}
                                    onPage={pageChanged}
                                    onSort={sortData}
                                    reorderableColumns
                                    resizableColumns
                                    sortOrder={lazyState.sortOrder}
                                    sortField={lazyState.sortField}
                                    rowClassName={() => "hover:text-primary cursor-pointer"}
                                    onRowClick={({
                                        data: { accountuid },
                                    }: DataTableRowClickEvent) => {
                                        navigate(accountuid);
                                    }}
                                >
                                    {renderColumnsData.map(({ field, header }) => (
                                        <Column
                                            field={field}
                                            header={header}
                                            key={field}
                                            sortable
                                            headerClassName='cursor-move'
                                        />
                                    ))}
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
