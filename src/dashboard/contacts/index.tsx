import { useEffect, useState } from "react";
import {
    getContacts,
    getContactsAmount,
    getContactsTypeList,
} from "http/services/contacts-service";
import {
    DataTable,
    DataTablePageEvent,
    DataTableRowClickEvent,
    DataTableSortEvent,
} from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Column, ColumnProps } from "primereact/column";
import { QueryParams } from "common/models/query-params";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { ROWS_PER_PAGE } from "common/settings";
import { ContactType, ContactTypeNameList, ContactUser } from "common/models/contact";
import { ContactsUserSettings, ServerUserSettings, TableState } from "common/models/user";
import { getUserSettings, setUserSettings } from "http/services/auth-user.service";
import { makeShortReports } from "http/services/reports.service";
import { ReportsColumn } from "common/models/reports";
import { Loader } from "dashboard/common/loader";
import { useStore } from "store/hooks";
import {
    AdvancedSearchDialog,
    SEARCH_FIELD_TYPE,
    SEARCH_FORM_TYPE,
    SearchField,
} from "dashboard/common/dialog/search";
import { createStringifySearchQuery, formatPhoneNumber, isObjectValuesEmpty } from "common/helpers";
import { ComboBox } from "dashboard/common/form/dropdown";

interface TableColumnProps extends ColumnProps {
    field: keyof ContactUser | "fullName";
}

interface AdvancedSearch {
    [key: string]: string | number;
    username: string;
    type: number;
    phone1: string;
}

interface ContactsDataTableProps {
    onRowClick?: (companyName: string) => void;
    contactCategory?: ContactTypeNameList | string;
    originalPath?: string;
    returnedField?: keyof ContactUser;
    getFullInfo?: (contact: ContactUser) => void;
}

const renderColumnsData: TableColumnProps[] = [
    { field: "fullName", header: "Name" },
    { field: "phone1", header: "Work Phone" },
    { field: "phone2", header: "Home Phone" },
    { field: "fullAddress", header: "Address" },
    { field: "email1", header: "Email" },
    { field: "created", header: "Created" },
];

export const ContactsDataTable = ({
    onRowClick,
    contactCategory,
    originalPath,
    returnedField,
    getFullInfo,
}: ContactsDataTableProps) => {
    const [categories, setCategories] = useState<ContactType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ContactType | null>(null);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [globalSearch, setGlobalSearch] = useState<string>("");
    const [contacts, setUserContacts] = useState<ContactUser[]>([]);
    const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);
    const [serverSettings, setServerSettings] = useState<ServerUserSettings>();
    const [activeColumns, setActiveColumns] = useState<TableColumnProps[]>(renderColumnsData);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const store = useStore().contactStore;
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const [advancedSearch, setAdvancedSearch] = useState<AdvancedSearch>({} as AdvancedSearch);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

    const printTableData = async (print: boolean = false) => {
        setIsLoading(true);
        const columns: ReportsColumn[] = renderColumnsData.map((column) => ({
            name: column.header as string,
            data: column.field as string,
        }));
        const date = new Date();
        const name = `contacts_${
            date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;

        if (authUser) {
            const data = contacts.map((item) => {
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
        changeSettings({ table: event as TableState });
    };

    const sortData = (event: DataTableSortEvent) => {
        setLazyState(event);
        changeSettings({ table: event as TableState });
    };

    const handleGetContactsList = async (params: QueryParams, total?: boolean) => {
        if (authUser) {
            const queryString = params.qry ? encodeURIComponent(params.qry) : "";
            const updatedParams = { ...params, qry: queryString };

            if (total) {
                getContactsAmount(authUser.useruid, { ...updatedParams, total: 1 }).then(
                    (response) => {
                        setTotalRecords(response?.total ?? 0);
                    }
                );
            }
            getContacts(authUser.useruid, updatedParams).then((response) => {
                if (Array.isArray(response) && response.length) {
                    setUserContacts(response);
                } else {
                    setUserContacts([]);
                }
                setIsLoading(false);
            });
        }
    };

    useEffect(() => {
        getContactsTypeList("0").then((response) => {
            if (response) {
                const types = response as ContactType[];
                if (types?.length) {
                    if (contactCategory) {
                        const category = types?.find((item) => item.name === contactCategory);
                        setSelectedCategory(category ?? null);
                    }
                    setCategories(types);
                }
            }
        });
    }, [contactCategory]);

    useEffect(() => {
        const params: QueryParams = {
            ...(selectedCategory?.id && { param: selectedCategory.id }),
            ...(lazyState.sortOrder === 1 && { type: "asc" }),
            ...(lazyState.sortOrder === -1 && { type: "desc" }),
            ...(globalSearch && { qry: globalSearch }),
            ...(lazyState.sortField && { column: lazyState.sortField }),
            skip: lazyState.first,
            top: lazyState.rows,
        };
        if (authUser) {
            if (!selectedCategory && contactCategory) {
                return;
            }
            setIsLoading(true);

            handleGetContactsList(params, true);
        }
    }, [selectedCategory, lazyState, authUser, globalSearch, contactCategory]);

    useEffect(() => {
        if (authUser) {
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
                    const { contacts: settings } = allSettings;
                    settings?.activeColumns &&
                        setActiveColumns(settings.activeColumns as TableColumnProps[]);
                    settings?.table &&
                        setLazyState({
                            first: settings.table.first || initialDataTableQueries.first,
                            rows: settings.table.rows || initialDataTableQueries.rows,
                            page: settings.table.page || initialDataTableQueries.page,
                            column: settings.table.column || initialDataTableQueries.column,
                            sortField:
                                settings.table.sortField || initialDataTableQueries.sortField,
                            sortOrder:
                                settings.table.sortOrder || initialDataTableQueries.sortOrder,
                        });
                }
            });
        }
    }, [authUser]);

    const changeSettings = (settings: Partial<ContactsUserSettings>) => {
        if (authUser) {
            const newSettings = {
                ...serverSettings,
                contacts: { ...serverSettings?.contacts, ...settings },
            } as ServerUserSettings;
            setServerSettings(newSettings);
            setUserSettings(authUser.useruid, newSettings);
        }
    };

    const handleOnRowClick = ({ data }: DataTableRowClickEvent) => {
        if (getFullInfo) {
            getFullInfo(data as ContactUser);
        }
        if (onRowClick) {
            const value = returnedField
                ? data[returnedField]
                : `${data.firstName} ${data.lastName}`;
            onRowClick(value);
        } else {
            navigate(data.contactuid);
        }
    };

    const renderFullName = (rowData: ContactUser) => {
        return rowData.businessName || `${rowData.firstName} ${rowData.lastName}`;
    };

    const handleCreateContact = () => {
        if (originalPath) {
            store.memoRoute = originalPath;
        }
        navigate("/dashboard/contacts/create");
    };

    const handleSetAdvancedSearch = (key: keyof AdvancedSearch, value: string | number) => {
        setIsLoading(true);
        setAdvancedSearch((prevSearch) => {
            const newSearch = { ...prevSearch, [key]: value };

            const isAnyValueEmpty = isObjectValuesEmpty(newSearch);

            setButtonDisabled(isAnyValueEmpty);

            return newSearch;
        });
        setIsLoading(false);
    };

    const handleAdvancedSearch = () => {
        const searchQuery = Object.entries(advancedSearch)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${value}.${key.replace(/\d+/g, "")}`)
            .join("+");

        handleGetContactsList({ qry: searchQuery }, true);
        setDialogVisible(false);
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
                ...(!isAdvancedSearchEmpty && { qry: createStringifySearchQuery(updatedSearch) }),
                skip: lazyState.first,
                top: lazyState.rows,
            };
            await handleGetContactsList(params);
        } finally {
            setButtonDisabled(false);
        }
    };

    const searchFields: SearchField<AdvancedSearch>[] = [
        {
            key: "username",
            label: "Contact name",
            value: advancedSearch?.username,
            type: SEARCH_FIELD_TYPE.TEXT,
        },

        {
            key: "type",
            label: "Contact type",
            value: advancedSearch?.type?.toString(),
            type: SEARCH_FIELD_TYPE.DROPDOWN,
        },
        {
            key: "phone1",
            label: "Phone number",
            value: advancedSearch.phone1,
            type: SEARCH_FIELD_TYPE.NUMBER,
        },
    ];

    const bodyDataRender = (field: keyof ContactUser | "fullName") => {
        switch (field) {
            case "fullName":
                return renderFullName;
            case "phone1":
            case "phone2":
                return (rowData: ContactUser) => formatPhoneNumber(rowData[field]);
            default:
                return undefined;
        }
    };

    return (
        <div className='card-content'>
            <div className='grid datatable-controls'>
                <div className='col-6'>
                    <div className='contact-top-controls'>
                        <ComboBox
                            value={selectedCategory}
                            onChange={(e) => {
                                if (contactCategory) return;
                                changeSettings({
                                    selectedCategoriesOptions: e.value,
                                });
                                setSelectedCategory(e.value);
                            }}
                            options={categories}
                            optionLabel='name'
                            editable
                            disabled={!!contactCategory}
                            placeholder='Select Category'
                            pt={{
                                wrapper: {
                                    style: {
                                        maxHeight: "500px",
                                    },
                                },
                            }}
                        />

                        <Button
                            className='contact-top-controls__button'
                            icon='icon adms-add-item'
                            severity='success'
                            type='button'
                            tooltip='Add new contact'
                            onClick={handleCreateContact}
                        />
                        <Button
                            severity='success'
                            type='button'
                            icon='icon adms-print'
                            tooltip='Print contacts form'
                            onClick={() => printTableData(true)}
                        />
                        <Button
                            severity='success'
                            type='button'
                            icon='icon adms-download'
                            tooltip='Download contacts form'
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
                            <Loader />
                        </div>
                    ) : (
                        <DataTable
                            showGridlines
                            value={contacts}
                            lazy
                            scrollable
                            scrollHeight='70vh'
                            paginator
                            first={lazyState.first}
                            rows={lazyState.rows}
                            rowsPerPageOptions={ROWS_PER_PAGE}
                            totalRecords={totalRecords || 1}
                            onPage={pageChanged}
                            onSort={sortData}
                            sortOrder={lazyState.sortOrder}
                            sortField={lazyState.sortField}
                            resizableColumns
                            reorderableColumns
                            rowClassName={() => "hover:text-primary cursor-pointer"}
                            onRowClick={handleOnRowClick}
                            onColReorder={(event) => {
                                if (authUser && Array.isArray(event.columns)) {
                                    const orderArray = event.columns?.map(
                                        (column: any) => column.props.field
                                    );

                                    const newActiveColumns = orderArray
                                        .map((field: string) => {
                                            return (
                                                activeColumns.find(
                                                    (column) => column.field === field
                                                ) || null
                                            );
                                        })
                                        .filter(
                                            (column): column is TableColumnProps => column !== null
                                        ) as TableColumnProps[];

                                    setActiveColumns(newActiveColumns);

                                    changeSettings({
                                        activeColumns: newActiveColumns,
                                    });
                                }
                            }}
                            onColumnResizeEnd={(event) => {
                                if (authUser && event) {
                                    const newColumnWidth = {
                                        [event.column.props.field as string]:
                                            event.element.offsetWidth,
                                    };
                                    changeSettings({
                                        columnWidth: {
                                            ...serverSettings?.contacts?.columnWidth,
                                            ...newColumnWidth,
                                        },
                                    });
                                }
                            }}
                        >
                            {activeColumns.map(({ field, header }) => (
                                <Column
                                    field={field}
                                    header={header}
                                    key={field}
                                    sortable
                                    headerClassName='cursor-move'
                                    body={bodyDataRender(field)}
                                    pt={{
                                        root: {
                                            style: {
                                                width: serverSettings?.contacts?.columnWidth?.[
                                                    field
                                                ],
                                                maxWidth:
                                                    serverSettings?.contacts?.columnWidth?.[field],
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            },
                                        },
                                    }}
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
                fields={searchFields}
                searchForm={SEARCH_FORM_TYPE.CONTACTS}
            />
        </div>
    );
};

export default function Contacts() {
    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Contacts</h2>
                    </div>
                    <ContactsDataTable />
                </div>
            </div>
        </div>
    );
}
