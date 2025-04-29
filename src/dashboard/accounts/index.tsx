import { ReactElement, useEffect, useState } from "react";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";

import {
    DataTable,
    DataTablePageEvent,
    DataTableRowClickEvent,
    DataTableSortEvent,
} from "primereact/datatable";
import { getAccountsList, TotalAccountList } from "http/services/accounts.service";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Column, ColumnProps } from "primereact/column";
import { QueryParams } from "common/models/query-params";
import { ROWS_PER_PAGE } from "common/settings";
import { makeShortReports } from "http/services/reports.service";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { ReportsColumn } from "common/models/reports";
import { Loader } from "dashboard/common/loader";
import { observer } from "mobx-react-lite";
import {
    AdvancedSearchDialog,
    SEARCH_FORM_TYPE,
    SearchField,
} from "dashboard/common/dialog/search";
import { useStore } from "store/hooks";
import { AccountInfo } from "common/models/accounts";

const renderColumnsData: Pick<ColumnProps, "header" | "field">[] = [
    { field: "accountnumber", header: "Account" },
    { field: "accounttype", header: "Type" },
    { field: "name", header: "Name" },
    { field: "created", header: "Date" },
];

enum SEARCH_FORM_FIELDS {
    ACCOUNT = "Account#",
    DATE = "Date",
}

enum SEARCH_FORM_QUERY {
    ACCOUNT = "accountnumber",
    DATE = "dateeffective",
}

interface AdvancedSearch {
    [key: string]: string | number;
    accountInfo: string;
    VIN: string;
    StockNo: string;
    date: string;
}

interface AccountsDataTableProps {
    onRowClick?: (accountName: string) => void;
    returnedField?: keyof AccountInfo;
    getFullInfo?: (account: AccountInfo) => void;
}

export const AccountsDataTable = observer(
    ({ onRowClick, returnedField, getFullInfo }: AccountsDataTableProps): ReactElement => {
        const [accounts, setAccounts] = useState<AccountInfo[]>([]);
        const userStore = useStore().userStore;
        const { authUser } = userStore;
        const [totalRecords, setTotalRecords] = useState<number>(0);
        const [globalSearch, setGlobalSearch] = useState<string>("");
        const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);
        const [advancedSearch, setAdvancedSearch] = useState<Record<string, string | number>>({});
        const [dialogVisible, setDialogVisible] = useState<boolean>(false);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
        const navigate = useNavigate();

        const searchFields = [
            {
                key: SEARCH_FORM_FIELDS.ACCOUNT,
                label: SEARCH_FORM_FIELDS.ACCOUNT,
                value: advancedSearch?.[SEARCH_FORM_FIELDS.ACCOUNT],
                type: "text",
            },

            {
                key: SEARCH_FORM_FIELDS.DATE,
                label: SEARCH_FORM_FIELDS.DATE,
                value: advancedSearch?.[SEARCH_FORM_FIELDS.DATE],
                type: "date",
            },
        ];

        const printTableData = async (print: boolean = false) => {
            setIsLoading(true);
            const columns: ReportsColumn[] = renderColumnsData.map((column) => ({
                name: column.header as string,
                data: column.field as string,
            }));
            const date = new Date();
            const name = `accounts_${
                date.getMonth() + 1
            }-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;

            if (authUser) {
                const data = accounts.map((item) => {
                    const filteredItem: Record<string, any> = {};
                    columns.forEach((column) => {
                        if (item.hasOwnProperty(column.data)) {
                            filteredItem[column.data] = item[column.data as keyof typeof item];
                        }
                    });
                    return filteredItem;
                });
                const JSONreport = {
                    name,
                    itemUID: "0",
                    data,
                    columns,
                    format: "",
                };
                await makeShortReports(authUser.useruid, JSONreport).then((response) => {
                    const url = new Blob([response], { type: "application/pdf" });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(url);
                    if (!print) {
                        link.download = `Report-${name}.pdf`;
                        link.click();
                    }

                    if (print) {
                        window.open(
                            link.href,
                            "_blank",
                            "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=1280,height=720"
                        );
                    }
                });
            }
            setIsLoading(false);
        };

        const pageChanged = (event: DataTablePageEvent) => {
            setLazyState(event);
        };

        const sortData = (event: DataTableSortEvent) => {
            setLazyState(event);
        };

        useEffect(() => {
            getAccountsList(authUser!.useruid, { total: 1 }).then((response) => {
                if (response && !Array.isArray(response)) {
                    const { total } = response as TotalAccountList;
                    setTotalRecords(total ?? 0);
                }
            });
        }, []);

        useEffect(() => {
            const params: QueryParams = {
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

        const handleSetAdvancedSearch = (key: keyof AdvancedSearch, value: string | number) => {
            setAdvancedSearch((prevSearch) => {
                const newSearch = { ...prevSearch, [key]: value };
                const isAnyValueEmpty = Object.values(newSearch).every((v) => v === "");
                setButtonDisabled(isAnyValueEmpty);
                return newSearch;
            });
        };

        const handleAdvancedSearch = () => {
            const searchQuery = Object.entries(advancedSearch)
                .filter(([_, value]) => value)
                .map(([key, value]) => {
                    let keyName: string = key;
                    switch (key) {
                        case SEARCH_FORM_FIELDS.ACCOUNT:
                            keyName = SEARCH_FORM_QUERY.ACCOUNT;
                            break;

                        case SEARCH_FORM_FIELDS.DATE:
                            keyName = SEARCH_FORM_QUERY.DATE;
                            value = new Date(value).getTime();
                            break;
                    }
                    return `${value}.${keyName}`;
                })
                .join("+");

            const params: QueryParams = {
                top: lazyState.first,
                skip: lazyState.skip,
                qry: searchQuery,
            };
            authUser &&
                getAccountsList(authUser?.useruid, params).then((response) => {
                    if (Array.isArray(response)) {
                        setAccounts(response);
                    } else {
                        setAccounts([]);
                    }
                });

            setDialogVisible(false);
        };

        const handleOnRowClick = ({ data }: DataTableRowClickEvent) => {
            if (getFullInfo) {
                getFullInfo(data as AccountInfo);
            }
            if (onRowClick) {
                const value = returnedField ? data[returnedField] : data.name;
                onRowClick(value);
            } else {
                navigate(data.accountuid);
            }
        };

        const handleClearAdvancedSearchField = (key: keyof AdvancedSearch) => {
            setAdvancedSearch((prevSearch) => {
                const updatedSearch = { ...prevSearch };
                delete updatedSearch[key];
                return updatedSearch;
            });
        };

        return (
            <div className='card-content'>
                <div className='grid datatable-controls'>
                    <div className='col-6'>
                        <div className='contact-top-controls'>
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
                                icon='icon adms-download'
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
                            onClick={() => setDialogVisible(true)}
                        />
                        <span className='p-input-icon-right'>
                            <i className='icon adms-search' />
                            <InputText
                                value={globalSearch}
                                onChange={(e) => setGlobalSearch(e.target.value)}
                            />
                        </span>
                    </div>
                </div>
                <div className='grid'>
                    <div className='col-12'>
                        {isLoading ? (
                            <div className='dashboard-loader__wrapper'>
                                <Loader overlay />
                            </div>
                        ) : (
                            <DataTable
                                showGridlines
                                value={accounts}
                                lazy
                                paginator
                                first={lazyState.first}
                                rows={lazyState.rows}
                                rowsPerPageOptions={ROWS_PER_PAGE}
                                totalRecords={totalRecords || 1}
                                onPage={pageChanged}
                                onSort={sortData}
                                reorderableColumns
                                resizableColumns
                                sortOrder={lazyState.sortOrder}
                                sortField={lazyState.sortField}
                                rowClassName={() => "hover:text-primary cursor-pointer"}
                                onRowClick={handleOnRowClick}
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
                        )}
                    </div>
                </div>
                <AdvancedSearchDialog<AdvancedSearch>
                    visible={dialogVisible}
                    buttonDisabled={buttonDisabled}
                    onHide={() => {
                        setButtonDisabled(true);
                        setDialogVisible(false);
                    }}
                    action={handleAdvancedSearch}
                    onSearchClear={handleClearAdvancedSearchField}
                    onInputChange={handleSetAdvancedSearch}
                    fields={searchFields as SearchField<AdvancedSearch>[]}
                    searchForm={SEARCH_FORM_TYPE.ACCOUNTS}
                />
            </div>
        );
    }
);

export const Accounts = () => {
    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Accounts</h2>
                    </div>
                    <AccountsDataTable />
                </div>
            </div>
        </div>
    );
};
