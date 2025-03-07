import { useEffect, useState } from "react";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";
import {
    DataTable,
    DataTablePageEvent,
    DataTableRowClickEvent,
    DataTableSortEvent,
} from "primereact/datatable";
import { QueryParams } from "common/models/query-params";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Column, ColumnProps } from "primereact/column";
import { TotalDealsList, getDealsList } from "http/services/deals.service";
import { ROWS_PER_PAGE } from "common/settings";
import { makeShortReports } from "http/services/reports.service";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { ReportsColumn } from "common/models/reports";
import { Deal } from "common/models/deals";
import { Loader } from "dashboard/common/loader";
import { MultiSelect } from "primereact/multiselect";
import { BaseResponseError } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import {
    AdvancedSearchDialog,
    SEARCH_FORM_TYPE,
    SearchField,
} from "dashboard/common/dialog/search";
import { useStore } from "store/hooks";
import { createStringifySearchQuery, isObjectValuesEmpty } from "common/helpers";
import { observer } from "mobx-react-lite";

interface TableColumnProps extends ColumnProps {
    field: keyof Deal | "";
}

export type TableColumnsList = Pick<TableColumnProps, "header" | "field">;

const renderColumnsData: TableColumnsList[] = [
    { field: "accountInfo", header: "Account" },
    { field: "contactinfo", header: "Customer" },
    { field: "dealtype", header: "Type" },
    { field: "created", header: "Date" },
    { field: "inventoryinfo", header: "Info (Vehicle)" },
];

interface DealsFilterOptions {
    name: string;
    value: string;
}

interface DealsFilterGroup {
    name: string;
    options: DealsFilterOptions[];
}

const DEALS_TYPE_LIST: DealsFilterOptions[] = [
    { name: "All", value: "allTypes" },
    { name: "Buy Here Pay Here", value: "0.DealType" },
    { name: "Lease Here Pay Here", value: "7.DealType" },
    { name: "Cash", value: "1.DealType" },
    { name: "Wholesale", value: "5.DealType" },
    { name: "Dismantled", value: "6.DealType" },
];

const DEALS_OTHER_LIST: DealsFilterOptions[] = [
    { name: "All incomplete", value: "0.DealComplete" },
    { name: "Dead or Deleted", value: "6.DealStatus" },
    { name: "Deals not yet sent to RFC", value: "0.RFCSent" },
];

const DEALS_STATUS_LIST: DealsFilterOptions[] = [
    { name: "All", value: "allStatuses" },
    { name: "Recent deals", value: "0.30.Age" },
    { name: "Quotes", value: "0.DealStatus" },
    { name: "Pending", value: "1.DealStatus" },
    { name: "Sold, Not finalized", value: "2.DealStatus" },
    { name: "Manager's review", value: "1.managerReview" },
];

const FILTER_GROUP_LIST: DealsFilterGroup[] = [
    { name: "Type (one of the list)", options: DEALS_TYPE_LIST },
    { name: "Status (one of the list)", options: DEALS_STATUS_LIST },
    { name: "Other", options: DEALS_OTHER_LIST },
];

enum SEARCH_FORM_FIELDS {
    CUSTOMER = "accountInfo",
    VIN = "VIN",
    STOCK_NO = "StockNo",
    DATE = "date",
}

enum SEARCH_FORM_QUERY {
    CUSTOMER = "contactinfo",
    VIN = "inventoryinfo",
    STOCK_NO = "inventoryinfo",
    DATE = "dateeffective",
}

interface AdvancedSearch {
    [key: string]: string | number;
    accountInfo: string;
    VIN: string;
    StockNo: string;
    date: string;
}

interface DealsDataTableProps {
    onRowClick?: (dealName: string) => void;
    originalPath?: string;
    returnedField?: keyof Deal;
    getFullInfo?: (deal: Deal) => void;
}

export const DealsDataTable = observer(
    ({ onRowClick, originalPath, returnedField, getFullInfo }: DealsDataTableProps) => {
        const [deals, setDeals] = useState<Deal[]>([]);
        const store = useStore().dealStore;
        const userStore = useStore().userStore;
        const { authUser } = userStore;
        const [totalRecords, setTotalRecords] = useState<number>(0);
        const [globalSearch, setGlobalSearch] = useState<string>("");
        const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [dealSelectedGroup, setDealSelectedGroup] = useState<string[]>([]);
        const [advancedSearch, setAdvancedSearch] = useState<Record<string, string | number>>({});
        const [dialogVisible, setDialogVisible] = useState<boolean>(false);
        const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

        const searchFields = [
            {
                key: SEARCH_FORM_FIELDS.CUSTOMER,
                label: "Customer",
                value: advancedSearch?.[SEARCH_FORM_FIELDS.CUSTOMER],
                type: "text",
            },
            {
                key: SEARCH_FORM_FIELDS.VIN,
                label: "VIN",
                value: advancedSearch?.[SEARCH_FORM_FIELDS.VIN],
                type: "text",
            },
            {
                key: SEARCH_FORM_FIELDS.STOCK_NO,
                label: "Stock#",
                value: advancedSearch?.[SEARCH_FORM_FIELDS.STOCK_NO],
                type: "text",
            },
            {
                key: SEARCH_FORM_FIELDS.DATE,
                label: "Date",
                value: advancedSearch?.[SEARCH_FORM_FIELDS.DATE],
                type: "date",
            },
        ];

        const navigate = useNavigate();
        const toast = useToast();

        const printTableData = async (print: boolean = false) => {
            setIsLoading(true);
            const columns: ReportsColumn[] = renderColumnsData.map((column) => ({
                name: column.header as string,
                data: column.field as string,
            }));
            const date = new Date();
            const name = `deals_${
                date.getMonth() + 1
            }-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;

            if (authUser) {
                const data = deals.map((item) => {
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
                await makeShortReports(authUser?.useruid, JSONreport).then((response) => {
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

        const handleGetDealsList = async (params: QueryParams) => {
            getDealsList(authUser!.useruid, params).then((response) => {
                if (Array.isArray(response)) {
                    setDeals(response);
                    setIsLoading(false);
                } else {
                    setDeals([]);
                }
            });
        };

        useEffect(() => {
            getDealsList(authUser!.useruid, { total: 1 }).then((response) => {
                const { error } = response as BaseResponseError;
                if (response && !error) {
                    const { total } = response as TotalDealsList;
                    setTotalRecords(total ?? 0);
                    setLazyState({
                        first: initialDataTableQueries.first,
                        rows: initialDataTableQueries.rows,
                        page: initialDataTableQueries.page,
                        column: initialDataTableQueries.column,
                        sortField: initialDataTableQueries.sortField,
                        sortOrder: initialDataTableQueries.sortOrder,
                    });
                } else {
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: error,
                    });
                }
            });
        }, [toast]);

        useEffect(() => {
            const params: QueryParams = {
                ...(globalSearch && { qry: globalSearch }),
                ...(lazyState.sortField && { column: lazyState.sortField }),
                skip: lazyState.first,
                top: lazyState.rows,
            };
            let qry: string = "";
            const selectedFilters: string = [...dealSelectedGroup]
                .filter((item) => item && item !== "allTypes" && item !== "allStatuses")
                .join("+");
            if (selectedFilters.length) {
                qry += selectedFilters;
                params.qry = qry;
            }
            handleGetDealsList(params);
        }, [lazyState, authUser, globalSearch, dealSelectedGroup]);

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
                        case SEARCH_FORM_FIELDS.CUSTOMER:
                            keyName = SEARCH_FORM_QUERY.CUSTOMER;
                            break;
                        case SEARCH_FORM_FIELDS.VIN:
                            keyName = SEARCH_FORM_QUERY.VIN;
                            break;
                        case SEARCH_FORM_FIELDS.STOCK_NO:
                            keyName = SEARCH_FORM_QUERY.STOCK_NO;
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
                skip: lazyState.first,
                top: lazyState.rows,
                qry: searchQuery,
            };
            authUser &&
                getDealsList(authUser?.useruid, params).then((response) => {
                    if (Array.isArray(response)) {
                        setDeals(response);
                    } else {
                        setDeals([]);
                    }
                });

            setDialogVisible(false);
        };

        const handleOnRowClick = ({ data }: DataTableRowClickEvent) => {
            if (getFullInfo) {
                getFullInfo(data as Deal);
            }
            if (onRowClick) {
                const value = returnedField ? data[returnedField] : data.contactinfo;
                onRowClick(value);
            } else {
                navigate(data.dealuid);
            }
        };

        const handleClearAdvancedSearchField = async (key: keyof AdvancedSearch) => {
            setButtonDisabled(true);
            setAdvancedSearch((prev) => {
                const updatedSearch = { ...prev };
                delete updatedSearch[key];
                return updatedSearch;
            });

            try {
                const updatedSearch = { ...advancedSearch };
                delete updatedSearch[key];

                const isAdvancedSearchEmpty = isObjectValuesEmpty(advancedSearch);
                const params: QueryParams = {
                    ...(lazyState.sortOrder === 1 && { type: "asc" }),
                    ...(lazyState.sortOrder === -1 && { type: "desc" }),
                    ...(!isAdvancedSearchEmpty && {
                        qry: createStringifySearchQuery(updatedSearch),
                    }),
                    skip: lazyState.first,
                    top: lazyState.rows,
                };
                await handleGetDealsList(params);
            } finally {
                setButtonDisabled(false);
            }
        };

        const handleCreateDeal = () => {
            if (originalPath) {
                store.memoRoute = originalPath;
            }
            navigate("/dashboard/deals/create");
        };

        return (
            <div className='card-content'>
                <div className='grid datatable-controls'>
                    <div className='col-2'>
                        <span className='p-float-label'>
                            <MultiSelect
                                optionValue='value'
                                optionLabel='name'
                                value={dealSelectedGroup}
                                options={FILTER_GROUP_LIST}
                                optionGroupLabel='name'
                                optionGroupChildren='options'
                                panelHeaderTemplate={<></>}
                                display='chip'
                                className='deals__dropdown'
                                onChange={(e) => {
                                    e.stopPropagation();
                                    setDealSelectedGroup(e.value);
                                }}
                                pt={{
                                    wrapper: {
                                        style: {
                                            maxHeight: "625px",
                                        },
                                    },
                                }}
                            />
                            <label className='float-label'>Filter</label>
                        </span>
                    </div>

                    <div className='col-4'>
                        <div className='contact-top-controls'>
                            <Button
                                className='contact-top-controls__button'
                                icon='pi pi-plus-circle'
                                severity='success'
                                type='button'
                                tooltip='Add new deal'
                                onClick={handleCreateDeal}
                            />
                            <Button
                                severity='success'
                                type='button'
                                icon='icon adms-print'
                                tooltip='Print deals form'
                                onClick={() => printTableData(true)}
                            />
                            <Button
                                severity='success'
                                type='button'
                                icon='icon adms-blank'
                                tooltip='Download deals form'
                                onClick={() => printTableData()}
                            />
                        </div>
                    </div>
                    <div className='col-6 text-right flex flex-nowrap'>
                        <Button
                            className='contact-top-controls__button m-r-20px ml-auto'
                            label='Advanced search'
                            severity='success'
                            type='button'
                            onClick={() => setDialogVisible(true)}
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
                        {isLoading ? (
                            <div className='dashboard-loader__wrapper'>
                                <Loader overlay />
                            </div>
                        ) : (
                            <DataTable
                                showGridlines
                                value={deals}
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
                    searchForm={SEARCH_FORM_TYPE.DEALS}
                />
            </div>
        );
    }
);

export const Deals = () => {
    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Deals</h2>
                    </div>
                    <DealsDataTable />
                </div>
            </div>
        </div>
    );
};
