import { ReactElement, useEffect, useState } from "react";
import { Column, ColumnProps } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useParams } from "react-router-dom";
import { listInsuranceHistory } from "http/services/accounts.service";
import { AccountInsurance } from "common/models/accounts";

interface TableColumnProps extends ColumnProps {
    field: keyof AccountInsurance;
}

const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
    { field: "Insurance_Eff_Date", header: "Date" },
    { field: "Insurance_Notes", header: "Note Taker" },
    { field: "Insurance_Company", header: "Insurance Company" },
    { field: "Insurance_Agent_Name", header: "Insurance Agent" },
    { field: "Insurance_Policy_Number", header: "Policy#" },
];

export const AccountInsuranceHistory = (): ReactElement => {
    const { id } = useParams();
    const [insuranceHistoryList, setInsuranceHistoryList] = useState<AccountInsurance[]>([]);

    useEffect(() => {
        if (id) {
            listInsuranceHistory(id).then((res) => {
                if (Array.isArray(res) && res.length) setInsuranceHistoryList(res);
            });
        }
    }, [id]);

    return (
        <DataTable
            showGridlines
            className='insurance-history-table mt-3'
            value={insuranceHistoryList}
            emptyMessage='No history added yet.'
            reorderableColumns
            resizableColumns
            scrollable
        >
            {renderColumnsData.map(({ field, header }) => (
                <Column
                    field={field}
                    header={header}
                    alignHeader={"left"}
                    key={field}
                    headerClassName='cursor-move'
                    className='max-w-16rem overflow-hidden text-overflow-ellipsis'
                />
            ))}
        </DataTable>
    );
};
