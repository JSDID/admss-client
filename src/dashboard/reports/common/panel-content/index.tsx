import { Status } from "common/models/base-response";
import { ReportCollection, ReportDocument } from "common/models/reports";
import { TOAST_LIFETIME } from "common/settings";
import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { TextInput } from "dashboard/common/form/inputs";
import { useToast } from "dashboard/common/toast";
import { deleteReportCollection } from "http/services/reports.service";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { ReactElement, useState, useEffect, useMemo } from "react";

interface CollectionPanelContentProps {
    collectionName: string;
    collectionuid?: string;
    collections: ReportCollection[];
    selectedReports: ReportDocument[];
    setCollectionName: (name: string) => void;
    setSelectedReports: (reports: ReportDocument[]) => void;
    handleCreateCollection: () => void;
    handleClosePanel?: () => void;
}

export const selectedItemTemplate = (item: ReportDocument): ReactElement => {
    return <span className='multiselect-label'>{item?.name || ""}</span>;
};

export const CollectionPanelContent = ({
    collectionName,
    collectionuid,
    collections,
    selectedReports,
    setCollectionName,
    setSelectedReports,
    handleCreateCollection,
    handleClosePanel,
}: CollectionPanelContentProps): ReactElement => {
    const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
    const [collectionNameInput, setCollectionNameInput] = useState<string>(collectionName);
    const [confirmMessage, setConfirmMessage] = useState<string>("");
    const [confirmTitle, setConfirmTitle] = useState<string>("");
    const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {});
    const toast = useToast();
    const [initialCollectionName, setInitialCollectionName] = useState<string>(collectionName);
    const [initialSelectedReports, setInitialSelectedReports] =
        useState<ReportDocument[]>(selectedReports);
    const [panelSelectedReports, setPanelSelectedReports] =
        useState<ReportDocument[]>(selectedReports);

    useEffect(() => {
        setInitialCollectionName(collectionName);
        setInitialSelectedReports(selectedReports);
        if (!collectionuid) {
            setCollectionNameInput("");
            setPanelSelectedReports([]);
        }
    }, [collectionuid]);

    const handleCreateCollectionClick = () => {
        if (collectionNameInput) {
            handleCreateCollection();
            setCollectionNameInput("");
            setPanelSelectedReports([]);
        }
    };

    const reportsAreEqual = (reports1: ReportDocument[], reports2: ReportDocument[]) => {
        if (reports1.length !== reports2.length) return false;
        const sorted1 = [...reports1].sort((a, b) => a.itemUID.localeCompare(b.itemUID));
        const sorted2 = [...reports2].sort((a, b) => a.itemUID.localeCompare(b.itemUID));
        return sorted1.every((item, idx) => item.itemUID === sorted2[idx].itemUID);
    };

    const handleDeleteCollection = () => {
        collectionuid &&
            deleteReportCollection(collectionuid).then((response) => {
                if (response?.status === Status.ERROR) {
                    toast.current?.show({
                        severity: "error",
                        summary: Status.ERROR,
                        detail: response?.error,
                        life: TOAST_LIFETIME,
                    });
                } else {
                    handleClosePanel?.();
                    setCollectionNameInput("");
                }
            });
    };

    const handleCloseClick = () => {
        if (isUpdateDisabled) {
            handleClosePanel?.();
        } else {
            setConfirmTitle("Quit Editing?");
            setConfirmMessage(
                "Are you sure you want to cancel editing? All unsaved data will be lost."
            );
            setConfirmAction(() => handleClosePanel!);
            setIsConfirmVisible(true);
        }
    };

    const handleDeleteClick = () => {
        setConfirmTitle("Delete Collection?");
        setConfirmMessage("Are you sure you want to delete this collection?");
        setConfirmAction(() => handleDeleteCollection);
        setIsConfirmVisible(true);
    };

    const isUpdateDisabled = useMemo(() => {
        return (
            !collectionNameInput ||
            (collectionNameInput === initialCollectionName &&
                reportsAreEqual(panelSelectedReports, initialSelectedReports))
        );
    }, [collectionNameInput, initialCollectionName, panelSelectedReports, initialSelectedReports]);

    return (
        <>
            <h3 className='edit-collection__title'>
                {collectionuid ? "Edit" : "Add new"} collection
            </h3>
            {handleClosePanel && (
                <Button
                    icon='pi pi-times'
                    className='p-button close-button'
                    onClick={handleCloseClick}
                />
            )}
            <div className='grid edit-collection__form mt-3'>
                <TextInput
                    name='Collection name'
                    colWidth={4}
                    height={50}
                    value={collectionNameInput}
                    onChange={(e) => {
                        setCollectionNameInput(e.target.value);
                        setCollectionName(e.target.value);
                    }}
                />
                <div className='col-8'>
                    <span className='p-float-label'>
                        <MultiSelect
                            dataKey='documentUID'
                            filter
                            optionLabel='name'
                            options={[...collections].filter((collection) => collection.documents)}
                            optionGroupChildren='documents'
                            optionGroupLabel='name'
                            className='w-full edit-collection__multiselect'
                            selectedItemTemplate={(item) => {
                                return selectedItemTemplate(item);
                            }}
                            maxSelectedLabels={4}
                            placeholder='Select reports'
                            showSelectAll={false}
                            value={panelSelectedReports || selectedReports}
                            onChange={(e) => {
                                e.stopPropagation();
                                setPanelSelectedReports(e.value);
                                setSelectedReports(e.value);
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
                        <label className='float-label'>Select reports</label>
                    </span>
                </div>
                <div className='col-12 flex justify-content-end gap-3'>
                    {collectionuid && (
                        <Button
                            className='edit-collection__button'
                            type='button'
                            severity='danger'
                            outlined
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </Button>
                    )}
                    <Button
                        className='edit-collection__button'
                        disabled={isUpdateDisabled}
                        severity={isUpdateDisabled ? "secondary" : "success"}
                        type='button'
                        onClick={handleCreateCollectionClick}
                        outlined
                    >
                        {collectionuid ? "Update" : "Create"}
                    </Button>
                </div>
            </div>
            <ConfirmModal
                visible={!!isConfirmVisible}
                title={confirmTitle}
                icon='pi-exclamation-triangle'
                bodyMessage={confirmMessage}
                confirmAction={confirmAction}
                draggable={false}
                rejectLabel='Cancel'
                acceptLabel='Confirm'
                className='schedule-confirm-dialog'
                onHide={() => setIsConfirmVisible(false)}
            />
        </>
    );
};
