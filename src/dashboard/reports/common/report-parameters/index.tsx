import { formatDateForServer } from "common/helpers";
import { useDateRange } from "common/hooks";
import { BaseResponseError, Status } from "common/models/base-response";
import { ReportDocument, ReportSetParams } from "common/models/reports";
import { TOAST_LIFETIME } from "common/settings";
import { DateInput } from "dashboard/common/form/inputs";
import { useToast } from "dashboard/common/toast";
import { setReportDocumentTemplate } from "http/services/reports.service";
import { Button } from "primereact/button";
import { ReactElement } from "react";

interface ReportParametersProps {
    report: ReportDocument;
    handleClosePanel?: () => void;
}

export enum DIALOG_ACTION {
    PREVIEW = "preview",
    DOWNLOAD = "download",
}

interface reportDownloadFormParams extends Partial<Omit<ReportSetParams, "from_date" | "to_date">> {
    action: DIALOG_ACTION;
    from_date?: string | number;
    to_date?: string | number;
}

export const reportDownloadForm = async (
    params: reportDownloadFormParams,
    withDate: boolean = false
): Promise<BaseResponseError | undefined> => {
    const payload: ReportSetParams = {
        itemUID: params.itemUID || "0",
        timestamp_s: formatDateForServer(new Date()),
        columns: params.columns,
    };

    if (!!params.AskForStartAndEndDates || withDate) {
        payload.from_date = params.from_date ? formatDateForServer(new Date(params.from_date)) : "";
        payload.to_date = params.to_date ? formatDateForServer(new Date(params.to_date)) : "";
    }

    const response = await setReportDocumentTemplate(params.itemUID || "0", payload);

    if (!response || response.status === Status.ERROR) {
        return response;
    }

    const url = new Blob([response], { type: "application/pdf" });
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(url);
    if (params.action === DIALOG_ACTION.DOWNLOAD) {
        link.download = `report_form_${params.name}.pdf`;
        link.click();
    } else {
        window.open(
            link.href,
            "_blank",
            "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=1280,height=720"
        );
    }
};

export const ReportParameters = ({
    report,
    handleClosePanel,
}: ReportParametersProps): ReactElement => {
    const toast = useToast();
    const { startDate, endDate, isButtonDisabled, handleDateChange } = useDateRange();

    const handleCloseClick = () => {
        handleClosePanel?.();
    };

    const handleDownloadForm = async (download: boolean = false) => {
        const response = await reportDownloadForm(
            {
                action: download ? DIALOG_ACTION.DOWNLOAD : DIALOG_ACTION.PREVIEW,
                from_date: startDate,
                to_date: endDate,
                ...report,
            },
            true
        );
        if (response && response.status === Status.ERROR) {
            toast.current?.show({
                severity: "error",
                summary: Status.ERROR,
                detail: response.error || "Error while downloading report",
                life: TOAST_LIFETIME,
            });
        }
    };

    return (
        <div className='report-parameters'>
            <h3 className='report-parameters__title'>Parameters</h3>
            {handleClosePanel && (
                <Button
                    icon='pi pi-times'
                    className='p-button close-button'
                    onClick={handleCloseClick}
                />
            )}
            <div className='grid report-parameters__form mt-3'>
                <DateInput
                    name='Start Date'
                    colWidth={3}
                    date={startDate}
                    emptyDate
                    onChange={({ value }) => handleDateChange(Number(value), true)}
                />
                <DateInput
                    name='End Date'
                    colWidth={3}
                    date={endDate}
                    emptyDate
                    minDate={startDate ? new Date(Number(startDate)) : undefined}
                    onChange={({ value }) => handleDateChange(Number(value), false)}
                />
                <div className='col-12 flex justify-content-end gap-3'>
                    <Button
                        className='edit-collection__button'
                        disabled={isButtonDisabled}
                        severity={isButtonDisabled ? "secondary" : "success"}
                        type='button'
                        outlined
                        onClick={() => handleDownloadForm()}
                    >
                        Preview
                    </Button>
                    <Button
                        className='edit-collection__button'
                        disabled={isButtonDisabled}
                        severity={isButtonDisabled ? "secondary" : "success"}
                        type='button'
                        outlined
                        onClick={() => handleDownloadForm(true)}
                    >
                        Download
                    </Button>
                </div>
            </div>
        </div>
    );
};
