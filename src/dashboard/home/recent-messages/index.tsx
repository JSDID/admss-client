import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { useToast } from "dashboard/common/toast";
import { SupportHistoryDialog } from "dashboard/profile/supportHistory";
import { getSupportMessages, SupportHistory } from "http/services/support.service";
import { Button } from "primereact/button";
import { Column, ColumnProps } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ReactElement, useEffect, useState } from "react";
import { useStore } from "store/hooks";
import "./index.css";

interface TableColumnProps extends ColumnProps {
    field: keyof SupportHistory;
}

const renderColumnsData: Pick<TableColumnProps, "header" | "field">[] = [
    { field: "username", header: "From" },
    { field: "topic", header: "Theme" },
    { field: "created", header: "Date" },
];

interface RecentMessagesProps {
    messagesShowCount?: number;
}

export const RecentMessages = ({ messagesShowCount = 2 }: RecentMessagesProps): ReactElement => {
    const store = useStore().userStore;
    const { authUser } = store;
    const toast = useToast();
    const [dialogActive, setDialogActive] = useState<boolean>(false);
    const [supportHistoryData, setSupportHistoryData] = useState<SupportHistory[]>([]);

    useEffect(() => {
        if (authUser) {
            getSupportMessages(authUser.useruid, { top: messagesShowCount, type: "desc" }).then(
                (response) => {
                    if (Array.isArray(response)) {
                        setSupportHistoryData(response);
                    } else {
                        response?.error &&
                            toast.current?.show({
                                severity: "error",
                                summary: Status.ERROR,
                                detail: response.error,
                                life: TOAST_LIFETIME,
                            });
                    }
                }
            );
        }
    }, [authUser]);

    return (
        <div className='card h-full'>
            <div className='card-header'>
                <h2 className='card-header__title uppercase m-0'>Recent messages</h2>
            </div>
            <div className='card-content'>
                <DataTable
                    value={supportHistoryData}
                    emptyMessage='No messages found'
                    className='table-message'
                >
                    {renderColumnsData?.map(({ field, header }) => (
                        <Column
                            field={field}
                            header={header}
                            key={field}
                            body={(data: SupportHistory) => {
                                if (field === "topic") {
                                    return (
                                        <div
                                            className='white-space-nowrap 
                                            overflow-hidden 
                                            text-overflow-ellipsis 
                                            max-w-8rem'
                                        >
                                            {data[field]}
                                        </div>
                                    );
                                }
                                return data[field];
                            }}
                            headerClassName='cursor-default'
                        />
                    ))}
                </DataTable>
                {!!supportHistoryData.length && (
                    <div className='card-content__footer'>
                        <Button
                            onClick={() => setDialogActive(true)}
                            className='underline messages-more'
                            text
                        >
                            See more...
                        </Button>
                    </div>
                )}
            </div>
            {authUser && (
                <SupportHistoryDialog
                    onHide={() => setDialogActive(false)}
                    visible={dialogActive}
                />
            )}
        </div>
    );
};
