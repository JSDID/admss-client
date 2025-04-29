import { Checkbox } from "primereact/checkbox";
import { Column, ColumnBodyOptions, ColumnProps } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ReactElement, useEffect, useMemo, useState } from "react";
import "./index.css";
import { deletePaymentInfo, listAccountDownPayments } from "http/services/accounts.service";
import { useParams } from "react-router-dom";
import { AccountDownPayments } from "common/models/accounts";
import { useToast } from "dashboard/common/toast";
import { SplitButton } from "primereact/splitbutton";
import { makeShortReports } from "http/services/reports.service";
import { useStore } from "store/hooks";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { Button } from "primereact/button";
import { DownPaymentDialog } from "./down-payment-dialog";

interface TableColumnProps extends ColumnProps {
    field: keyof AccountDownPayments;
}

const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
    { field: "Receipt", header: "Receipt#" },
    { field: "Date", header: "Date" },
    { field: "Amount", header: "Amount" },
    { field: "Paid", header: "Payed" },
];

enum ModalErrors {
    TITLE_NO_RECEIPT = "Receipt is not Selected!",
    TITLE_CONFIRM = "Are you sure?",
    TEXT_NO_PRINT_RECEIPT = "No receipt has been selected for printing. Please select a receipt and try again.",
    TEXT_NO_DOWNLOAD_RECEIPT = "No receipt has been selected for downloading. Please select a receipt and try again.",
    TEXT_NO_PAYMENT_DELETE = "No payment has been selected for deleting. Please select a payment and try again.",
    TEXT_DELETE_PAYMENT = "Do you really want to delete this payment? This process cannot be undone.",
}

export const AccountDownPayment = (): ReactElement => {
    const { id } = useParams();
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const toast = useToast();
    const [paymentList, setPaymentList] = useState<AccountDownPayments[]>([]);
    const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalText, setModalText] = useState<string>("");
    const [modalAction, setModalAction] = useState<(() => void) | null>(null);
    const [selectedPayments, setSelectedPayments] = useState<AccountDownPayments[]>([]);
    const [downPaymentDialogActive, setDownPaymentDialogActive] = useState<boolean>(false);

    const getDownPayments = async () => {
        if (id) {
            const res = await listAccountDownPayments(id);
            if (Array.isArray(res) && res.length) {
                setPaymentList(res);
                setSelectedRows(Array(res.length).fill(false));
            }
        }
    };

    useEffect(() => {
        getDownPayments();
    }, [id]);

    const currentPaymentList = useMemo(() => {
        return paymentList.filter((_, index) => selectedRows[index]);
    }, [paymentList, selectedRows]);

    const takePaymentItems = [
        {
            label: "Delete Payment",
            icon: "icon adms-close",
            command: () => {
                if (!currentPaymentList.length) {
                    setModalTitle(ModalErrors.TITLE_NO_RECEIPT);
                    setModalText(ModalErrors.TEXT_NO_PAYMENT_DELETE);
                    setModalAction(null);
                    setModalVisible(true);
                } else {
                    setModalTitle(ModalErrors.TITLE_CONFIRM);
                    setModalText(ModalErrors.TEXT_DELETE_PAYMENT);
                    setModalAction(() => handleDeletePayments);
                    setModalVisible(true);
                }
            },
        },
    ];

    const getShortReports = async (currentData: AccountDownPayments[], print = false) => {
        const columns = renderColumnsData.map((column) => ({
            name: column.header as string,
            data: column.field as string,
        }));
        const date = new Date();
        const name = `account-down-payment_${
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

    const controlColumnHeader = (): ReactElement => (
        <Checkbox
            checked={selectedRows.every((checkbox) => !!checkbox)}
            onClick={({ checked }) => {
                setSelectedRows(selectedRows.map(() => !!checked));
            }}
        />
    );

    const controlColumnBody = (
        _: AccountDownPayments,
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

    const printItems = [
        {
            label: "Print receipt",
            icon: "icon adms-blank",
            command: () => {
                const currentData = paymentList.filter((_, index) => selectedRows[index]);
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
                const currentData = paymentList.filter((_, index) => selectedRows[index]);
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

    const handleDeletePayments = async () => {
        try {
            const deletePromises = currentPaymentList.map((item) =>
                deletePaymentInfo(item.itemuid)
            );

            await Promise.all(deletePromises);

            getDownPayments();
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Something went wrong. Please try again.",
            });
        }
    };

    const columnBody = (
        field: keyof AccountDownPayments,
        value: string | number,
        rowIndex: number,
        selectedRows: boolean[]
    ) => {
        const isSelected = selectedRows[rowIndex];
        const formattedValue = field === "Amount" ? `$ ${value || "-"}` : value || "-";

        return <div className={`${isSelected && "row--selected"}`}>{formattedValue}</div>;
    };

    const handlePayButtonClick = (payment: AccountDownPayments) => {
        setSelectedPayments([payment]);
        setDownPaymentDialogActive(true);
    };

    const handleTakePaymentButtonClick = () => {
        setSelectedPayments(selectedRows.map((_, index) => paymentList[index]));
        setDownPaymentDialogActive(true);
    };

    return (
        <div className='down-payment account-card'>
            <h3 className='down-payment__title account-title'>Down Payment</h3>
            <div className='down-payment__header grid'>
                <div className='col-4'>
                    <span className='font-bold down-payment__label'>Contact Cash Down: </span>
                    <span>$ 0.00</span>
                </div>
                <div className='col-4'>
                    <span className='font-bold down-payment__label'>Cash Down Payment: </span>
                    <span>$ 0.00</span>
                </div>
                <div className='col-4'>
                    <span className='font-bold down-payment__label'>Cash Dow Balance: </span>
                    <span>$ 0.00</span>
                </div>
            </div>

            <div className='splitter my-5'>
                <h3 className='splitter__title m-0 pr-3'>Scheduled down payments</h3>
                <hr className='splitter__line flex-1' />
            </div>

            <div className='grid account__body'>
                <div className='col-3 ml-auto'>
                    <SplitButton
                        model={takePaymentItems}
                        className='account__split-button ml-auto'
                        label='Take Payment'
                        tooltip='Take Payment'
                        tooltipOptions={{
                            position: "bottom",
                        }}
                        onClick={handleTakePaymentButtonClick}
                        outlined
                    />
                </div>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        className='account__table'
                        value={paymentList}
                        emptyMessage='No payments yet.'
                        reorderableColumns
                        resizableColumns
                        scrollable
                        scrollHeight='310px'
                        pt={{
                            root: {
                                style: {
                                    minHeight: "18vh",
                                    height: "310px",
                                },
                            },
                        }}
                    >
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            className='account__table-checkbox'
                            header={paymentList.length ? controlColumnHeader : ""}
                            body={controlColumnBody}
                            pt={{
                                root: {
                                    style: {
                                        width: paymentList.length ? "60px" : 0,
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
                                body={({ [field]: value }, { rowIndex }) =>
                                    columnBody(field, value, rowIndex, selectedRows)
                                }
                                headerClassName='cursor-move'
                                className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                                pt={{
                                    root: {
                                        style: {
                                            width: 210,
                                        },
                                    },
                                }}
                            />
                        ))}

                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            reorderable={false}
                            resizeable={false}
                            body={(payment: AccountDownPayments) => {
                                return (
                                    <div className={`flex gap-3 align-items-center `}>
                                        <Button
                                            className='down-payment__table-button'
                                            outlined
                                            onClick={() => handlePayButtonClick(payment)}
                                        >
                                            Pay
                                        </Button>
                                    </div>
                                );
                            }}
                            pt={{
                                root: {
                                    style: {
                                        width: "100px",
                                    },
                                },
                            }}
                        />
                    </DataTable>
                </div>
                {!!paymentList.length && (
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
                                getShortReports(paymentList, true);
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
                                getShortReports(paymentList);
                            }}
                            outlined
                        />
                    </div>
                )}
            </div>
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
            <DownPaymentDialog
                visible={downPaymentDialogActive}
                onHide={() => setDownPaymentDialogActive(false)}
                payments={selectedPayments}
            />
        </div>
    );
};
