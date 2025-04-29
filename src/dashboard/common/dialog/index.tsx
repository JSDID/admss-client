import { Dialog, DialogProps } from "primereact/dialog";
import { Button } from "primereact/button";
import { Formik, Form } from "formik";
import "./index.css";

export interface DashboardDialogProps extends DialogProps {
    action?: () => void;
    buttonDisabled?: boolean;
    cancelButton?: boolean;
    initialValues?: Record<string, any>;
}

export const DashboardDialog = ({
    visible,
    onHide,
    header,
    children,
    footer,
    className,
    action,
    buttonDisabled,
    cancelButton,
    initialValues = {},
    ...props
}: DashboardDialogProps) => {
    const handleSubmit = () => {
        if (action) {
            action();
        }
    };

    return (
        <Dialog
            draggable={false}
            header={header}
            className={`dialog ${className}`}
            visible={visible}
            onHide={onHide}
            {...props}
        >
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {() => (
                    <Form>
                        <div className='p-dialog-content-body' tabIndex={0}>
                            {children}
                        </div>

                        <div className='p-dialog-footer flex justify-content-center'>
                            {cancelButton && (
                                <Button
                                    label='Cancel'
                                    type='button'
                                    className='dialog__cancel-button'
                                    onClick={onHide}
                                    severity='danger'
                                    outlined
                                />
                            )}
                            {footer && (
                                <Button
                                    type='submit'
                                    label={`${footer}`}
                                    disabled={buttonDisabled}
                                />
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
