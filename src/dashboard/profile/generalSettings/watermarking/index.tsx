import "./index.css";
import { ReactElement, useEffect, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { useStore } from "store/hooks";
import { WatermarkPostProcessing } from "common/models/general-settings";
import { observer } from "mobx-react-lite";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import {
    limitations,
    chooseTemplate,
    itemTemplate,
    emptyTemplate,
} from "dashboard/profile/generalSettings/watermarking/common";
import { Status } from "common/models/base-response";
import { ImagePreview } from "dashboard/profile/generalSettings/watermarking/preview";

export const SettingsWatermarking = observer((): ReactElement => {
    const store = useStore().generalSettingsStore;
    const {
        settings,
        changeSettings,
        watermarkImage,
        watermarkImageUrl,
        postProcessing,
        getPostProcessing,
        getWatermarkImage,
        changePostProcessing,
        restoreDefaultSettings,
    } = store;
    const fileUploadRef = useRef<FileUpload>(null);
    const toast = useToast();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        getPostProcessing();
        if (settings?.logomediauid) {
            getWatermarkImage();
        }
    }, [settings?.logomediauid]);

    useEffect(() => {
        if (watermarkImage && watermarkImage?.size) {
            store.watermarkImageUrl = URL.createObjectURL(watermarkImage);
        }
    }, [watermarkImage]);

    const handleDeletePostProcessing = (index: number) => {
        const newTextBlocks = postProcessing.filter((_, i) => i !== index);
        changePostProcessing(newTextBlocks);
    };

    const handleUpdatePostProcessing = (index: number) => {
        const newTextBlocks = [...postProcessing];
        newTextBlocks[index] = {
            id: postProcessing[index]?.id || 0,
            ppText: "",
            fontName: "",
            fontSize: 0,
            posX: 0,
            posY: 0,
            ppPattern: "",
            fontColor: 0,
            bkColor: 0,
            useruid: postProcessing[index]?.useruid || "",
        } as WatermarkPostProcessing;
        changePostProcessing(newTextBlocks);
    };

    const handleCreateNewPostProcessing = () => {
        const newTextBlock: Partial<WatermarkPostProcessing> = {
            id: postProcessing.length,
            ppText: "",
            fontName: "",
            fontSize: 0,
            posX: 0,
            posY: 0,
            ppPattern: "",
            fontColor: 0,
            bkColor: 0,
            useruid: "",
        };
        changePostProcessing([...postProcessing, newTextBlock]);
    };

    const handlePreview = () => {
        if (watermarkImageUrl || (watermarkImage && watermarkImage.size)) {
            setIsPreviewOpen(true);
        } else {
            toast.current?.show({
                severity: "warn",
                summary: "No Image",
                detail: "Please upload or fetch an image to preview.",
                life: TOAST_LIFETIME,
            });
        }
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
    };

    const renderTextBlocks = () => {
        const header = (blockIndex: number) => (
            <div className='flex align-items-center justify-content-between w-full'>
                {`TEXT BLOCK ${blockIndex + 1}`}
                <div className='watermarking__accordion-header-buttons'>
                    <Button
                        label='Clear'
                        text
                        className='watermarking__clear-button'
                        disabled={!postProcessing[blockIndex]?.ppText?.length}
                        severity={
                            !postProcessing[blockIndex]?.ppText?.length ? "secondary" : "success"
                        }
                        onClick={() => handleUpdatePostProcessing(blockIndex)}
                    />
                    <Button
                        icon='icon adms-close'
                        className='watermarking__remove-button'
                        text
                        onClick={() => handleDeletePostProcessing(blockIndex)}
                    />
                </div>
            </div>
        );

        return postProcessing.map((block, index) => (
            <AccordionTab
                header={header(index)}
                key={index}
                className='watermarking__accordion-tab'
                contentClassName='watermarking__accordion-content'
            >
                <div className='grid gap-3 mt-0'>
                    <span className='col-12 p-0 p-float-label watermarking__textarea'>
                        <InputTextarea
                            value={block.ppText || ""}
                            onChange={(e) => {
                                const newTextBlocks = [...postProcessing];
                                newTextBlocks[index] = { ...block, ppText: e.target.value };
                                changePostProcessing(newTextBlocks);
                            }}
                        />
                        <label className='float-label'>Text String</label>
                    </span>
                    <div className='col-12 p-0 flex align-items-center justify-content-between'>
                        <span className='p-float-label watermarking__font-input'>
                            <InputText
                                value={block.fontName || ""}
                                onChange={(e) => {
                                    const newTextBlocks = [...postProcessing];
                                    newTextBlocks[index] = { ...block, fontName: e.target.value };
                                    changePostProcessing(newTextBlocks);
                                }}
                            />
                            <label className='float-label'>Font name</label>
                        </span>
                        <span className='p-float-label watermarking__input'>
                            <InputNumber
                                value={Number(block.fontSize) || 0}
                                onChange={(e) => {
                                    const newTextBlocks = [...postProcessing];
                                    newTextBlocks[index] = {
                                        ...block,
                                        fontSize: Number(e.value) || 0,
                                    };
                                    changePostProcessing(newTextBlocks);
                                }}
                            />
                            <label className='float-label'>Font size</label>
                        </span>
                        <span className='p-float-label watermarking__input'>
                            <InputNumber
                                value={block.posX || 0}
                                onChange={(e) => {
                                    const newTextBlocks = [...postProcessing];
                                    newTextBlocks[index] = { ...block, posX: Number(e.value) || 0 };
                                    changePostProcessing(newTextBlocks);
                                }}
                            />
                            <label className='float-label'>PosX</label>
                        </span>
                        <span className='p-float-label watermarking__input'>
                            <InputNumber
                                value={block.posY || 0}
                                onChange={(e) => {
                                    const newTextBlocks = [...postProcessing];
                                    newTextBlocks[index] = { ...block, posY: Number(e.value) || 0 };
                                    changePostProcessing(newTextBlocks);
                                }}
                            />
                            <label className='float-label'>PosY</label>
                        </span>
                    </div>
                </div>
            </AccordionTab>
        ));
    };

    const handleRestoreDefault = async () => {
        try {
            const result = await restoreDefaultSettings();
            if (result.status === Status.OK) {
                fileUploadRef.current?.clear();
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Settings restored to default",
                    life: TOAST_LIFETIME,
                });
            } else {
                throw result.error;
            }
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to restore default settings",
                life: TOAST_LIFETIME,
            });
        }
    };

    return (
        <div className='settings-form watermarking'>
            <div className='settings-form__title'>Watermarking</div>
            <div className='grid align-items-center mt-0'>
                <div className='col-6'>
                    <Checkbox
                        inputId='enableWatermark'
                        name='enableWatermark'
                        checked={!!settings.watermarkenabled}
                        onChange={(e) => changeSettings("watermarkenabled", e.checked ? 1 : 0)}
                    />
                    <label htmlFor='enableWatermark' className='ml-3 white-space-nowrap'>
                        Enable watermarking
                    </label>
                </div>

                <div className='col-6 py-0 flex watermarking__buttons justify-content-end'>
                    <Button
                        label='Restore default'
                        className='watermarking__button'
                        onClick={handleRestoreDefault}
                        outlined
                        type='button'
                        severity='danger'
                    />
                    <Button
                        label='Preview'
                        className='watermarking__button'
                        onClick={handlePreview}
                        outlined
                        type='button'
                    />
                </div>

                <div className='col-12 py-0'>
                    <hr className='form-line' />
                </div>

                <div className='col-12 py-0'>
                    {watermarkImageUrl ? (
                        itemTemplate(watermarkImageUrl)
                    ) : (
                        <FileUpload
                            ref={fileUploadRef}
                            accept='image/*'
                            maxFileSize={limitations.maxSize * 1000000}
                            chooseLabel='Choose from files'
                            chooseOptions={{
                                icon: <></>,
                            }}
                            onRemove={() => {
                                store.watermarkImage = null;
                                store.changeSettings("logomediauid", "", true);
                            }}
                            headerTemplate={chooseTemplate}
                            onSelect={(event) => {
                                store.watermarkImage = event.files[0];
                            }}
                            itemTemplate={(file) => itemTemplate(file as File, fileUploadRef)}
                            emptyTemplate={emptyTemplate}
                            progressBarTemplate={<></>}
                            className='col-12'
                        />
                    )}
                </div>

                <div className='col-12 watermarking__logo-settings'>
                    <Checkbox
                        inputId='addLogo'
                        name='addLogo'
                        checked={!!settings.logoenabled}
                        onChange={() =>
                            changeSettings("logoenabled", !settings.logoenabled ? 1 : 0)
                        }
                    />
                    <label htmlFor='addLogo' className='ml-3'>
                        Add logo
                    </label>

                    <span className='p-float-label watermarking__input'>
                        <InputNumber
                            value={settings.logoposX}
                            allowEmpty
                            onChange={(e) => changeSettings("logoposX", e.value || 0)}
                        />
                        <label className='float-label'>PosX</label>
                    </span>

                    <span className='p-float-label watermarking__input'>
                        <InputNumber
                            value={settings.logoposY}
                            allowEmpty
                            onChange={(e) => changeSettings("logoposY", e.value || 0)}
                        />
                        <label className='float-label'>PosY</label>
                    </span>
                </div>

                <div className='col-12 watermarking__accordion py-0'>
                    <Accordion>{renderTextBlocks()}</Accordion>
                    <Button
                        icon='pi pi-plus'
                        className='watermarking__add-button'
                        onClick={handleCreateNewPostProcessing}
                        label='Add new block'
                        outlined
                        type='button'
                    />
                </div>
            </div>

            <ImagePreview
                imageUrl={watermarkImageUrl}
                imageFile={watermarkImage}
                isOpen={isPreviewOpen}
                onClose={handleClosePreview}
            />
        </div>
    );
});
