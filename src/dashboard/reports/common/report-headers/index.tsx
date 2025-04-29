import { ConfirmModal } from "dashboard/common/dialog/confirm";
import { ButtonProps, Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { PanelHeaderTemplateOptions } from "primereact/panel";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ReportsAccordionHeaderProps {
    title: string;
    info: string;
    actionButton?: ReactElement;
    label?: string | false;
    selected?: boolean;
}

export const ReportsAccordionHeader = ({
    title,
    info,
    actionButton,
    label,
    selected,
}: ReportsAccordionHeaderProps): ReactElement => {
    return (
        <div className='reports-accordion-header'>
            <div className='flex gap-1'>
                <div className='reports-accordion-header__title'>{title}</div>
                <div
                    className={`reports-accordion-header__info ${selected ? "searched-item" : ""}`}
                >
                    {info}
                </div>
                {label && <div className='reports-accordion-header__label'>{label}</div>}
            </div>
            {actionButton}
        </div>
    );
};

interface ReportsPanelHeaderProps extends ButtonProps {
    options: PanelHeaderTemplateOptions;
    state: string;
    navigatePath: string;
    isConfirm: boolean;
    setStateAction: (state: string) => void;
}

export const ReportsPanelHeader = ({
    options,
    state,
    navigatePath,
    isConfirm,
    setStateAction,
}: ReportsPanelHeaderProps): ReactElement => {
    const navigate = useNavigate();
    const [isConfirmVisible, setIsConfirmVisible] =
        useState<React.MouseEvent<HTMLButtonElement> | null>(null);

    const handleClosePanel = () => {
        options.onTogglerClick(isConfirmVisible as React.MouseEvent<HTMLButtonElement>);
    };

    return (
        <div className='reports-header col-12 px-0 pb-3'>
            {!options.collapsed && (
                <Button
                    icon='pi pi-times'
                    className='p-button close-button'
                    onClick={(e) =>
                        isConfirm ? setIsConfirmVisible(e) : options.onTogglerClick(e)
                    }
                />
            )}
            <Button
                tooltip='Add New Custom Report'
                tooltipOptions={{ position: "mouse" }}
                className='reports-header__button'
                onClick={() => navigate(navigatePath)}
            >
                Custom Report
            </Button>
            <Button
                tooltip='Add New Collection'
                tooltipOptions={{ position: "mouse" }}
                icon='pi pi-plus'
                className='reports-header__button'
                onClick={options.onTogglerClick}
            >
                New collection
            </Button>
            <span className='p-input-icon-right reports-header__search'>
                <i
                    className={`pi pi-${!state ? "search" : "times cursor-pointer"}`}
                    onClick={() => setStateAction("")}
                />
                <InputText
                    value={state}
                    placeholder='Search'
                    onChange={(e) => setStateAction(e.target.value)}
                />
            </span>
            {isConfirm && isConfirmVisible && (
                <ConfirmModal
                    visible={!!isConfirmVisible}
                    title='Quit Editing?'
                    icon='pi-exclamation-triangle'
                    bodyMessage='
              Are you sure you want to cancel creating a new collection?
              All unsaved data will be lost.'
                    confirmAction={handleClosePanel}
                    draggable={false}
                    rejectLabel='Cancel'
                    acceptLabel='Confirm'
                    className='schedule-confirm-dialog'
                    onHide={() => setIsConfirmVisible(null)}
                />
            )}
        </div>
    );
};
