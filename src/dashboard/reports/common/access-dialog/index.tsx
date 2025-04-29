import { Status } from "common/models/base-response";
import { QueryParams } from "common/models/query-params";
import { ReportAccess, ReportACL } from "common/models/reports";
import { TOAST_LIFETIME } from "common/settings";
import { DashboardDialog } from "dashboard/common/dialog";
import { useToast } from "dashboard/common/toast";
import { getReportAccessList, setReportAccessList } from "http/services/reports.service";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnProps } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import "./index.css";
import { useStore } from "store/hooks";

interface TableColumnProps extends ColumnProps {
    field: keyof ReportAccess;
}

export type TableColumnsList = Pick<TableColumnProps, "header" | "field">;

const renderColumnsData: TableColumnsList[] = [
    { field: "username", header: "User name" },
    { field: "userrole", header: "Role" },
    { field: "enabled", header: "Access" },
];

interface EditAccessDialogProps {
    visible: boolean;
    onHide: () => void;
    reportuid: string;
}

enum ROLE {
    ALL = "All_roles",
    ADMIN = "admin.role",
    MANAGER = "manager.role",
    SALES = "sales.role",
}

enum ACCESS {
    ALL = "All_access",
    GRANTED = "granted.access",
    DENIED = "denied.access",
}

const filterOptions = [
    {
        label: "Role",
        items: [
            { name: "All roles", value: ROLE.ALL },
            { name: "Admin", value: ROLE.ADMIN },
            { name: "Manager", value: ROLE.MANAGER },
            { name: "Sales person", value: ROLE.SALES },
        ],
    },
    {
        label: "Access",
        items: [
            { name: "All access", value: ACCESS.ALL },
            { name: "Denied", value: ACCESS.DENIED },
            { name: "Granted", value: ACCESS.GRANTED },
        ],
    },
];

export const EditAccessDialog = ({
    visible,
    onHide,
    reportuid,
}: EditAccessDialogProps): ReactElement => {
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const toast = useToast();
    const [accessList, setAccessList] = useState<ReportAccess[]>([]);
    const [selectedRole, setSelectedRole] = useState<(ROLE | ACCESS)[]>([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [search, setSearch] = useState<string>("");

    const handleGetReportAccessList = (params?: QueryParams) => {
        getReportAccessList(reportuid, params).then((response) => {
            if (response?.status === Status.ERROR) {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: response?.error || "Error while fetching report access list",
                    life: TOAST_LIFETIME,
                });
            } else {
                const { acl } = response as ReportACL;
                if (Array.isArray(acl)) {
                    const newAccessList = acl.filter(
                        (item) => item && item?.useruid !== authUser?.useruid
                    );
                    setAccessList(newAccessList);
                }
            }
        });
    };

    useEffect(() => {
        let qry: string = search;

        if (selectedRole) {
            const selectedFilters: string = [...selectedRole]
                .filter((item) => !item.includes(ROLE.ALL || ACCESS.ALL))
                .join("+");
            if (selectedFilters.length) {
                qry = `${search ? `${qry}+` : ""}${selectedFilters}`;
            }
        }
        handleGetReportAccessList({ qry });
    }, [search, selectedRole]);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleRoleSelection = (selectData: MultiSelectChangeEvent) => {
        const selectedValue: { name: string; value: ROLE | ACCESS } = selectData.selectedOption;
        let newSelectedValues: (ROLE | ACCESS)[] = [...selectedRole];

        const allRoles: ROLE[] = [ROLE.ADMIN, ROLE.MANAGER, ROLE.SALES];
        const allAccess: ACCESS[] = [ACCESS.GRANTED, ACCESS.DENIED];

        if (selectedValue.value === ROLE.ALL) {
            const isAllRolesSelected = newSelectedValues.includes(ROLE.ALL);

            if (isAllRolesSelected) {
                newSelectedValues = newSelectedValues.filter(
                    (value: ROLE | ACCESS) => !allRoles.includes(value as ROLE)
                );
                newSelectedValues = newSelectedValues.filter(
                    (value: ROLE | ACCESS) => value !== ROLE.ALL
                );
            } else {
                newSelectedValues = Array.from(
                    new Set([...newSelectedValues, ...allRoles, ROLE.ALL])
                );
            }
        } else if (selectedValue.value === ACCESS.ALL) {
            const isAllAccessSelected = newSelectedValues.includes(ACCESS.ALL);

            if (isAllAccessSelected) {
                newSelectedValues = newSelectedValues.filter(
                    (value: ROLE | ACCESS) => !allAccess.includes(value as ACCESS)
                );
                newSelectedValues = newSelectedValues.filter(
                    (value: ROLE | ACCESS) => value !== ACCESS.ALL
                );
            } else {
                newSelectedValues = Array.from(
                    new Set([...newSelectedValues, ...allAccess, ACCESS.ALL])
                );
            }
        } else {
            const isItemSelected = newSelectedValues.includes(selectedValue.value);

            if (isItemSelected) {
                newSelectedValues = newSelectedValues.filter(
                    (value: ROLE | ACCESS) => value !== selectedValue.value
                );
            } else {
                newSelectedValues.push(selectedValue.value);
            }

            const allRolesSelected = allRoles.every((role) => newSelectedValues.includes(role));

            if (allRolesSelected) {
                if (!newSelectedValues.includes(ROLE.ALL)) {
                    newSelectedValues.push(ROLE.ALL);
                }
            } else {
                newSelectedValues = newSelectedValues.filter(
                    (value: ROLE | ACCESS) => value !== ROLE.ALL
                );
            }

            const allAccessSelected = allAccess.every((access) =>
                newSelectedValues.includes(access)
            );

            if (allAccessSelected) {
                if (!newSelectedValues.includes(ACCESS.ALL)) {
                    newSelectedValues.push(ACCESS.ALL);
                }
            } else {
                newSelectedValues = newSelectedValues.filter(
                    (value: ROLE | ACCESS) => value !== ACCESS.ALL
                );
            }
        }

        setSelectedRole(newSelectedValues.filter(Boolean));
    };

    const accessField = (data: ReportAccess): ReactElement => {
        const accessBlock = (
            <label
                className={`access-field ${
                    !!data.enabled ? "access-field--green row--selected" : ""
                }`}
            >
                <Checkbox
                    className='access-field__checkbox'
                    onClick={() => {
                        const newList = accessList.map((item: any) => {
                            if (item.username === data.username) {
                                setIsButtonDisabled(false);
                                return { ...item, enabled: !!item.enabled ? 0 : 1 };
                            }
                            return item;
                        });

                        setAccessList(newList);
                    }}
                    checked={!!data.enabled}
                />
                {!!data.enabled ? "Granted" : "Denied"}
            </label>
        );
        return accessBlock;
    };

    const handleSaveAccess = () => {
        setReportAccessList(reportuid, { reportuid, acl: accessList }).then((response) => {
            if (response?.status === Status.ERROR) {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: response?.error || "Access update failed",
                    life: TOAST_LIFETIME,
                });
            } else {
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Access updated successfully!",
                    life: TOAST_LIFETIME,
                });
                onHide();
            }
        });
    };

    const selectedItemTemplate = (item: ROLE | ACCESS) => {
        if (!item) {
            return <></>;
        }
        const items = filterOptions.flatMap(
            (option: { items: { name: string; value: ROLE | ACCESS }[] }) => option.items
        );
        const [currentRole] = items.filter(({ value }) => value === item);
        const handleDelete = (evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
            evt.preventDefault();
            selectedRole.forEach((role: ROLE | ACCESS, index: number) => {
                if (role === item) {
                    selectedRole.splice(index, 1);
                    setSelectedRole([...selectedRole]);
                }
            });
        };
        return (
            <div
                className='access-multiselect__select p-multiselect-label-container'
                data-pc-section='labelcontainer'
            >
                <div className='p-multiselect-label' data-pc-section='label'>
                    <div className='p-multiselect-token' data-pc-section='token'>
                        <span className='p-multiselect-token-label' data-pc-section='tokenlabel'>
                            {currentRole?.name}
                        </span>
                        <Button
                            type='button'
                            rounded
                            icon='pi pi-times'
                            onClick={handleDelete}
                            className='p-multiselect-token-icon'
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <DashboardDialog
            className='edit-access'
            position='top'
            action={handleSaveAccess}
            footer='Update'
            header='Edit Access'
            visible={visible}
            onHide={onHide}
            buttonDisabled={isButtonDisabled}
        >
            <div className='grid'>
                <div className='col-12 edit-access__header'>
                    <div className='access-multiselect'>
                        <span className='p-float-label'>
                            <MultiSelect
                                optionLabel='name'
                                options={filterOptions}
                                className='access-multiselect__dropdown'
                                optionGroupChildren='items'
                                optionGroupLabel='label'
                                showSelectAll={false}
                                value={selectedRole}
                                display='chip'
                                panelHeaderTemplate={<></>}
                                selectedItemTemplate={selectedItemTemplate}
                                onChange={(event) => {
                                    event.stopPropagation();
                                    handleRoleSelection(event);
                                }}
                                pt={{
                                    wrapper: {
                                        className: "edit-collection__multiselect-wrapper",
                                        style: {
                                            maxHeight: "550px",
                                        },
                                    },
                                }}
                            />
                            <label className='float-label'>Filter</label>
                        </span>
                    </div>
                    <span className='p-input-icon-right'>
                        <i className='icon adms-search' />
                        <InputText
                            placeholder='Search'
                            className='w-full'
                            value={search}
                            onChange={handleSearch}
                        />
                    </span>
                </div>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        value={accessList}
                        emptyMessage='User not found.'
                        scrollable
                        pt={{
                            wrapper: {
                                className: "edit-collection__table-wrapper",
                                style: {
                                    maxHeight: "590px",
                                },
                            },
                        }}
                    >
                        {renderColumnsData.map((column) => (
                            <Column
                                key={column.field}
                                field={column.field}
                                header={column.header}
                                body={(data) => {
                                    if (column.field === "enabled") {
                                        return accessField(data);
                                    } else {
                                        return data[column.field];
                                    }
                                }}
                            />
                        ))}
                    </DataTable>
                </div>
            </div>
        </DashboardDialog>
    );
};
