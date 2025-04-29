import "./index.css";
import { ReactElement } from "react";
import { Button } from "primereact/button";

interface ImagePreviewProps {
    imageUrl: string | null;
    imageFile: File | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ImagePreview = ({
    imageUrl,
    imageFile,
    isOpen,
    onClose,
}: ImagePreviewProps): ReactElement | null => {
    if (!isOpen) return null;

    return (
        <div className='preview-overlay' onClick={onClose}>
            <div className='preview-container' onClick={(e) => e.stopPropagation()}>
                <img
                    src={imageUrl || URL.createObjectURL(imageFile!)}
                    alt='Watermark Preview'
                    className='preview-image'
                />
                <Button
                    icon='pi pi-times'
                    text
                    className='preview-close-button'
                    onClick={onClose}
                />
            </div>
        </div>
    );
};
