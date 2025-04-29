import { useRef } from "react";
import { ConfirmDialog, ConfirmDialogProps } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./index.css";

interface ConfirmModalProps extends ConfirmDialogProps {
    bodyMessage?: string;
    title?: string;
    icon?: string;
    confirmAction?: () => void;
    rejectAction?: () => void;
    visible: boolean;
    onHide: () => void;
}

export const ConfirmModal = ({
    bodyMessage,
    confirmAction,
    rejectAction,
    title,
    visible,
    onHide,
    icon,
    ...props
}: ConfirmModalProps) => {
    const toast = useRef<Toast>(null);

    const accept = () => {
        confirmAction?.();
        onHide();
    };

    const reject = () => {
        rejectAction?.();
        onHide();
    };

    return (
        <>
            <ConfirmDialog
                header={
                    <div className='confirm-header'>
                        <i
                            className={`pi ${icon ? icon : "pi-times-circle"} confirm-header__icon`}
                        />
                        <div className='confirm-header__title'>{title || "Are you sure?"}</div>
                    </div>
                }
                message={
                    <div className='text-center w-full confirm-body'>
                        {bodyMessage || "Please confirm to proceed moving forward."}
                    </div>
                }
                visible={visible}
                onHide={onHide}
                accept={accept}
                reject={reject}
                focusOnShow
                draggable={false}
                {...props}
            />
            <Toast ref={toast} />
        </>
    );
};
