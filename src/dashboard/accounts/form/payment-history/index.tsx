import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column, ColumnBodyOptions, ColumnProps } from "primereact/column";
import { DataTable, DataTableRowClickEvent, DataTableValue } from "primereact/datatable";
import { ReactElement, useEffect, useMemo, useState } from "react";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import { deletePaymentInfo, listAccountHistory } from "http/services/accounts.service";
import { AccountHistory } from "common/models/accounts";
import { ACCOUNT_PAYMENT_STATUS_LIST } from "common/constants/account-options";
import {
    MultiSelect,
    MultiSelectChangeEvent,
    MultiSelectPanelHeaderTemplateEvent,
} from "primereact/multiselect";
import { SplitButton } from "primereact/splitbutton";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { AccountTakePaymentTabs } from "dashboard/accounts/take-payment-form";
import { AddPaymentNoteDialog } from "./add-payment-note";
import { AddNoteDialog } from "../notes/add-note-dialog";
import { makeShortReports } from "http/services/reports.service";
import { useStore } from "store/hooks";
import { useToast } from "dashboard/common/toast";
import { observer } from "mobx-react-lite";
import { ComboBox } from "dashboard/common/form/dropdown";

interface TableColumnProps extends ColumnProps {
    field: keyof AccountHistory | "";
}

export type TableColumnsList = Pick<TableColumnProps, "header" | "field"> & { checked: boolean };

const renderColumnsData: TableColumnsList[] = [
    { field: "RECEIPT_NUM", header: "Receipt#", checked: true },
    { field: "Type", header: "Type", checked: true },
    { field: "Pmt_Date", header: "Date", checked: true },
    { field: "Late_Date", header: "Days Late", checked: true },
    { field: "Pmt_Type", header: "Method", checked: true },
    { field: "Balance", header: "Bal.Increase", checked: true },
    { field: "Pmt_Amt", header: "Payment", checked: true },
    { field: "New_Balance", header: "New Balance", checked: false },
    { field: "Principal_Paid", header: "Principal", checked: false },
    { field: "Interest_Paid", header: "Interest", checked: false },
    { field: "Other_Due", header: "Add’l", checked: false },
    { field: "Down_Pmt_Paid", header: "Down", checked: false },
    { field: "Taxes_Memo", header: "Taxes", checked: false },
    { field: "Fees_Memo", header: "Misc/Fees", checked: false },
];

enum ModalErrors {
    TITLE_NO_RECEIPT = "Payment is not Selected!",
    TITLE_CONFIRM = "Are you sure?",
    TEXT_NO_PRINT_RECEIPT = "No receipt has been selected for printing. Please select a receipt and try again.",
    TEXT_NO_DOWNLOAD_RECEIPT = "No receipt has been selected for downloading. Please select a receipt and try again.",
    TITLE_NO_PAYMENT = "Payment is not Selected!",
    TEXT_NO_PAYMENT_DELETE = "No payment has been selected for deleting. Please select a payment and try again.",
    TEXT_DELETE_PAYMENT = "Do you really want to delete this payment? This process cannot be undone.",
}

export const AccountPaymentHistory = observer((): ReactElement => {
    const { id } = useParams();
    const [historyList, setHistoryList] = useState<AccountHistory[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<string>(ACCOUNT_PAYMENT_STATUS_LIST[0]);
    const toast = useToast();
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const navigate = useNavigate();
    const [activeColumns, setActiveColumns] = useState<TableColumnsList[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableValue[]>([]);
    const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
    const [paymentDialogVisible, setPaymentDialogVisible] = useState<boolean>(false);
    const [noteDialogVisible, setNoteDialogVisible] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalText, setModalText] = useState<string>("");
    const [modalAction, setModalAction] = useState<(() => void) | null>(null);

    const getNotesData = async () => {
        if (id) {
            const res = await listAccountHistory(id);
            if (Array.isArray(res) && res.length) {
                setHistoryList(res);
                setSelectedRows(Array(res.length).fill(false));
            }
        }
        setActiveColumns(renderColumnsData.filter(({ checked }) => checked));
    };

    useEffect(() => {
        getNotesData();
    }, [id]);

    const currentHistoryList = useMemo(() => {
        return historyList.filter((_, index) => selectedRows[index]);
    }, [historyList, selectedRows]);

    const getShortReports = async (currentData: AccountHistory[], print = false) => {
        const columns = renderColumnsData.map((column) => ({
            name: column.header as string,
            data: column.field as string,
        }));
        const date = new Date();
        const name = `account-history_${
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

    const printItems = [
        {
            label: "Print receipt",
            icon: "icon adms-blank",
            command: () => {
                const currentData = historyList.filter((_, index) => selectedRows[index]);
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
                const currentData = historyList.filter((_, index) => selectedRows[index]);
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

    const takePaymentItems = [
        {
            label: "Add Note",
            icon: "icon adms-calendar",
            command: () => {
                if (!!selectedRows.filter(Boolean).length) {
                    setPaymentDialogVisible(true);
                    setNoteDialogVisible(false);
                } else {
                    setNoteDialogVisible(true);
                    setPaymentDialogVisible(false);
                }
            },
        },
        {
            label: "Delete Payment",
            icon: "icon adms-close",
            command: () => {
                if (!currentHistoryList.length) {
                    setModalTitle(ModalErrors.TITLE_NO_RECEIPT);
                    setModalText(ModalErrors.TEXT_NO_PAYMENT_DELETE);
                    setModalAction(null);
                    setModalVisible(true);
                } else {
                    setModalTitle(ModalErrors.TITLE_CONFIRM);
                    setModalText(ModalErrors.TEXT_DELETE_PAYMENT);
                    setModalAction(() => handleDeleteHistory);
                    setModalVisible(true);
                }
            },
        },
    ];

    const handleDeleteHistory = async () => {
        try {
            const deletePromises = currentHistoryList.map((item) =>
                deletePaymentInfo(item.itemuid)
            );

            await Promise.all(deletePromises);

            getNotesData();
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Something went wrong. Please try again.",
            });
        }
    };

    const dropdownHeaderPanel = ({ onCloseClick }: MultiSelectPanelHeaderTemplateEvent) => {
        return (
            <div className='dropdown-header flex pb-1'>
                <label className='cursor-pointer dropdown-header__label'>
                    <Checkbox
                        onChange={() => {
                            if (renderColumnsData.length === activeColumns.length) {
                                setActiveColumns(
                                    renderColumnsData.filter(({ checked }) => checked)
                                );
                            } else {
                                setActiveColumns(renderColumnsData);
                            }
                        }}
                        checked={renderColumnsData.length === activeColumns.length}
                        className='dropdown-header__checkbox mr-2'
                    />
                    Select All
                </label>
                <button
                    className='p-multiselect-close p-link'
                    onClick={(e) => {
                        setActiveColumns(renderColumnsData.filter(({ checked }) => checked));
                        onCloseClick(e);
                    }}
                >
                    <i className='pi pi-times' />
                </button>
            </div>
        );
    };

    const rowExpansionTemplate = (data: AccountHistory) => {
        return (
            <div className='expanded-row'>
                <div className='expanded-row__label'>Payment comment: </div>
                <div className='expanded-row__text'>{data.Comment || ""}</div>
            </div>
        );
    };

    const handleRowExpansionClick = (data: AccountHistory) => {
        if (expandedRows.includes(data)) {
            setExpandedRows(expandedRows.filter((item) => item !== data));
            return;
        }
        setExpandedRows([...expandedRows, data]);
    };

    const controlColumnHeader = (): ReactElement => (
        <Checkbox
            checked={selectedRows.every((checkbox) => !!checkbox)}
            onClick={({ checked }) => {
                setSelectedRows(selectedRows.map(() => !!checked));
            }}
        />
    );

    const controlColumnBody = (
        options: AccountHistory,
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

                <Button
                    className='text export-web__icon-button'
                    icon='pi pi-angle-down'
                    onClick={() => handleRowExpansionClick(options)}
                />
            </div>
        );
    };

    const handleFilterActivity = async () => {
        if (!id) return;

        const res = await listAccountHistory(id);
        if (Array.isArray(res) && res.length) {
            let filteredList = res;

            switch (selectedPayment) {
                case ACCOUNT_PAYMENT_STATUS_LIST[1]:
                    filteredList = res.filter((item) => Boolean(item.deleted));
                    break;
                case ACCOUNT_PAYMENT_STATUS_LIST[2]:
                    filteredList = res;
                    break;
                default:
                    filteredList = res;
            }

            setHistoryList(filteredList);
            setSelectedRows(Array(filteredList.length).fill(false));
        } else {
            setHistoryList([]);
            setSelectedRows([]);
        }
    };

    useEffect(() => {
        handleFilterActivity();
    }, [selectedPayment, id]);

    return (
        <div className='account-history account-card'>
            <h3 className='account-history__title account-title'>Payment History</h3>
            <div className='grid account__body'>
                <div className='col-12 account__control'>
                    <ComboBox
                        className='account__dropdown'
                        options={[...ACCOUNT_PAYMENT_STATUS_LIST]}
                        value={selectedPayment}
                        onChange={({ target: { value } }) => {
                            setSelectedPayment(value);
                        }}
                    />
                    <MultiSelect
                        options={renderColumnsData}
                        value={activeColumns}
                        optionLabel='header'
                        onChange={({ value, stopPropagation }: MultiSelectChangeEvent) => {
                            stopPropagation();
                            const sortedValue = value.sort(
                                (a: TableColumnsList, b: TableColumnsList) => {
                                    const firstIndex = renderColumnsData.findIndex(
                                        (col) => col.field === a.field
                                    );
                                    const secondIndex = renderColumnsData.findIndex(
                                        (col) => col.field === b.field
                                    );
                                    return firstIndex - secondIndex;
                                }
                            );

                            setActiveColumns(sortedValue);
                        }}
                        panelHeaderTemplate={dropdownHeaderPanel}
                        className='account__dropdown flex align-items-center column-picker'
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
                    <SplitButton
                        model={takePaymentItems}
                        className='account__split-button ml-auto'
                        label='Take Payment'
                        tooltip='Take Payment'
                        tooltipOptions={{
                            position: "bottom",
                        }}
                        onClick={() =>
                            navigate(`take-payment?tab=${AccountTakePaymentTabs.QUICK_PAY}`)
                        }
                        outlined
                    />
                </div>
                <div className='col-12 account__table'>
                    <DataTable
                        showGridlines
                        value={historyList}
                        emptyMessage='No activity yet.'
                        reorderableColumns
                        resizableColumns
                        scrollable
                        rowExpansionTemplate={rowExpansionTemplate}
                        expandedRows={expandedRows}
                        onRowToggle={(e: DataTableRowClickEvent) => setExpandedRows([e.data])}
                    >
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            header={historyList.length ? controlColumnHeader : ""}
                            reorderable={false}
                            resizeable={false}
                            body={controlColumnBody}
                            pt={{
                                root: {
                                    style: {
                                        width: "100px",
                                    },
                                },
                            }}
                        />
                        {activeColumns.map(({ field, header }) => (
                            <Column
                                field={field}
                                header={header}
                                alignHeader={"left"}
                                body={({ [field]: value }, { rowIndex }) => (
                                    <div
                                        className={`${
                                            selectedRows[rowIndex] ? "row--selected" : ""
                                        } ${field === "deleted" && !value ? "row--deleted" : ""}`}
                                    >
                                        {value || "-"}
                                    </div>
                                )}
                                key={field}
                                headerClassName='cursor-move'
                                className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                            />
                        ))}
                    </DataTable>
                </div>
                {!!historyList.length && (
                    <div className='col-12 flex gap-3'>
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
                                getShortReports(historyList, true);
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
                                getShortReports(historyList);
                            }}
                            outlined
                        />
                    </div>
                )}
            </div>
            <AddPaymentNoteDialog
                position='top'
                action={() => {
                    setPaymentDialogVisible(false);
                    getNotesData();
                }}
                onHide={() => setPaymentDialogVisible(false)}
                payments={historyList.filter((_, index) => selectedRows[index])}
                visible={paymentDialogVisible}
                accountuid={id}
            />
            <AddNoteDialog
                position='top'
                action={() => {
                    setNoteDialogVisible(false);
                    getNotesData();
                }}
                onHide={() => setNoteDialogVisible(false)}
                visible={noteDialogVisible}
                accountuid={id}
            />
            <ConfirmModal
                visible={!!modalVisible}
                position='top'
                title={modalTitle}
                icon={`pi-${modalAction ? "times-circle" : "exclamation-triangle"}`}
                bodyMessage={modalText}
                confirmAction={() => {
                    modalAction?.();
                    setModalVisible(false);
                }}
                draggable={false}
                rejectLabel={"Cancel"}
                acceptLabel={modalAction ? "Delete" : "Got it"}
                className={`account-warning ${modalAction ? "account-warning--reject" : ""}`}
                onHide={() => setModalVisible(false)}
            />
        </div>
    );
});
