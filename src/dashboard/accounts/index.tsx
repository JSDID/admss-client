import React, { useEffect, useState } from "react";
import { AuthUser } from "http/services/auth.service";
import { DatatableQueries, initialDataTableQueries } from "common/models/datatable-queries";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DataTablePageEvent, DataTableSortEvent } from "primereact/datatable";
import { getKeyValue } from "services/local-storage.service";
import { getAccountsList } from "http/services/accounts.service";

export default function Accounts() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [authUser, setUser] = useState<AuthUser | null>(null);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [globalSearch, setGlobalSearch] = useState<string>("");
    const [lazyState, setLazyState] = useState<DatatableQueries>(initialDataTableQueries);

    const printTableData = () => {
        const contactsDoc = new jsPDF();
        autoTable(contactsDoc, { html: ".p-datatable-table" });
        contactsDoc.output("dataurlnewwindow");
    };

    const pageChanged = (event: DataTablePageEvent) => {
        setLazyState(event);
    };

    const sortData = (event: DataTableSortEvent) => {
        setLazyState(event);
    };

    useEffect(() => {
        const authUser: AuthUser = getKeyValue("admss-client-app-user");
        if (authUser) {
            setUser(authUser);
            getAccountsList(authUser.useruid, { total: 1 }).then((response) => {});
        }
    }, []);

    return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card'>
                    <div className='card-header'>
                        <h2 className='card-header__title uppercase m-0'>Accounts</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
