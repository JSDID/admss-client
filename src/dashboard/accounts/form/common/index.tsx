import { Button, ButtonProps } from "primereact/button";
import { ReactElement, useState } from "react";
import { Tooltip } from "primereact/tooltip";

import "./index.css";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { useNavigate } from "react-router-dom";
import { InputTextarea } from "primereact/inputtextarea";

interface ReportSelectProps {
    header: string;
    values: string[];
    currentItem: string | Record<string, unknown> | null;
    onItemClick: (item: string) => void;
}

export const ReportSelect = ({
    header,
    values,
    currentItem,
    onItemClick,
}: ReportSelectProps): ReactElement => {
    return (
        <div className='report-select'>
            <span className='report-select__header'>{header}</span>
            <ul className='report-select__list'>
                {values.map((value) => (
                    <li
                        className={`report-select__item ${currentItem === value ? "selected" : ""}`}
                        key={value}
                        onClick={() => {
                            onItemClick(value);
                        }}
                    >
                        {value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface NoticeAlertProps extends ButtonProps {}

export const NoticeAlert = observer(({ ...props }: NoticeAlertProps): ReactElement => {
    const store = useStore().accountStore;
    const navigate = useNavigate();
    const {
        accountNote: { alert, note },
    } = store;
    const tooltipId = "notice-tooltip";

    const tooltipContent = () => {
        return (
            <>
                {note && (
                    <div className='notice-content'>
                        <h4 className='notice-content__title'>Account Memo:</h4>
                        <p className='notice-content__description'>{note}</p>
                    </div>
                )}
                {alert && (
                    <div className='notice-content'>
                        <h4 className='notice-content__title'>Payment Alert:</h4>
                        <p className='notice-content__description'>{alert}</p>
                    </div>
                )}
            </>
        );
    };

    const handleNoticeClick = () => {
        navigate(`/dashboard/accounts/${store.accountID}?tab=notes`);
    };

    return (
        <span className='notice-alert'>
            <Button
                className='notice-alert__button'
                id={tooltipId}
                {...props}
                severity='warning'
                onClick={handleNoticeClick}
            >
                NOTICE! Account Alert!
            </Button>
            <Tooltip target={`#${tooltipId}`} showDelay={500} hideDelay={300} position='bottom'>
                {tooltipContent()}
            </Tooltip>
        </span>
    );
});

interface NoteEditorProps {
    id: string;
    value: string;
    label: string;
    onSave: () => void;
    onClear: () => void;
    onChange: (value: string) => void;
    className?: string;
}

interface NoteEditorProps {
    id: string;
    value: string;
    label: string;
    onSave: () => void;
    onClear: () => void;
    onChange: (value: string) => void;
    className?: string;
}

interface NoteEditorProps {
    id: string;
    value: string;
    label: string;
    onSave: () => void;
    onClear: () => void;
    onChange: (value: string) => void;
    className?: string;
}

export const NoteEditor = observer(
    ({ id, value, label, onSave, onClear, onChange, className }: NoteEditorProps): ReactElement => {
        const [isEditing, setIsEditing] = useState<boolean>(false);

        const handleClear = () => {
            onClear();
            setIsEditing(false);
        };

        return (
            <div className={`account-note ${className || ""}`}>
                <span className='p-float-label'>
                    <InputTextarea
                        id={id}
                        value={value}
                        onChange={(e) => {
                            setIsEditing(true);
                            onChange(e.target.value);
                        }}
                        className='account-note__input'
                    />
                    <label htmlFor={id}>{label}</label>
                </span>
                {value === "" && !isEditing ? (
                    <Button
                        severity={value ? "success" : "secondary"}
                        className='account-note__button'
                        label='Save'
                        disabled={!value}
                        onClick={() => {
                            onSave();
                            setIsEditing(false);
                        }}
                    />
                ) : (
                    <div className='account-note__buttons'>
                        <Button
                            className='account-note__button'
                            label='Clear'
                            outlined
                            onClick={handleClear}
                        />
                        <Button
                            className='account-note__button'
                            label='Update'
                            outlined
                            disabled={!isEditing}
                            severity={isEditing ? "success" : "secondary"}
                            onClick={() => {
                                onSave();
                                setIsEditing(false);
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }
);
