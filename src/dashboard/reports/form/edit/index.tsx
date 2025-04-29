import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { ReactElement, useEffect, useState } from "react";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "dashboard/common/toast";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";
import { ReportColumnSelect } from "./column-select";
import { MultiSelect } from "primereact/multiselect";
import { ReportCollection, ReportCollections } from "common/models/reports";
import { selectedItemTemplate } from "dashboard/reports/common/panel-content";
import { DashboardDialog } from "dashboard/common/dialog";
import { DateInput } from "dashboard/common/form/inputs";
import { DIALOG_ACTION, reportDownloadForm } from "dashboard/reports/common/report-parameters";
import { validateDates } from "common/helpers";
import { useDateRange } from "common/hooks";

export const ReportEditForm = observer((): ReactElement => {
    const navigate = useNavigate();
    const store = useStore().reportStore;
    const { id } = useParams();
    const {
        report,
        reportName,
        reportColumns,
        reportCollections,
        customCollections,
        getReport,
        changeReport,
    } = store;
    const toast = useToast();
    const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
    const [dialogAction, setDialogAction] = useState<DIALOG_ACTION>(DIALOG_ACTION.PREVIEW);
    const { startDate, endDate, handleDateChange } = useDateRange();
    const [dateError, setDateError] = useState<string>("");

    useEffect(() => {
        id &&
            getReport(id).then((response) => {
                if (response?.status === Status.ERROR) {
                    toast.current?.show({
                        severity: "error",
                        summary: Status.ERROR,
                        detail: response?.error || "Error while fetching report",
                        life: TOAST_LIFETIME,
                    });
                    navigate(`/dashboard/reports`);
                }
            });
        return () => {
            store.reportName = "";
            store.report = {};
        };
    }, [id]);

    useEffect(() => {
        if (startDate && endDate) {
            const validation = validateDates(Number(startDate), Number(endDate));
            setDateError(validation.isValid ? "" : validation.error || "");
        } else {
            setDateError("");
        }
    }, [startDate, endDate]);

    const handleActionClick = async (action: DIALOG_ACTION) => {
        if (report.AskForStartAndEndDates) {
            setDialogAction(action);
            setIsDialogVisible(true);
        } else {
            if (!!dateError) return;
            const response = await reportDownloadForm({
                action,
                columns: reportColumns,
                from_date: startDate,
                to_date: endDate,
                ...report,
            });
            if (response && response.status === Status.ERROR) {
                toast.current?.show({
                    severity: "error",
                    summary: Status.ERROR,
                    detail: response.error || "Error while downloading report",
                    life: TOAST_LIFETIME,
                });
            }
        }
    };

    const getAllCollections = () => {
        const allCollections: Partial<ReportCollection>[] = [];
        customCollections.forEach((collection) => {
            allCollections.push(collection);

            if (collection.collections) {
                collection.collections.forEach((subCollection) => {
                    allCollections.push(subCollection);
                });
            }
        });
        const result = allCollections.map((collection) => ({
            collectionuid: collection.itemUID,
            name: collection.name,
        }));
        return result;
    };

    return (
        <div className='col-8 report-form'>
            <div className='report-form__header uppercase'>
                {report.isdefault ? "View" : id ? "Edit" : "New"} report
            </div>
            <div className='report-form__control grid'>
                <div className={report && id ? "report-form__input" : "col-6"}>
                    <span className='p-float-label'>
                        <InputText
                            className='w-full'
                            disabled={!!report.isdefault}
                            value={report?.name || reportName}
                            onChange={(e) => changeReport("name", e.target.value)}
                        />
                        <label className='float-label w-full'>Name</label>
                    </span>
                </div>
                <div className={report && id ? "report-form__input" : "col-6"}>
                    <span className='p-float-label'>
                        <MultiSelect
                            filter
                            optionLabel='name'
                            options={getAllCollections()}
                            className='w-full edit-collection__multiselect'
                            selectedItemTemplate={selectedItemTemplate}
                            maxSelectedLabels={4}
                            showSelectAll={false}
                            value={reportCollections}
                            onChange={(e) => {
                                e.stopPropagation();
                                store.isReportChanged = true;
                                store.reportCollections = e.value as ReportCollections[];
                            }}
                            pt={{
                                wrapper: {
                                    className: "edit-collection__multiselect-wrapper",
                                    style: {
                                        maxHeight: "550px",
                                    },
                                },
                            }}
                        />
                        <label className='float-label'>Collection</label>
                    </span>
                </div>
                {report && id && (
                    <div className='col-2 report-form__buttons'>
                        <Button
                            className='report__button'
                            onClick={() => handleActionClick(DIALOG_ACTION.PREVIEW)}
                            icon='icon adms-preview'
                            disabled={!report.name}
                            severity={!report.name ? "secondary" : "success"}
                        />
                        <Button
                            className='report__button'
                            icon='icon adms-download'
                            onClick={() => handleActionClick(DIALOG_ACTION.DOWNLOAD)}
                            disabled={!report.name}
                            severity={!report.name ? "secondary" : "success"}
                        />
                    </div>
                )}
            </div>

            <div className='report-form__body grid'>
                <ReportColumnSelect />

                <div className='splitter col-12'>
                    <h3 className='splitter__title m-0 pr-3'>Report options</h3>
                    <hr className='splitter__line flex-1' />
                </div>

                <div className='col-3'>
                    <label className='cursor-pointer report-control__checkbox'>
                        <Checkbox
                            checked={!!report.ShowTotals}
                            disabled={!!report.isdefault}
                            onChange={() => {
                                changeReport("ShowTotals", !report.ShowTotals ? 1 : 0);
                            }}
                        />
                        Show Totals
                    </label>
                </div>
                <div className='col-3'>
                    <label className='cursor-pointer report-control__checkbox'>
                        <Checkbox
                            checked={!!report.ShowAverages}
                            disabled={!!report.isdefault}
                            onChange={() => {
                                changeReport("ShowAverages", !report.ShowAverages ? 1 : 0);
                            }}
                        />
                        Show Averages
                    </label>
                </div>
                <div className='col-3'>
                    <label className='cursor-pointer report-control__checkbox'>
                        <Checkbox
                            checked={!!report.ShowLineCount}
                            disabled={!!report.isdefault}
                            onChange={() => {
                                changeReport("ShowLineCount", !report.ShowLineCount ? 1 : 0);
                            }}
                        />
                        Show Line Count
                    </label>
                </div>

                <div className='splitter col-12'>
                    <h3 className='splitter__title m-0 pr-3'>Report parameters</h3>
                    <hr className='splitter__line flex-1' />
                </div>

                <div className='col-4'>
                    <label className='cursor-pointer report-control__checkbox'>
                        <Checkbox
                            checked={!!report.AskForStartAndEndDates}
                            disabled={!!report.isdefault}
                            onChange={() => {
                                changeReport(
                                    "AskForStartAndEndDates",
                                    !report.AskForStartAndEndDates ? 1 : 0
                                );
                            }}
                        />
                        Ask for Start and End Dates
                    </label>
                </div>
            </div>

            <DashboardDialog
                visible={isDialogVisible}
                position='top'
                onHide={() => setIsDialogVisible(false)}
                action={() =>
                    reportDownloadForm({
                        action: dialogAction,
                        columns: report.columns,
                        from_date: startDate,
                        to_date: endDate,
                        ...report,
                    })
                }
                header='Parameters'
                className='report-parameters-dialog'
                buttonDisabled={
                    !startDate || !endDate || !!dateError || !report.AskForStartAndEndDates
                }
                footer='Send'
            >
                <DateInput
                    name='Start Date'
                    date={startDate}
                    className={`${dateError ? "p-invalid" : ""} w-full`}
                    emptyDate
                    onChange={({ value }) => handleDateChange(Number(value), true)}
                />
                <DateInput
                    name='End Date'
                    date={endDate}
                    className={`${dateError ? "p-invalid" : ""} w-full`}
                    emptyDate
                    minDate={startDate ? new Date(Number(startDate)) : undefined}
                    onChange={({ value }) => handleDateChange(Number(value), false)}
                />
            </DashboardDialog>
        </div>
    );
});
