import "./index.css";
import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import {
    FileUpload,
    FileUploadHeaderTemplateOptions,
    FileUploadSelectEvent,
    FileUploadUploadEvent,
    ItemTemplateOptions,
} from "primereact/fileupload";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useStore } from "store/hooks";
import { Image } from "primereact/image";
import { Checkbox } from "primereact/checkbox";
import { InfoOverlayPanel } from "dashboard/common/overlay-panel";
import { InventoryMediaPostData, MediaLimitations } from "common/models/inventory";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { CATEGORIES } from "common/constants/media-categories";
import { Loader } from "dashboard/common/loader";
import { useToast } from "dashboard/common/toast";
import { emptyTemplate } from "dashboard/common/form/upload";
import { ComboBox } from "dashboard/common/form/dropdown";

const limitations: MediaLimitations = {
    formats: ["PNG", "JPEG", "TIFF"],
    minResolution: "512x512",
    maxResolution: "8192x8192",
    maxSize: 8,
    maxUpload: 16,
};

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const ImagesMedia = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const toast = useToast();
    const {
        saveInventoryImages,
        uploadFileImages,
        images,
        isLoading,
        removeMedia,
        fetchImages,
        changeInventoryMediaOrder,
        clearMedia,
        formErrorMessage,
    } = store;
    const [checked, setChecked] = useState<boolean>(true);
    const [imagesChecked, setImagesChecked] = useState<boolean[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    useEffect(() => {
        fetchImages();

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

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        store.uploadFileImages = {
            ...store.uploadFileImages,
            file: e.files,
        };
        setTotalCount(e.files.length);
    };

    const handleCategorySelect = (e: DropdownChangeEvent) => {
        store.uploadFileImages = {
            ...store.uploadFileImages,
            data: {
                ...store.uploadFileImages.data,
                contenttype: e.target.value,
            },
        };
    };

    const handleCommentaryChange = (e: ChangeEvent<HTMLInputElement>) => {
        store.uploadFileImages = {
            ...store.uploadFileImages,
            data: {
                ...store.uploadFileImages.data,
                notes: e.target.value,
            },
        };
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        setTotalCount(e.files.length);
    };

    const onTemplateRemove = (file: File, callback: Function) => {
        const newFiles = {
            file: uploadFileImages.file.filter((item) => item.name !== file.name),
            data: uploadFileImages.data,
        };
        store.uploadFileImages = newFiles;
        setTotalCount(newFiles.file.length);
        callback();
    };

    const handleUploadFiles = () => {
        if (formErrorMessage) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: formErrorMessage,
            });
        }
        saveInventoryImages().then((res) => {
            if (res) {
                fileUploadRef.current?.clear();
            }
        });
    };

    const handleCheckedChange = (index?: number) => {
        const updatedImagesChecked = [...imagesChecked];

        if (index === undefined && !checked) {
            setChecked(true);
            const allChecked = updatedImagesChecked.map(() => true);
            setImagesChecked(allChecked);
        } else if (index === undefined && checked) {
            setChecked(false);
            const allUnchecked = updatedImagesChecked.map(() => false);
            setImagesChecked(allUnchecked);
        } else if (index !== undefined) {
            const updatedCheckboxState = [...updatedImagesChecked];
            updatedCheckboxState[index] = !updatedCheckboxState[index];
            setImagesChecked(updatedCheckboxState);
        }
    };

    const handleDeleteImage = (mediauid: string) => {
        removeMedia(mediauid, fetchImages);
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        return (
            <div className='flex align-items-center presentation'>
                <div className='flex align-items-center'>
                    <img
                        alt={file.name}
                        src={URL.createObjectURL(file)}
                        role='presentation'
                        width={29}
                        height={29}
                        className='presentation__image'
                    />
                    <span className='presentation__label flex flex-column text-left ml-3'>
                        {file.name}
                    </span>
                </div>
                <Button
                    type='button'
                    icon='pi pi-times'
                    className='p-button presentation__remove-button'
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        );
    };

    const chooseTemplate = ({ chooseButton }: FileUploadHeaderTemplateOptions) => {
        return (
            <div className='w-full flex justify-content-center flex-wrap mb-3 image-choose'>
                {totalCount ? (
                    <div className='image-choose__selected flex align-items-center'>
                        To upload more drag and drop images
                        <span className='bold mx-3'>or</span>
                        {chooseButton}
                    </div>
                ) : (
                    <>
                        {chooseButton}
                        <div className='flex w-full justify-content-center align-items-center mt-4 relative'>
                            <span className='media__upload-text-info media__upload-text-info--bold'>
                                Up to {limitations.maxUpload} items
                            </span>
                            <span className='media__upload-text-info'>
                                Maximal size is {limitations.maxSize} Mb
                            </span>
                            {limitations.formats.map((format) => (
                                <Tag key={format} className='media__upload-tag' value={format} />
                            ))}
                            <div className='media-tooltip'>
                                <InfoOverlayPanel panelTitle='Limitations:'>
                                    <p>
                                        <b>Supported formats</b>:{" "}
                                        {limitations.formats.map((format, index) => (
                                            <span key={index}>
                                                {format}
                                                {index !== limitations.formats.length - 1 && ", "}
                                            </span>
                                        ))}
                                    </p>
                                    <p>
                                        <b>Minimal resolution</b>: {limitations.minResolution}
                                    </p>
                                    <p>
                                        <b>Maximal resolution</b>: {limitations.maxResolution}
                                    </p>
                                    <p>
                                        <b>Maximal size</b>: {limitations.maxSize} MBytes
                                    </p>
                                    <p>
                                        <b>Batch upload</b>: Up to {limitations.maxUpload} items
                                    </p>
                                </InfoOverlayPanel>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const handleChangeOrder = (list: Layout[]) => {
        const orderedList: Pick<InventoryMediaPostData, "itemuid" | "order">[] = [];
        if (list) {
            list.forEach((item: Layout) => {
                orderedList.push({ itemuid: item.i, order: item.y + 1 * item.x + 1 });
            });
        }
        changeInventoryMediaOrder(orderedList);
    };

    const chooseOptions = {
        className: "media__button",
        label: "Choose from files",
        icon: "none",
    };

    return (
        <div className='media grid'>
            {isLoading && <Loader overlay />}
            <FileUpload
                ref={fileUploadRef}
                multiple
                accept='image/*'
                maxFileSize={limitations.maxSize * 1000000}
                onUpload={onTemplateUpload}
                headerTemplate={chooseTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate("images")}
                onSelect={onTemplateSelect}
                chooseOptions={chooseOptions}
                progressBarTemplate={<></>}
                className='col-12'
            />
            <div className='col-12 mt-4 media-input'>
                <ComboBox
                    className='media-input__dropdown'
                    placeholder='Category'
                    optionLabel={"name"}
                    optionValue={"id"}
                    options={[...CATEGORIES]}
                    value={uploadFileImages?.data?.contenttype || 0}
                    onChange={handleCategorySelect}
                />
                <InputText
                    className='media-input__text'
                    placeholder='Comment'
                    value={uploadFileImages?.data?.notes || ""}
                    onChange={handleCommentaryChange}
                />
                <Button
                    severity={totalCount ? "success" : "secondary"}
                    disabled={!totalCount || isLoading}
                    className='p-button media-input__button'
                    onClick={handleUploadFiles}
                >
                    Save
                </Button>
            </div>
            <div className='media__uploaded media-uploaded'>
                <h2 className='media-uploaded__title uppercase m-0'>uploaded images</h2>
                <span
                    className={`media-uploaded__label mx-2 uploaded-count ${
                        images.length && "uploaded-count--blue"
                    }`}
                >
                    ({images.length})
                </span>
                <hr className='media-uploaded__line flex-1' />
                <label className='cursor-pointer media-uploaded__label'>
                    <Checkbox
                        checked={imagesChecked.every((checked) => checked) && checked}
                        onChange={() => handleCheckedChange()}
                        className='media-uploaded__checkbox'
                    />
                    Export to Web
                </label>
            </div>
            <div className='media-images'>
                {images.length ? (
                    <ResponsiveReactGridLayout
                        isDraggable={true}
                        isDroppable={true}
                        className='layout w-full relative'
                        onDragStop={(item) => handleChangeOrder(item)}
                        layouts={{
                            lg: images.map(({ itemuid }, index: number) => ({
                                i: itemuid,
                                x: index % 3,
                                y: 0,
                                w: 1,
                                h: 4,
                            })),
                        }}
                        cols={{ lg: 3, md: 3, sm: 3, xs: 2, xxs: 1 }}
                        draggableCancel='
                        .media-uploaded__checkbox,
                        .media-images__close,
                        .p-image,
                        .p-image-mask,
                        .media-images__preview'
                        rowHeight={20}
                    >
                        {images.map(({ itemuid, src, info }, index: number) => {
                            return (
                                <div key={itemuid} className='media-images__item'>
                                    {checked && (
                                        <Checkbox
                                            checked={imagesChecked[index]}
                                            onChange={() => handleCheckedChange(index)}
                                            className='media-uploaded__checkbox'
                                        />
                                    )}
                                    <Image
                                        src={src}
                                        alt='inventory-item'
                                        width='75'
                                        height='75'
                                        preview
                                        className='cursor-pointer'
                                        pt={{
                                            image: {
                                                className: "media-images__image",
                                            },
                                            previewContainer: {
                                                className: "media-images__preview-container",
                                            },
                                            preview: {
                                                className: "media-images__preview",
                                            },
                                        }}
                                    />
                                    <div className='media-images__info image-info'>
                                        <div className='image-info__item'>
                                            <span className='image-info__icon'>
                                                <i className='icon adms-category' />
                                            </span>
                                            <span className='image-info__text--bold'>
                                                {
                                                    CATEGORIES.find(
                                                        (category) =>
                                                            category.id === info?.contenttype
                                                    )?.name
                                                }
                                            </span>
                                        </div>
                                        <div className='image-info__item'>
                                            <span className='image-info__icon'>
                                                <span className='image-info__icon'>
                                                    <i className='icon adms-comment' />
                                                </span>
                                            </span>
                                            <span className='image-info__text'>{info?.notes}</span>
                                        </div>
                                        <div className='image-info__item'>
                                            <span className='image-info__icon'>
                                                <i className='icon adms-calendar' />
                                            </span>
                                            <span className='image-info__text'>
                                                {info?.created}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className='media-images__close'
                                        onClick={() => handleDeleteImage(itemuid)}
                                    >
                                        <i className='pi pi-times' />
                                    </button>
                                </div>
                            );
                        })}
                    </ResponsiveReactGridLayout>
                ) : (
                    <div className='w-full text-center'>No images added yet.</div>
                )}
            </div>
        </div>
    );
});
