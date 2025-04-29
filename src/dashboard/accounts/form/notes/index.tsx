import { ReactElement, useEffect, useState } from "react";

import "./index.css";
import { Button } from "primereact/button";
import { DataTable, DataTableRowClickEvent, DataTableValue } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import {
    deleteAccountNote,
    listAccountNotes,
    updateAccountNote,
} from "http/services/accounts.service";
import { useParams } from "react-router-dom";
import { AccountNote } from "common/models/accounts";
import { AddNoteDialog } from "./add-note-dialog";
import { useToast } from "dashboard/common/toast";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { useStore } from "store/hooks";
import { AccountNoteData } from "store/stores/account";
import { makeShortReports } from "http/services/reports.service";
import { observer } from "mobx-react-lite";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { NoteEditor } from "dashboard/accounts/form/common";

interface TableColumnProps extends ColumnProps {
    field: keyof AccountNote;
}

const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
    { field: "Date", header: "Date" },
    { field: "NoteBy", header: "Note Taker" },
    { field: "ContactMethod", header: "Contact Type" },
];
export const AccountNotes = observer((): ReactElement => {
    const { id } = useParams();
    const toast = useToast();
    const store = useStore().accountStore;
    const userStore = useStore().userStore;
    const { getNotes, accountNote } = store;
    const { authUser } = userStore;
    const [notesList, setNotesList] = useState<AccountNote[]>([]);
    const [expandedRows, setExpandedRows] = useState<DataTableValue[]>([]);
    const [dialogShow, setDialogShow] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedNote, setSelectedNote] = useState<AccountNote | null>(null);

    const handleGetNotes = async () => {
        const res = await listAccountNotes(id!);

        if (Array.isArray(res)) setNotesList(res);
    };

    useEffect(() => {
        if (id) {
            handleGetNotes();
            getNotes(id);
        }
    }, [id]);

    const handleDeleteNote = async ({ itemuid }: AccountNote) => {
        const res = await deleteAccountNote(itemuid);
        if (res?.status === Status.ERROR) {
            toast.current?.show({
                severity: "error",
                summary: Status.ERROR,
                detail: res.error,
                life: TOAST_LIFETIME,
            });
        } else {
            setModalVisible(false);
            handleGetNotes();
        }
    };

    const rowExpansionTemplate = (data: AccountNote) => {
        return (
            <div className='expanded-row'>
                <div className='expanded-row__label'>Note: </div>
                <div className='expanded-row__text'>{data.Note || ""}</div>
            </div>
        );
    };

    const handleRowExpansionClick = (data: AccountNote) => {
        if (expandedRows.includes(data)) {
            setExpandedRows(expandedRows.filter((item) => item !== data));
            return;
        }
        setExpandedRows([...expandedRows, data]);
    };

    const handleSaveNote = (saveItem: keyof AccountNoteData, value?: string) => {
        id &&
            updateAccountNote(id, { [saveItem]: value ?? accountNote[saveItem] }).then((res) => {
                if (res?.status === Status.ERROR) {
                    toast.current?.show({
                        severity: "error",
                        summary: Status.ERROR,
                        detail: res.error,
                        life: TOAST_LIFETIME,
                    });
                }
            });
    };

    const getShortReports = async (currentData: AccountNote[], print = false) => {
        const columns = renderColumnsData.map((column) => ({
            name: column.header as string,
            data: column.field as string,
        }));
        const date = new Date();
        const name = `account-notes_${
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

    return (
        <div className='account-notes account-card'>
            <h3 className='account-notes__title account-title'>Notes</h3>
            <div className='grid account__body'>
                <div className='col-12 account__control'>
                    <NoteEditor
                        id='account-memo'
                        value={accountNote?.note}
                        label='Account Memo'
                        onSave={() => handleSaveNote("note")}
                        onClear={() => {
                            store.accountNote = { ...accountNote, note: "" };
                            handleSaveNote("note", "");
                        }}
                        onChange={(value) => (store.accountNote = { ...accountNote, note: value })}
                    />
                    <NoteEditor
                        id='account-payment'
                        value={accountNote?.alert}
                        label='Payment Alert'
                        onSave={() => handleSaveNote("alert")}
                        onClear={() => {
                            store.accountNote = { ...accountNote, alert: "" };
                            handleSaveNote("alert", "");
                        }}
                        onChange={(value) => (store.accountNote = { ...accountNote, alert: value })}
                    />
                </div>
                <div className='col-12 mt-5 flex justify-content-end'>
                    <Button
                        className='account-notes__button'
                        outlined
                        onClick={() => {
                            setSelectedNote(null);
                            setDialogShow(true);
                        }}
                    >
                        Add Note
                    </Button>
                </div>
                <div className='col-12'>
                    <DataTable
                        showGridlines
                        className='account__table'
                        value={notesList}
                        emptyMessage='No notes added yet.'
                        reorderableColumns
                        resizableColumns
                        scrollable
                        rowExpansionTemplate={rowExpansionTemplate}
                        expandedRows={expandedRows}
                        onRowToggle={(e: DataTableRowClickEvent) => setExpandedRows([e.data])}
                        scrollHeight='310px'
                        pt={{
                            root: {
                                style: {
                                    minHeight: "15vh",
                                    height: "300px",
                                },
                            },
                            wrapper: {
                                className: "thin-scrollbar",
                            },
                        }}
                    >
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            reorderable={false}
                            resizeable={false}
                            className='account-notes__table-action'
                            body={(options) => {
                                return (
                                    <div className={`flex gap-3 align-items-center`}>
                                        <Button
                                            className='text account-notes__table-button'
                                            icon='icon adms-edit-item'
                                            onClick={() => {
                                                setSelectedNote(options);
                                                setDialogShow(true);
                                            }}
                                        />
                                        <Button
                                            className='text export-web__icon-button'
                                            icon='pi pi-angle-down'
                                            onClick={() => handleRowExpansionClick(options)}
                                        />
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
                        <Column
                            bodyStyle={{ textAlign: "center" }}
                            reorderable={false}
                            resizeable={false}
                            body={(note) => {
                                return (
                                    <div className={`flex gap-3 align-items-center `}>
                                        <Button
                                            outlined
                                            tooltip='Delete note'
                                            className='account-notes__delete-button'
                                            icon='icon adms-trash-can'
                                            text
                                            onClick={() => {
                                                setSelectedNote(note);
                                                setModalVisible(true);
                                            }}
                                        />
                                    </div>
                                );
                            }}
                            pt={{
                                root: {
                                    style: {
                                        width: "40px",
                                        borderLeft: "none",
                                    },
                                },
                            }}
                        />
                    </DataTable>
                </div>
                {!!notesList.length && (
                    <div className='col-12 flex gap-3'>
                        <Button
                            outlined
                            className='account-notes__button'
                            onClick={() => getShortReports(notesList, true)}
                        >
                            Print
                        </Button>
                        <Button
                            outlined
                            className='account-notes__button'
                            onClick={() => getShortReports(notesList, false)}
                        >
                            Download
                        </Button>
                    </div>
                )}
            </div>
            <AddNoteDialog
                action={handleGetNotes}
                visible={dialogShow}
                accountuid={id}
                currentNote={selectedNote}
                onHide={() => setDialogShow(false)}
            />
            <ConfirmModal
                visible={!!modalVisible}
                position='top'
                title='Are you sure?'
                icon='pi-times-circle'
                bodyMessage={
                    "Do you really want to delete this note? This process cannot be undone."
                }
                confirmAction={() => {
                    selectedNote && handleDeleteNote(selectedNote);
                }}
                draggable={false}
                rejectLabel='Cancel'
                acceptLabel='Delete'
                className='note-delete-dialog'
                onHide={() => setModalVisible(false)}
            />
        </div>
    );
});
