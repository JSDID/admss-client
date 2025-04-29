import { BorderedCheckbox, CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import "./index.css";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { DataTable, DataTableRowClickEvent } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Expenses } from "common/models/expenses";
import {
    deleteExpensesItem,
    getExpensesList,
    getExpensesListTypes,
    getExpensesListVendors,
    getExpensesTotal,
    setExpensesItem,
} from "http/services/expenses.service";
import { AuthUser } from "http/services/auth.service";
import { getKeyValue } from "services/local-storage.service";
import { LS_APP_USER } from "common/constants/localStorage";
import { Contact } from "common/models/contact";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { ListData } from "common/models";
import { ComboBox } from "dashboard/common/form/dropdown";
export const PurchaseExpenses = observer((): ReactElement => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const { id } = useParams();

    const [expensesTypeList, setExpensesTypeList] = useState<ListData[]>([]);
    const [expensesVendorList, setExpensesVendorList] = useState<Contact[]>([]);
    const [expensesList, setExpensesList] = useState<Expenses[]>([]);
    const [currentEditExpense, setCurrentEditExpense] = useState<Expenses>({} as Expenses);
    const [expenseTotal, setExpenseTotal] = useState<string>("$ 0.00");
    const [confirmActive, setConfirmActive] = useState<boolean>(false);
    const [expandedRows, setExpandedRows] = useState<Record<string, any>[]>([]);

    const renderColumnsData: Pick<ColumnProps, "header" | "field">[] = [
        { field: "operationdate", header: "Date" },
        { field: "type_name", header: "Type" },
        { field: "amount_text", header: "Amount" },
        { field: "notbillable", header: "Not Billable" },
        { field: "vendor", header: "Vendor" },
    ];

    const getExpenses = useCallback(() => {
        if (id) {
            getExpensesList(id).then((response) => {
                if (response) {
                    setExpensesList(response);
                }
            });
            getExpensesTotal(id).then(
                (response) => response?.total && setExpenseTotal(response.total)
            );
        }
    }, [id]);

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        setUser(authUser);
    }, []);

    const handleCompareData = useMemo(() => {
        const currentExpense = expensesList.find(
            (item) => item.itemuid === currentEditExpense?.itemuid
        );
        if (currentExpense) {
            const isDataChanged =
                currentExpense.operationdate !== currentEditExpense?.operationdate ||
                currentExpense.type !== currentEditExpense?.type ||
                currentExpense.amount !== currentEditExpense?.amount ||
                currentExpense.vendor !== currentEditExpense?.vendor ||
                currentExpense.comment !== currentEditExpense?.comment ||
                currentExpense.notbillable !== currentEditExpense?.notbillable;
            return !isDataChanged;
        }
        return false;
    }, [expensesList, currentEditExpense]);

    useEffect(() => {
        getExpenses();
        if (user) {
            getExpensesListTypes(user.useruid).then((response) => {
                if (response) {
                    setExpensesTypeList(response);
                }
            });
            getExpensesListVendors(user.useruid).then((response) => {
                if (response) {
                    setExpensesVendorList(response);
                }
            });
        }
    }, [getExpenses, user]);

    const handleClearExpense = () => {
        setCurrentEditExpense({} as Expenses);
    };

    const handleExpenseSubmit = (itemuid?: string) => {
        const expenseData: Partial<Expenses> & { inventoryuid: string } = {
            inventoryuid: id ? id : "",
            operationdate: currentEditExpense?.operationdate || "",
            type: currentEditExpense?.type || 0,
            amount: (currentEditExpense?.amount && currentEditExpense?.amount * 100) || 0,
            vendor: currentEditExpense?.vendor || "",
            comment: currentEditExpense?.comment || "",
            notbillable: currentEditExpense?.notbillable || 0,
        };

        setExpensesItem({ expenseuid: itemuid || "0", expenseData }).then(() => {
            handleClearExpense();
            getExpenses();
        });
    };

    const handleDeleteExpenses = () => {
        currentEditExpense &&
            deleteExpensesItem(currentEditExpense.itemuid).then(() => {
                getExpenses();
                handleClearExpense();
            });
    };

    const deleteTemplate = (expense: Expenses) => {
        return (
            <Button
                type='button'
                icon='icon adms-trash-can'
                tooltip='Delete'
                tooltipOptions={{ showDelay: 300 }}
                className='purchase-expenses__delete-button p-button-text'
                onClick={() => {
                    setCurrentEditExpense(expense);
                    setConfirmActive(true);
                }}
            />
        );
    };

    const handleEditExpenses = (expense: Expenses) => {
        if (expense) {
            setCurrentEditExpense({ ...expense, amount: expense.amount / 100 });
        }
    };

    const rowExpansionTemplate = (data: Expenses) => {
        return (
            <div className='expanded-row'>
                <div className='expanded-row__label'>Notes: </div>
                <div className='expanded-row__text'>{data.comment}</div>
            </div>
        );
    };

    const handleRowExpansionClick = (data: Expenses) => {
        if (expandedRows.includes(data)) {
            setExpandedRows(expandedRows.filter((item) => item !== data));
            return;
        }
        setExpandedRows([...expandedRows, data]);
    };

    return (
        <>
            <div className='grid purchase-expenses'>
                <div className='col-6 grid row-gap-2'>
                    <div className='col-6'>
                        <DateInput
                            name='Date'
                            date={Date.parse(currentEditExpense?.operationdate || "")}
                            onChange={({ value }) =>
                                value &&
                                currentEditExpense &&
                                setCurrentEditExpense({
                                    ...currentEditExpense,
                                    operationdate: String(new Date(`${value}`)),
                                })
                            }
                        />
                    </div>
                    <div className='col-6'>
                        <ComboBox
                            optionLabel='name'
                            optionValue='id'
                            options={expensesTypeList}
                            value={currentEditExpense?.type || 0}
                            onChange={({ value }) =>
                                value &&
                                currentEditExpense &&
                                setCurrentEditExpense({ ...currentEditExpense, type: value })
                            }
                            className='w-full purchase-expenses__dropdown'
                            label='Type'
                        />
                    </div>
                    <div className='col-12'>
                        <ComboBox
                            optionLabel='userName'
                            optionValue='contactuid'
                            filter
                            options={expensesVendorList}
                            value={currentEditExpense?.vendor || ""}
                            onChange={({ value }) =>
                                value &&
                                currentEditExpense &&
                                setCurrentEditExpense({ ...currentEditExpense, vendor: value })
                            }
                            className='w-full purchase-expenses__dropdown'
                            label='Vendor'
                        />
                    </div>
                    <div className='col-6'>
                        <CurrencyInput
                            labelPosition='top'
                            title='Amount'
                            value={currentEditExpense?.amount || 0}
                            onChange={({ value }) =>
                                value &&
                                currentEditExpense &&
                                setCurrentEditExpense({ ...currentEditExpense, amount: value })
                            }
                        />
                    </div>
                    <div className='col-6'>
                        <BorderedCheckbox
                            checked={!!currentEditExpense?.notbillable}
                            onChange={() =>
                                setCurrentEditExpense({
                                    ...currentEditExpense,
                                    notbillable: !currentEditExpense?.notbillable ? 1 : 0,
                                })
                            }
                            name='Not Billable'
                        />
                    </div>
                </div>
                <div className='col-6'>
                    <span className='p-float-label'>
                        <InputTextarea
                            className='purchase-expenses__text-area'
                            value={currentEditExpense?.comment || ""}
                            onChange={({ target: { value } }) =>
                                value &&
                                currentEditExpense &&
                                setCurrentEditExpense({ ...currentEditExpense, comment: value })
                            }
                        />
                        <label className='float-label'>Notes</label>
                    </span>
                </div>
                <div className='purchase-expenses-controls'>
                    {currentEditExpense?.itemuid && (
                        <Button
                            className='purchase-expenses-controls__button'
                            onClick={() => handleClearExpense()}
                            outlined
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        className='purchase-expenses-controls__button'
                        type='button'
                        disabled={handleCompareData}
                        severity={handleCompareData ? "secondary" : "success"}
                        onClick={() => handleExpenseSubmit(currentEditExpense?.itemuid)}
                    >
                        {currentEditExpense?.itemuid ? "Update" : "Save"}
                    </Button>
                </div>
            </div>
            <div className='grid'>
                <div className='col-12'>
                    <DataTable
                        className='mt-6 purchase-expenses__table'
                        value={expensesList}
                        emptyMessage='No expenses yet.'
                        reorderableColumns
                        resizableColumns
                        scrollable
                        rowExpansionTemplate={rowExpansionTemplate}
                        expandedRows={expandedRows}
                        onRowToggle={(e: DataTableRowClickEvent) => setExpandedRows([e.data])}
                        pt={{
                            wrapper: {
                                className: "overflow-x-hidden",
                                style: {
                                    height: "249px",
                                },
                            },
                        }}
                    >
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            body={(options) => {
                                const isRowExpanded = expandedRows.some((item) => {
                                    return item === options;
                                });
                                return (
                                    <div className='flex gap-3 align-items-center'>
                                        <Button
                                            type='button'
                                            icon='icon adms-edit-item'
                                            tooltip='Edit'
                                            tooltipOptions={{ showDelay: 300 }}
                                            className={`purchase-expenses__table-button purchase-expenses__table-button--success p-button-text`}
                                            onClick={() => handleEditExpenses(options)}
                                        />
                                        <Button
                                            type='button'
                                            icon='pi pi-angle-down'
                                            tooltip={
                                                isRowExpanded
                                                    ? "Hide commentary"
                                                    : "Show commentary"
                                            }
                                            tooltipOptions={{ showDelay: 300 }}
                                            disabled={!options?.comment}
                                            className={`purchase-expenses__table-button p-button-text ${
                                                isRowExpanded && "table-button-active"
                                            }`}
                                            onClick={() => handleRowExpansionClick(options)}
                                        />
                                    </div>
                                );
                            }}
                            pt={{
                                root: {
                                    style: {
                                        width: "60px",
                                    },
                                },
                            }}
                        />
                        {renderColumnsData.map(({ field, header }) =>
                            field === "notbillable" ? (
                                <Column
                                    field={field}
                                    header={header}
                                    alignHeader={"left"}
                                    body={(options) => <>{options[field] ? "Yes" : "No"}</>}
                                    key={field}
                                    headerClassName='cursor-move'
                                    className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                                />
                            ) : (
                                <Column
                                    field={field}
                                    header={header}
                                    alignHeader={"left"}
                                    key={field}
                                    headerClassName='cursor-move'
                                    className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                                />
                            )
                        )}

                        <Column
                            body={deleteTemplate}
                            pt={{
                                root: {
                                    style: {
                                        width: "20px",
                                    },
                                },
                            }}
                        />
                    </DataTable>
                </div>
                <div className='col-12 total-sum flex justify-content-end '>
                    <span className='total-sum__label'>Total expenses:</span>
                    <span className='total-sum__value'> {expenseTotal}</span>
                </div>
            </div>
            <ConfirmModal
                visible={confirmActive}
                bodyMessage='Do you really want to delete this expense? 
                This process cannot be undone.'
                confirmAction={handleDeleteExpenses}
                draggable={false}
                rejectLabel='Cancel'
                acceptLabel='Delete'
                className='expenses-confirm-dialog'
                onHide={() => setConfirmActive(false)}
            />
        </>
    );
});
