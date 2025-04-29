import { BaseResponseError, Status } from "common/models/base-response";
import { ReportServiceColumns } from "common/models/reports";
import { TOAST_LIFETIME } from "common/settings";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { useToast } from "dashboard/common/toast";
import { EditAccessDialog } from "dashboard/reports/common/access-dialog";
import { copyReportDocument, deleteReportDocument } from "http/services/reports.service";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { ReactElement, RefObject, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "store/hooks";

interface ReportSelectProps {
    header: string;
    values: ReportServiceColumns[];
    currentItem: ReportServiceColumns | null;
    onItemClick: (item: ReportServiceColumns) => void;
    onItemDoubleClick?: (item: ReportServiceColumns) => void;
    containerRef?: RefObject<HTMLDivElement>;
}

export const ReportSelect = ({
    header,
    values,
    currentItem,
    onItemClick,
    onItemDoubleClick,
    containerRef,
}: ReportSelectProps): ReactElement => {
    return (
        <div className='report-select' ref={containerRef} style={{ overflowY: "auto" }}>
            <span className='report-select__header'>{header}</span>
            <ul className='report-select__list'>
                {values.map((value) => (
                    <li
                        className={`report-select__item ${currentItem === value ? "selected" : ""}`}
                        key={value.data}
                        onClick={() => {
                            onItemClick(value);
                        }}
                        onDoubleClick={() => {
                            onItemDoubleClick?.(value);
                        }}
                    >
                        {value.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface ReportFooterProps {
    onRefetch?: () => void;
}

export const ReportFooter = observer(({ onRefetch }: ReportFooterProps): ReactElement => {
    const reportStore = useStore().reportStore;
    const navigate = useNavigate();
    const { report, saveReport, isReportChanged } = reportStore;
    const toast = useToast();
    const [accessDialogVisible, setAccessDialogVisible] = useState<boolean>(false);
    const [duplicateDialogVisible, setDuplicateDialogVisible] = useState<boolean>(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);

    const handleSaveReport = async () => {
        if (!!report.isdefault) return;
        const response = await saveReport(report?.itemuid);
        if (response) {
            if (response?.status === Status.OK) {
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Custom report is successfully saved!",
                    life: TOAST_LIFETIME,
                });
                const { itemuid } = response as { status: Status.OK; itemuid: string };
                navigate(`/dashboard/reports/${itemuid}`);
                onRefetch?.();
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: response?.error || "Error while saving new custom report",
                    life: TOAST_LIFETIME,
                });
            }
        }
    };

    const handleToastShow = (status: Status, detail: string) => {
        toast.current?.show({
            severity: status === Status.OK ? "success" : "error",
            summary: status === Status.OK ? "Success" : "Error",
            detail: detail,
            life: TOAST_LIFETIME,
        });
    };

    const handleDuplicateReport = async () => {
        if (report?.itemuid) {
            const response = await copyReportDocument(report.itemuid);
            if (response?.status === Status.OK) {
                const { itemuid } = response as { status: Status.OK; itemuid: string };
                navigate(`/dashboard/reports/${itemuid}`);
                onRefetch?.();
                handleToastShow(Status.OK, "Custom report is successfully copied!");
            } else {
                handleToastShow(Status.ERROR, response?.error!);
            }
        }
    };

    const handleDeleteReport = () => {
        report?.itemuid &&
            !report.isdefault &&
            deleteReportDocument(report.itemuid).then((response: BaseResponseError | undefined) => {
                if (response?.status === Status.OK) {
                    navigate("/dashboard/reports/create");
                    handleToastShow(Status.OK, "Custom report is successfully deleted!");
                    onRefetch?.();
                } else {
                    handleToastShow(Status.ERROR, response?.error!);
                }
            });
    };

    return (
        <>
            <div className='report__footer gap-3 mt-8 mr-3'>
                {report.itemuid && (
                    <Button
                        className='report__icon-button'
                        icon='icon adms-password'
                        severity='success'
                        onClick={() => setAccessDialogVisible(true)}
                        outlined
                        tooltip='Edit access'
                        tooltipOptions={{ position: "mouse" }}
                    />
                )}
                {report.itemuid && (
                    <Button
                        className='report__icon-button'
                        icon='icon adms-copy'
                        severity='success'
                        onClick={() => setDuplicateDialogVisible(true)}
                        outlined
                        tooltip='Duplicate report'
                        tooltipOptions={{ position: "mouse" }}
                    />
                )}

                {!report.isdefault && report.itemuid && (
                    <Button
                        className='report__icon-button'
                        icon='icon adms-trash-can'
                        onClick={() => setDeleteDialogVisible(true)}
                        outlined
                        severity='danger'
                        tooltip='Delete report'
                        tooltipOptions={{ position: "mouse" }}
                    />
                )}
                <Button
                    className='ml-auto uppercase px-6 report__button'
                    severity='danger'
                    onClick={() => navigate("/dashboard/reports")}
                    outlined
                >
                    Cancel
                </Button>
                <Button
                    className='uppercase px-6 report__button'
                    disabled={!report.name || !!report.isdefault || !isReportChanged}
                    severity={
                        !report.name || !!report.isdefault || !isReportChanged
                            ? "secondary"
                            : "success"
                    }
                    onClick={handleSaveReport}
                >
                    {report?.itemuid ? "Update" : "Create"}
                </Button>
            </div>
            {report.itemuid && accessDialogVisible && (
                <EditAccessDialog
                    visible={accessDialogVisible}
                    onHide={() => setAccessDialogVisible(false)}
                    reportuid={report.itemuid}
                />
            )}
            {report.itemuid && (
                <ConfirmModal
                    visible={duplicateDialogVisible}
                    position='top'
                    title='Duplicate report?'
                    icon='pi-exclamation-triangle'
                    bodyMessage={`Are you sure you want to duplicate ${report.name} report?`}
                    confirmAction={() => {
                        handleDuplicateReport();
                        setDuplicateDialogVisible(false);
                    }}
                    draggable={false}
                    rejectLabel={"Cancel"}
                    acceptLabel={"Copy"}
                    onHide={() => setDuplicateDialogVisible(false)}
                />
            )}

            {report.itemuid && (
                <ConfirmModal
                    visible={deleteDialogVisible}
                    position='top'
                    title='Are you sure?'
                    icon='pi-exclamation-triangle'
                    bodyMessage={`Are you sure you want to delete ${report.name} report?`}
                    confirmAction={() => {
                        handleDeleteReport();
                        setDeleteDialogVisible(false);
                    }}
                    draggable={false}
                    rejectLabel={"Cancel"}
                    acceptLabel={"Delete"}
                    onHide={() => setDeleteDialogVisible(false)}
                />
            )}
        </>
    );
});
