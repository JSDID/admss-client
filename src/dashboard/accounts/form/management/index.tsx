import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnBodyOptions, ColumnProps } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import { listAccountActivity } from "http/services/accounts.service";
import { ACCOUNT_ACTIVITY_LIST } from "common/constants/account-options";
import { AccountListActivity } from "common/models/accounts";
import { AccountTakePaymentTabs } from "dashboard/accounts/take-payment-form";
import { SplitButton } from "primereact/splitbutton";
import { AddFeeDialog } from "./add-fee-dialog";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { useStore } from "store/hooks";
import { makeShortReports } from "http/services/reports.service";
import { ComboBox } from "dashboard/common/form/dropdown";

interface TableColumnProps extends ColumnProps {
    field: keyof AccountListActivity;
}

const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
    { field: "Date", header: "Date" },
    { field: "Description", header: "Description" },
    { field: "Debit", header: "Debit" },
    { field: "Credit", header: "Credit" },
];

enum ModalErrors {
    TITLE_NO_RECEIPT = "Receipt is not Selected!",
    TEXT_NO_PRINT_RECEIPT = "No receipt has been selected for printing. Please select a receipt and try again.",
    TEXT_NO_DOWNLOAD_RECEIPT = "No receipt has been selected for downloading. Please select a receipt and try again.",
}

const quickPayPath = `take-payment?tab=${AccountTakePaymentTabs.QUICK_PAY}`;

export const AccountManagement = (): ReactElement => {
    const { id } = useParams();
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const navigate = useNavigate();
    const [activityList, setActivityList] = useState<AccountListActivity[]>([]);
    const [isDialogActive, setIsDialogActive] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<string>(ACCOUNT_ACTIVITY_LIST[0]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalText, setModalText] = useState<string>("");

    const getShortReports = async (currentData: AccountListActivity[], print = false) => {
        const columns = renderColumnsData.map((column) => ({
            name: column.header as string,
            data: column.field as string,
        }));
        const date = new Date();
        const name = `account-management_${
            date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}`;

        if (authUser) {
            const data = currentData.map((item) => {
                const filteredItem: Record<string, any> = {};
                renderColumnsData.forEach((column) => {
                    if (item.hasOwnProperty(column.field)) {
                        filteredItem[column.field] = item[column.field as keyof typeof item];
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
    };

    const handleFilterActivity = () => {
        if (id) {
            listAccountActivity(id).then((res) => {
                if (Array.isArray(res) && res.length) {
                    switch (selectedActivity) {
                        case ACCOUNT_ACTIVITY_LIST[1]:
                            {
                                const newList = res.filter(
                                    (item) => Boolean(item.deleted) === false
                                );
                                setActivityList(newList);
                                setSelectedRows(Array(newList.length).fill(false));
                            }
                            break;
                        case ACCOUNT_ACTIVITY_LIST[2]:
                            {
                                const newList = res.filter(
                                    (item) => Boolean(item.deleted) === true
                                );
                                setActivityList(newList);
                                setSelectedRows(Array(newList.length).fill(false));
                            }
                            break;
                        default:
                            setActivityList(activityList);
                            setSelectedRows(Array(res.length).fill(false));
                    }
                }
            });
        }
    };

    const printItems = [
        {
            label: "Print receipt",
            icon: "icon adms-blank",
            command: () => {
                const currentData = activityList.filter((_, index) => selectedRows[index]);
                if (!currentData.length) {
                    setModalTitle(ModalErrors.TITLE_NO_RECEIPT);
                    setModalText(ModalErrors.TEXT_NO_PRINT_RECEIPT);
                    setModalVisible(true);
                    return;
                }
                getShortReports(currentData, true);
            },
        },
    ];

    const downloadItems = [
        {
            label: "Download receipt",
            icon: "icon adms-print-receipt-01",
            command: () => {
                const currentData = activityList.filter((_, index) => selectedRows[index]);
                if (!currentData.length) {
                    setModalTitle(ModalErrors.TITLE_NO_RECEIPT);
                    setModalText(ModalErrors.TEXT_NO_DOWNLOAD_RECEIPT);
                    setModalVisible(true);
                    return;
                }
                getShortReports(currentData);
            },
        },
    ];

    useEffect(() => {
        if (id) {
            listAccountActivity(id).then((res) => {
                if (Array.isArray(res) && res.length) {
                    setActivityList(res);
                    setSelectedRows(Array(res.length).fill(false));
                }
            });
        }
    }, [id]);

    const controlColumnHeader = (): ReactElement => (
        <Checkbox
            checked={selectedRows.every((checkbox) => !!checkbox)}
            onClick={({ checked }) => {
                setSelectedRows(selectedRows.map(() => !!checked));
            }}
        />
    );

    const controlColumnBody = (
        _: AccountListActivity,
        { rowIndex }: ColumnBodyOptions
    ): ReactElement => {
        return (
            <div className={`flex gap-3 align-items-center`}>
                <Checkbox
                    checked={selectedRows[rowIndex]}
                    onClick={() => {
                        setSelectedRows(
                            selectedRows.map((state, index) =>
                                index === rowIndex ? !state : state
                            )
                        );
                    }}
                />
            </div>
        );
    };

    return (
        <div className='account-management account-card'>
            <h3 className='account-management__title account-title'>Account Management</h3>
            <div className='grid account__body'>
                <div className='col-12 account__control'>
                    <ComboBox
                        className='account__dropdown'
                        options={[...ACCOUNT_ACTIVITY_LIST]}
                        value={selectedActivity}
                        onChange={({ target: { value } }) => {
                            setSelectedActivity(value);
                            handleFilterActivity();
                        }}
                    />
                    <Button
                        className='account-management__button ml-auto'
                        label='Add Fee'
                        onClick={() => setIsDialogActive(true)}
                        outlined
                    />
                    <Button
                        className='account-management__button'
                        label='Take Payment'
                        outlined
                        onClick={() => navigate(quickPayPath)}
                    />
                </div>
                <div className='col-12 account__table'>
                    <DataTable
                        showGridlines
                        value={activityList}
                        emptyMessage='No data yet.'
                        reorderableColumns
                        resizableColumns
                        scrollable
                    >
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            header={activityList.length ? controlColumnHeader : ""}
                            reorderable={false}
                            resizeable={false}
                            body={controlColumnBody}
                            pt={{
                                root: {
                                    style: {
                                        width: "60px",
                                    },
                                },
                            }}
                        />
                        {renderColumnsData.map(({ field, header }) => (
                            <Column
                                field={field}
                                header={header}
                                alignHeader={"left"}
                                key={field}
                                headerClassName='cursor-move'
                                body={(data, { rowIndex }) => {
                                    return (
                                        <div
                                            className={`${
                                                selectedRows[rowIndex] ? "row--selected" : ""
                                            } ${!!data["deleted"] ? "row--deleted" : ""}`}
                                        >
                                            {data[field]}
                                        </div>
                                    );
                                }}
                                className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                            />
                        ))}
                    </DataTable>
                </div>
                {!!activityList.length && (
                    <div className='col-12 flex gap-3 align-items-end justify-content-start account-management__actions'>
                        <SplitButton
                            model={printItems}
                            className='account__split-button'
                            label='Print'
                            icon='icon adms-table-button'
                            tooltip='Print table'
                            tooltipOptions={{
                                position: "bottom",
                            }}
                            onClick={() => {
                                getShortReports(activityList, true);
                            }}
                            outlined
                        />
                        <SplitButton
                            model={downloadItems}
                            className='account__split-button'
                            label='Download'
                            icon='icon adms-table-button'
                            tooltip='Download table'
                            tooltipOptions={{
                                position: "bottom",
                            }}
                            onClick={() => {
                                getShortReports(activityList);
                            }}
                            outlined
                        />
                    </div>
                )}
            </div>
            <ConfirmModal
                visible={!!modalVisible}
                title={modalTitle}
                icon='pi-exclamation-triangle'
                bodyMessage={modalText}
                confirmAction={() => setModalVisible(false)}
                draggable={false}
                acceptLabel='Got It'
                className='account-warning'
                onHide={() => setModalVisible(false)}
            />
            <AddFeeDialog visible={isDialogActive} onHide={() => setIsDialogActive(false)} />
        </div>
    );
};
