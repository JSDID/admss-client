import { BorderedCheckbox, CurrencyInput } from "dashboard/common/form/inputs";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { getInventoryPaymentBack, setInventoryPaymentBack } from "http/services/inventory-service";
import { InventoryPaymentBack } from "common/models/inventory";
import { Status } from "common/models/base-response";
import { Checkbox } from "primereact/checkbox";

interface TableColumnProps extends ColumnProps {
    field: keyof InventoryPaymentBack;
    body?: (rowData: InventoryPaymentBack) => ReactElement;
}

type TableColumnsList = Pick<TableColumnProps, "header" | "field" | "body">;

export const PurchasePayments = observer((): ReactElement => {
    const { id } = useParams();
    const [expensesList, setExpensesList] = useState<InventoryPaymentBack[]>([]);
    const [packsForVehicle, setPacksForVehicle] = useState<number>(0);
    const [defaultExpenses, setDefaultExpenses] = useState<0 | 1>(0);
    const [paid, setPaid] = useState<0 | 1>(0);
    const [salesTaxPaid, setSalesTaxPaid] = useState<0 | 1>(0);
    const [description, setDescription] = useState<string>("");

    const fetchInventoryPaymentBack = async () => {
        if (id) {
            const response = await getInventoryPaymentBack(id);
            if (response) {
                const expenses = response as InventoryPaymentBack;
                setExpensesList([expenses]);
                setPacksForVehicle(expenses.payPack);
                setDefaultExpenses(expenses.payDefaultExpAdded);
                setPaid(expenses.payPaid);
                setSalesTaxPaid(expenses.paySalesTaxPaid);
                setDescription(expenses.payRemarks);
            }
        }
    };

    useEffect(() => {
        fetchInventoryPaymentBack();
    }, [id]);

    const renderColumnsData: TableColumnsList[] = [
        { field: "payPack", header: "Pack for this Vehicle" },
        {
            field: "payDefaultExpAdded",
            header: "Default Expenses",
            body: (rowData: InventoryPaymentBack) => (
                <Checkbox checked={!!rowData.payDefaultExpAdded} readOnly />
            ),
        },
        {
            field: "payPaid",
            header: "Paid",
            body: (rowData: InventoryPaymentBack) => (
                <Checkbox checked={!!rowData.payPaid} readOnly />
            ),
        },
        {
            field: "paySalesTaxPaid",
            header: "Sales Tax Paid",
            body: (rowData: InventoryPaymentBack) => (
                <Checkbox checked={!!rowData.paySalesTaxPaid} readOnly />
            ),
        },
    ];

    const handleSavePayment = async () => {
        const response = await setInventoryPaymentBack(id || "0", {
            payPack: packsForVehicle || 0,
            payDefaultExpAdded: defaultExpenses || 0,
            payPaid: paid || 0,
            paySalesTaxPaid: salesTaxPaid || 0,
            payRemarks: description,
        });
        if (response?.status === Status.OK) fetchInventoryPaymentBack();
    };

    return (
        <>
            <div className='grid purchase-payments row-gap-2'>
                <div className='col-3'>
                    <CurrencyInput
                        labelPosition='top'
                        title='Pack for this Vehicle'
                        value={packsForVehicle}
                        onChange={({ value }) => {
                            setPacksForVehicle(Number(value));
                        }}
                    />
                </div>
                <div className='col-3'>
                    <BorderedCheckbox
                        checked={!!defaultExpenses}
                        onChange={() => setDefaultExpenses(!!defaultExpenses ? 0 : 1)}
                        name='Default Expenses'
                    />
                </div>
                <div className='col-3'>
                    <BorderedCheckbox
                        checked={!!paid}
                        onChange={() => setPaid(!!paid ? 0 : 1)}
                        name='Paid'
                    />
                </div>
                <div className='col-3'>
                    <BorderedCheckbox
                        checked={!!salesTaxPaid}
                        onChange={() => setSalesTaxPaid(!!salesTaxPaid ? 0 : 1)}
                        name='Sales Tax Paid'
                    />
                </div>

                <div className='col-12'>
                    <span className='p-float-label'>
                        <InputTextarea
                            className='purchase-payments__text-area'
                            value={description}
                            onChange={({ target: { value } }) => setDescription(value)}
                        />
                        <label className='float-label'>Description</label>
                    </span>
                </div>

                <Button
                    className='purchase-payments__button'
                    type='button'
                    onClick={handleSavePayment}
                >
                    Save
                </Button>
            </div>
            <div className='grid'>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        className='mt-6 purchase-payments__table'
                        value={expensesList}
                        emptyMessage='No expenses yet.'
                        reorderableColumns
                        resizableColumns
                    >
                        {renderColumnsData.map(({ field, header, body }) => (
                            <Column
                                field={field}
                                header={header}
                                key={field}
                                headerClassName='cursor-move'
                                body={body}
                                pt={{
                                    headerContent: {
                                        className: "justify-content-start",
                                    },
                                }}
                            />
                        ))}
                    </DataTable>
                </div>
                <div className='total-sum'>
                    <span className='total-sum__label'>Total expenses:</span>
                    <span className='total-sum__value'> $ 0.00</span>
                </div>
            </div>
        </>
    );
});
