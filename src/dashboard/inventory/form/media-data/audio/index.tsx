import "./index.css";
import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { InfoOverlayPanel } from "dashboard/common/overlay-panel";
import { Button } from "primereact/button";
import { DropdownChangeEvent } from "primereact/dropdown";
import {
    FileUpload,
    FileUploadUploadEvent,
    ItemTemplateOptions,
    FileUploadHeaderTemplateOptions,
    FileUploadSelectEvent,
} from "primereact/fileupload";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { MediaLimitations } from "common/models/inventory";
import { useStore } from "store/hooks";
import { Checkbox } from "primereact/checkbox";
import { CATEGORIES } from "common/constants/media-categories";
import { Loader } from "dashboard/common/loader";
import { emptyTemplate } from "dashboard/common/form/upload";
import { ComboBox } from "dashboard/common/form/dropdown";

const limitations: MediaLimitations = {
    formats: ["WAV", "MP3", "MP4"],
    codecs: "PCM (WAV), MP3, AAC (MP4)",
    maxDuration: 300,
    maxSize: 8,
    maxUpload: 8,
};

export const AudioMedia = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const {
        saveInventoryAudios,
        uploadFileAudios,
        audios,
        isLoading,
        removeMedia,
        clearMedia,
        fetchAudios,
    } = store;
    const [totalCount, setTotalCount] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);
    const [checked, setChecked] = useState<boolean>(true);
    const [audioChecked, setAudioChecked] = useState<boolean[]>([]);

    useEffect(() => {
        fetchAudios();

        return () => {
            clearMedia();
        };
    }, []);

    const handleCategorySelect = (e: DropdownChangeEvent) => {
        store.uploadFileAudios = {
            ...store.uploadFileAudios,
            data: {
                ...store.uploadFileAudios.data,
                contenttype: e.target.value,
            },
        };
    };

    const handleCommentaryChange = (e: ChangeEvent<HTMLInputElement>) => {
        store.uploadFileAudios = {
            ...store.uploadFileAudios,
            data: {
                ...store.uploadFileAudios.data,
                notes: e.target.value,
            },
        };
    };

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        store.uploadFileAudios = {
            ...store.uploadFileAudios,
            file: e.files,
        };
        setTotalCount(e.files.length);
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        setTotalCount(e.files.length);
    };

    const onTemplateRemove = (file: File, callback: Function) => {
        const newFiles = {
            file: uploadFileAudios.file.filter((item) => item.name !== file.name),
            data: uploadFileAudios.data,
        };
        store.uploadFileAudios = newFiles;
        setTotalCount(newFiles.file.length);
        callback();
    };

    const handleUploadFiles = () => {
        saveInventoryAudios().then((res) => {
            if (res) {
                fileUploadRef.current?.clear();
            }
        });
    };

    const handleCheckedChange = (index?: number) => {
        const updatedAudioChecked = [...audioChecked];

        if (index === undefined && !checked) {
            setChecked(true);
            const allChecked = updatedAudioChecked.map(() => true);
            setAudioChecked(allChecked);
        } else if (index === undefined && checked) {
            setChecked(false);
            const allUnchecked = updatedAudioChecked.map(() => false);
            setAudioChecked(allUnchecked);
        } else if (index !== undefined) {
            const updatedCheckboxState = [...updatedAudioChecked];
            updatedCheckboxState[index] = !updatedCheckboxState[index];
            setAudioChecked(updatedCheckboxState);
        }
    };

    const handleDeleteAudio = (mediauid: string) => {
        removeMedia(mediauid, fetchAudios);
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
                        className='presentation__audio'
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
            <div className='w-full flex justify-content-center flex-wrap mb-3 audio-choose'>
                {totalCount ? (
                    <div className='audio-choose__selected flex align-items-center'>
                        To upload more drag and drop audio files
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
                                        <b> Supported codecs</b>: {limitations.codecs}
                                    </p>
                                    <p>
                                        <b>Supported formats</b>:
                                        {limitations.formats.map((format, index) => (
                                            <span key={index}>
                                                {format}
                                                {index !== limitations.formats.length - 1 && ", "}
                                            </span>
                                        ))}
                                    </p>
                                    <p>
                                        <b>Maximal duration</b>: {limitations.maxDuration} seconds
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
            {isLoading && <Loader overlay />}
            <FileUpload
                ref={fileUploadRef}
                multiple
                accept='audio/*'
                onUpload={onTemplateUpload}
                headerTemplate={chooseTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate("audio files")}
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
                    value={uploadFileAudios?.data?.contenttype}
                    onChange={handleCategorySelect}
                />
                <InputText
                    className='media-input__text'
                    placeholder='Comment'
                    value={uploadFileAudios?.data?.notes}
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
                <h2 className='media-uploaded__title uppercase m-0'>uploaded audio files</h2>
                <hr className='media-uploaded__line flex-1' />
            </div>
            <div className='media-audio'>
                {audios.length ? (
                    audios.map(({ itemuid, src, info }, index: number) => {
                        return (
                            <div key={itemuid} className='media-audio__item'>
                                {checked && (
                                    <Checkbox
                                        checked={audioChecked[index]}
                                        onChange={() => handleCheckedChange(index)}
                                        className='media-uploaded__checkbox'
                                    />
                                )}
                                <Image
                                    src={src}
                                    alt='inventory-item'
                                    width='75'
                                    height='75'
                                    pt={{
                                        image: {
                                            className: "media-audio__image",
                                        },
                                    }}
                                />
                                <div className='media-audio__info audio-info'>
                                    <div className='audio-info__item'>
                                        <span className='audio-info__icon'>
                                            <i className='pi pi-th-large' />
                                        </span>
                                        <span className='audio-info__text--bold'>
                                            {
                                                CATEGORIES.find(
                                                    (category) => category.id === info?.contenttype
                                                )?.name
                                            }
                                        </span>
                                    </div>
                                    <div className='audio-info__item'>
                                        <span className='audio-info__icon'>
                                            <span className='audio-info__icon'>
                                                <i className='pi pi-comment' />
                                            </span>
                                        </span>
                                        <span className='audio-info__text'>{info?.notes}</span>
                                    </div>
                                    <div className='audio-info__item'>
                                        <span className='audio-info__icon'>
                                            <i className='pi pi-calendar' />
                                        </span>
                                        <span className='audio-info__text'>{info?.created}</span>
                                    </div>
                                </div>
                                <button
                                    className='media-audio__close'
                                    onClick={() => handleDeleteAudio(itemuid)}
                                >
                                    <i className='pi pi-times' />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className='w-full text-center'>No audio files added yet.</div>
                )}
            </div>
        </div>
    );
});
