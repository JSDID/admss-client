import "./index.css";
import { ReactElement, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { InfoOverlayPanel } from "dashboard/common/overlay-panel";
import { Button } from "primereact/button";
import {
    FileUpload,
    FileUploadUploadEvent,
    ItemTemplateOptions,
    FileUploadHeaderTemplateOptions,
} from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { MediaLimitations } from "common/models/inventory";
import { emptyTemplate } from "dashboard/common/form/upload";

const limitations: MediaLimitations = {
    formats: ["PDF", "PNG", "JPEG", "TIFF"],
    maxSize: 8,
    maxUpload: 16,
};

export const ContactsDocuments = observer((): ReactElement => {
    const [totalCount, setTotalCount] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        setTotalCount(e.files.length);
    };

    const onTemplateRemove = (file: File, callback: Function) => {
        callback();
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
                        className='presentation__document'
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
            <div className='w-full flex justify-content-center flex-wrap mb-3 document-choose'>
                {totalCount ? (
                    <div className='document-choose__selected flex align-items-center'>
                        To upload more drag and drop documents
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
                                        <b>Supported formats: </b>
                                        {limitations.formats.map((format, index) => (
                                            <span key={index}>
                                                {format}
                                                {index !== limitations.formats.length - 1 && ", "}
                                            </span>
                                        ))}
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

    const chooseOptions = {
        className: "media__button",
        label: "Choose from files",
        icon: "none",
    };

    return (
        <div className='media grid'>
            <FileUpload
                ref={fileUploadRef}
                multiple
                accept='document/*'
                maxFileSize={limitations.maxSize * 1000000}
                onUpload={onTemplateUpload}
                headerTemplate={chooseTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate("documents")}
                chooseOptions={chooseOptions}
                progressBarTemplate={<></>}
                className='col-12 mb-4'
            />
            <div className='col-9 media-input'>
                <InputText
                    className='media-input__text w-full'
                    onChange={() => {}}
                    placeholder='Comment'
                />
            </div>
            <div className='col-3'>
                <Button
                    severity={totalCount ? "success" : "secondary"}
                    disabled={!totalCount}
                    className='p-button media-input__button w-full'
                >
                    Save
                </Button>
            </div>
            <div className='media__uploaded media-uploaded'>
                <h2 className='media-uploaded__title uppercase m-0'>uploaded documents</h2>
                <hr className='media-uploaded__line flex-1' />
            </div>
            <div className='media-documents'>
                <div className='w-full text-center'>No documents added yet.</div>
            </div>
        </div>
    );
});
