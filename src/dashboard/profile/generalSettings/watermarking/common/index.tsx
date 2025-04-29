import { MediaLimits } from "common/models";
import { Button } from "primereact/button";
import { FileUpload, FileUploadHeaderTemplateOptions } from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { store } from "store";

export const limitations: MediaLimits = {
    formats: ["PNG", "JPEG"],
    maxResolution: "1200x1200",
    maxSize: 2,
};

export const itemTemplate = (image: File | string, fileUploadRef?: React.RefObject<FileUpload>) => {
    const isFilePath = typeof image === "string";

    const alt = isFilePath ? "watermark image" : image?.name;
    const src = isFilePath ? image : URL.createObjectURL(image);
    const handleDeleteImage = () => {
        store.generalSettingsStore.watermarkImageUrl = null;
        fileUploadRef && fileUploadRef.current?.clear();
    };
    return (
        <div className='flex align-items-center presentation'>
            <div className='flex align-items-center w-full'>
                <img
                    alt={alt}
                    src={src}
                    role='presentation'
                    width='100%'
                    height='100%'
                    className='presentation__image'
                />
            </div>
            <Button
                type='button'
                icon='pi pi-times'
                className='p-button presentation__remove-button'
                onClick={handleDeleteImage}
            />
        </div>
    );
};

export const chooseTemplate = ({ chooseButton }: FileUploadHeaderTemplateOptions) => (
    <>
        <div className='image-choose'>{chooseButton}</div>
        <div className='upload-info'>
            <span className='media__upload-text-info'>
                Max resolution: {limitations.maxResolution}px
            </span>
            <span className='media__upload-text-info'>Max size is {limitations.maxSize} Mb</span>
            <div className='media__upload-formats'>
                {limitations.formats.map((format) => (
                    <Tag key={format} className='media__upload-tag' value={format} />
                ))}
            </div>
        </div>
    </>
);

export const emptyTemplate = () => (
    <div className='empty-template'>
        <div className='flex align-items-center justify-content-center flex-column h-full'>
            <i className='adms-upload media__upload-icon' />
            <span className='media__upload-icon-label'>Drag and drop image here</span>
        </div>
        <div className='media__upload-splitter h-full'>
            <div className='media__line' />
            <span>or</span>
            <div className='media__line' />
        </div>
    </div>
);
