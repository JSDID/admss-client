import "./index.css";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useStore } from "store/hooks";
import { CATEGORIES } from "common/constants/media-categories";
import { Loader } from "dashboard/common/loader";
import { InputTextarea } from "primereact/inputtextarea";
import { useToast } from "dashboard/common/toast";
import { MediaLinkRowExpansionTemplate } from "./link-item";
import { MediaItem, UploadMediaLink } from "common/models/inventory";
import { DataTable, DataTableRowClickEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Status } from "common/models/base-response";
import { AxiosError } from "axios";

enum DIRECTION {
    UP = "up",
    DOWN = "down",
}

const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const LinksMedia = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const toast = useToast();
    const [expandedRows, setExpandedRows] = useState<MediaItem[]>([]);
    const [isUrlValid, setIsUrlValid] = useState(true);
    const {
        saveInventoryLinks,
        uploadFileLinks,
        links,
        isLoading,
        fetchLinks,
        clearMedia,
        formErrorMessage,
        removeMedia,
        changeInventoryLinksOrder,
    } = store;

    useEffect(() => {
        fetchLinks();

        return () => {
            clearMedia();
        };
    }, []);

    useEffect(() => {
        if (formErrorMessage) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: formErrorMessage,
            });
        }
    }, [formErrorMessage, toast]);

    const handleCategorySelect = (e: DropdownChangeEvent) => {
        store.uploadFileLinks = {
            ...store.uploadFileLinks,
            contenttype: e.target.value,
        };
    };

    const handleCommentaryChange = (e: ChangeEvent<HTMLInputElement>) => {
        store.uploadFileLinks = {
            ...store.uploadFileLinks,
            notes: e.target.value,
        };
    };

    const handleUrlChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const url = e.target.value;
        const isValid = url ? isValidUrl(url) : true;
        setIsUrlValid(isValid);

        store.uploadFileLinks = {
            ...uploadFileLinks,
            mediaurl: url,
        };
    };

    const handleUploadLink = () => {
        if (formErrorMessage) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: formErrorMessage,
            });
            return;
        }

        saveInventoryLinks();
    };

    const handleCopyLink = (url: string) => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "URL copied to clipboard",
                });
            })
            .catch(() => {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to copy URL",
                });
            });
    };

    const handleNavigateToLink = (url: string) => {
        if (url) {
            window.open(url, "_blank");
        } else {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Invalid URL",
            });
        }
    };

    const handleDeleteLink = async (link: MediaItem) => {
        try {
            await removeMedia(link.itemuid, () => {});
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Link deleted successfully",
            });
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete link",
            });
        }
    };

    const handleRowExpansionClick = (data: MediaItem) => {
        const index = expandedRows.findIndex((item) => item.itemuid === data.itemuid);
        if (index === -1) {
            setExpandedRows([...expandedRows, data]);
        } else {
            const newExpandedRows = [...expandedRows];
            newExpandedRows.splice(index, 1);
            setExpandedRows(newExpandedRows);
        }
    };

    const handleChangeOrder = async (link: MediaItem, direction: DIRECTION) => {
        const order = link.info?.order ?? 0;
        const newOrder = direction === DIRECTION.UP ? (order === 0 ? 0 : order - 1) : order + 1;
        try {
            const response = await changeInventoryLinksOrder({
                itemuid: link.itemuid,
                order: newOrder,
            });
            if (response?.status === Status.OK) {
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Link order updated successfully",
                });
                await fetchLinks();
            } else {
                Promise.reject(response?.error);
            }
        } catch (error) {
            const err = error as AxiosError;
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: err?.message || "Failed to update link order",
            });
        }
    };

    const rowExpansionTemplate = (data: MediaItem) => {
        return (
            <MediaLinkRowExpansionTemplate
                notes={data.info?.notes}
                contenttype={data.info?.contenttype}
            />
        );
    };

    const actionColumnTemplate = (rowData: MediaItem) => {
        const mediaUrl = (rowData.info as UploadMediaLink)?.mediaurl || "";
        return (
            <div className='media-links__action-row'>
                <Button
                    tooltip='Open'
                    type='button'
                    className='inventory-links__navigate-button'
                    icon='adms-open'
                    text
                    onClick={() => handleNavigateToLink(mediaUrl)}
                />
                <Button
                    tooltip='Copy'
                    type='button'
                    className='inventory-links__copy-button'
                    icon='adms-copy'
                    text
                    onClick={() => handleCopyLink(mediaUrl)}
                />
                <Button
                    tooltip='Delete'
                    type='button'
                    className='inventory-links__delete-button'
                    icon='adms-trash-can'
                    text
                    onClick={() => handleDeleteLink(rowData)}
                />
            </div>
        );
    };

    const numberColumnTemplate = (rowData: MediaItem, { rowIndex }: { rowIndex: number }) => {
        return (
            <div className='media-links__expand-row'>
                <span className='media-links__number'>{rowIndex + 1}</span>
                <Button
                    tooltip='Expand'
                    type='button'
                    className={`inventory-links__expand-button ${
                        expandedRows.includes(rowData)
                            ? "inventory-links__expand-button--rotate"
                            : ""
                    }`}
                    icon='pi pi-angle-down'
                    text
                    onClick={() => handleRowExpansionClick(rowData)}
                />
            </div>
        );
    };

    const handleRowToggle = (e: DataTableRowClickEvent) => {
        setExpandedRows(e.data as MediaItem[]);
    };

    const linkControlTemplate = (rowData: MediaItem, { rowIndex }: { rowIndex: number }) => {
        const isFirst = rowIndex === 0;
        const isLast = rowIndex === links.length - 1;
        return (
            <div className='link-control p-0 flex justify-content-center'>
                <Button
                    icon='pi pi-arrow-circle-up'
                    type='button'
                    rounded
                    text
                    severity={isFirst ? "secondary" : "success"}
                    tooltip='Up'
                    className='p-button-text link-control__button'
                    disabled={isFirst}
                    onClick={() => handleChangeOrder(rowData, DIRECTION.UP)}
                />
                <Button
                    icon='pi pi-arrow-circle-down'
                    type='button'
                    rounded
                    text
                    severity={isLast ? "secondary" : "success"}
                    disabled={isLast}
                    tooltip='Down'
                    className='p-button-text link-control__button'
                    onClick={() => handleChangeOrder(rowData, DIRECTION.DOWN)}
                />
            </div>
        );
    };

    return (
        <div className='media-links grid'>
            {isLoading && <Loader overlay />}
            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        className='media-links__textarea w-full'
                        value={uploadFileLinks?.mediaurl || ""}
                        onChange={handleUrlChange}
                    />
                    <label htmlFor='link'>URL</label>
                </span>
            </div>

            <div className='col-12 mt-2 media-input'>
                <Dropdown
                    className='media-input__dropdown'
                    placeholder='Category'
                    optionLabel={"name"}
                    optionValue={"id"}
                    options={[...CATEGORIES]}
                    value={uploadFileLinks?.contenttype || 0}
                    onChange={handleCategorySelect}
                />
                <InputText
                    className='media-input__text'
                    placeholder='Comment'
                    value={uploadFileLinks?.notes || ""}
                    onChange={handleCommentaryChange}
                />
                <Button
                    type='button'
                    disabled={isLoading || !isUrlValid || !uploadFileLinks?.mediaurl}
                    tooltip={!isUrlValid ? "Please enter a valid URL" : ""}
                    tooltipOptions={{ showOnDisabled: true, position: "mouse" }}
                    severity={!isUrlValid ? "secondary" : "success"}
                    className='p-button media-input__button'
                    onClick={handleUploadLink}
                >
                    Save
                </Button>
            </div>
            <div className='media-links mt-4 col-12'>
                <div className='inventory-content w-full'>
                    {links.length ? (
                        <DataTable
                            value={links}
                            rowExpansionTemplate={rowExpansionTemplate}
                            expandedRows={expandedRows}
                            onRowToggle={handleRowToggle}
                            className='media-links-table'
                        >
                            <Column body={linkControlTemplate} />
                            <Column header='#' body={numberColumnTemplate} />
                            <Column field='info.mediaurl' header='URL' style={{ width: "70%" }} />
                            <Column body={actionColumnTemplate} />
                        </DataTable>
                    ) : (
                        <div className='media-links__empty'>No links added yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
});
