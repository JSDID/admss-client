import { observer } from "mobx-react-lite";
import { Column, ColumnProps } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ReactElement } from "react";
import "./index.css";
import { useStore } from "store/hooks";
import { InventoryExportWebHistory } from "common/models/inventory";

export const ExportWebHistory = observer((): ReactElement => {
    const store = useStore().inventoryStore;

    const { inventoryExportWebHistory } = store;

    interface TableColumnProps extends ColumnProps {
        field: keyof InventoryExportWebHistory;
    }

    const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
        { field: "created", header: "Date" },
        { field: "servicetype", header: "Service" },
        { field: "listprice", header: "List price" },
        { field: "taskstatus", header: "Status" },
    ];

    return (
        <div className='grid export-web-history row-gap-2'>
            <div className='col-12'>
                <DataTable
                    showGridlines
                    className='mt-6 export-web-history__table'
                    value={inventoryExportWebHistory}
                    emptyMessage='No exports yet.'
                    reorderableColumns
                    resizableColumns
                >
                    {renderColumnsData.map(({ field, header }) => (
                        <Column
                            field={field}
                            header={header}
                            key={field}
                            headerClassName='cursor-move'
                        />
                    ))}
                </DataTable>
            </div>
        </div>
    );
});
