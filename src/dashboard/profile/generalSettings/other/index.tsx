import "./index.css";
import { Button } from "primereact/button";
import { ReactElement, useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { Loader } from "dashboard/common/loader";
import { useToast } from "dashboard/common/toast";
import { useStore } from "store/hooks";
import { getHowToKnowList, setHowToKnow, deleteHowToKnow } from "http/services/deals.service";
import { HowToKnow } from "common/models/deals";
import { Status } from "common/models/base-response";
import { TOAST_LIFETIME } from "common/settings";

const NEW_ITEM = "new";
const DESCRIPTION_MAX_LENGTH = 127;
const DESCRIPTION_LIMIT = 100;

export const SettingsOther = (): ReactElement => {
    const toast = useToast();
    const store = useStore().userStore;
    const { authUser } = store;

    const [howToKnowList, setHowToKnowList] = useState<Partial<HowToKnow>[]>([]);
    const [editedItem, setEditedItem] = useState<Partial<HowToKnow>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const newInputRef = useRef<HTMLInputElement>(null);

    const handleGetUserHowKnowList = async () => {
        if (!authUser) return;
        setIsLoading(true);
        const response = await getHowToKnowList(authUser.useruid);
        if (Array.isArray(response) && response.length) {
            setHowToKnowList(response);
        } else {
            setHowToKnowList([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        handleGetUserHowKnowList();
    }, [authUser]);

    const handleSaveHowKnow = async () => {
        if (
            !authUser ||
            !editedItem.description ||
            editedItem.description.length > DESCRIPTION_MAX_LENGTH
        )
            return;
        setIsLoading(true);

        const itemToSave = {
            description: editedItem.description,
            itemuid: editedItem.itemuid === NEW_ITEM ? "0" : editedItem.itemuid,
        };

        const response = await setHowToKnow(authUser.useruid, itemToSave);
        if (response?.status === Status.ERROR) {
            toast.current?.show({
                severity: "error",
                summary: Status.ERROR,
                detail: response.error,
                life: TOAST_LIFETIME,
            });
        } else {
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Item saved successfully",
                life: TOAST_LIFETIME,
            });
            const updatedList = await getHowToKnowList(authUser.useruid);
            if (Array.isArray(updatedList)) {
                setHowToKnowList(updatedList);
            }
            setEditedItem({});
        }
        setIsLoading(false);
    };

    const handleDeleteHowKnow = async (item: Partial<HowToKnow>) => {
        if (!authUser || !item.itemuid || item.itemuid === NEW_ITEM) return;
        setIsLoading(true);

        const response = await deleteHowToKnow(item.itemuid);
        if (response?.status === Status.ERROR) {
            toast.current?.show({
                severity: "error",
                summary: Status.ERROR,
                detail: response.error,
                life: TOAST_LIFETIME,
            });
        } else {
            const updatedList = howToKnowList.filter((i) => i.itemuid !== item.itemuid);
            setHowToKnowList(updatedList);
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Item deleted successfully",
                life: TOAST_LIFETIME,
            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (editedItem.itemuid === NEW_ITEM && newInputRef.current) {
            newInputRef.current.focus();
        }
    }, [editedItem]);

    const getTruncatedText = (text: string | undefined) => {
        if (!text) return "";
        return text.length > DESCRIPTION_LIMIT
            ? text.substring(0, DESCRIPTION_LIMIT) + "..."
            : text;
    };

    const needsTooltip = (text: string | undefined) => {
        return text ? text.length > DESCRIPTION_LIMIT : false;
    };

    return (
        <div className='settings-form'>
            {isLoading && <Loader overlay />}
            <div className='settings-form__title'>Other</div>
            <div className='flex justify-content-end mb-4'>
                <Button
                    className='settings-form__button'
                    outlined
                    onClick={() => {
                        setEditedItem({
                            description: "",
                            itemuid: NEW_ITEM,
                        });
                    }}
                >
                    New Example
                </Button>
            </div>
            <div className='grid settings-other p-2'>
                <div className='col-12'>
                    <div className='settings-other__header grid'>
                        <div className='col-10 flex settings-other__header-row align-items-center'>
                            How did you hear about us?
                        </div>
                        <div className='col-2 flex align-items-center p-0'>Action</div>
                    </div>
                    <div className='settings-other__body grid'>
                        {howToKnowList.map((item) => (
                            <div key={item.itemuid} className='settings-other__row'>
                                <div className='col-10 flex align-items-center p-0'>
                                    {editedItem.itemuid === item.itemuid ? (
                                        <div className='flex row-edit'>
                                            <InputText
                                                type='text'
                                                maxLength={DESCRIPTION_MAX_LENGTH}
                                                tooltip={
                                                    editedItem?.description?.length ===
                                                    DESCRIPTION_MAX_LENGTH
                                                        ? `Max ${DESCRIPTION_MAX_LENGTH} characters`
                                                        : ""
                                                }
                                                tooltipOptions={{
                                                    position: "mouse",
                                                }}
                                                value={editedItem.description || ""}
                                                className='row-edit__input'
                                                onChange={(e) =>
                                                    setEditedItem({
                                                        ...editedItem,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                            <Button
                                                className='p-button row-edit__button'
                                                onClick={handleSaveHowKnow}
                                                disabled={
                                                    !editedItem.description ||
                                                    editedItem.description.length >
                                                        DESCRIPTION_MAX_LENGTH
                                                }
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <span
                                                className={`description-text ${
                                                    needsTooltip(item.description)
                                                        ? `description-text--tooltip-${item.itemuid}`
                                                        : ""
                                                }`}
                                            >
                                                {getTruncatedText(item.description)}
                                            </span>
                                            {needsTooltip(item.description) && (
                                                <Tooltip
                                                    target={`.description-text--tooltip-${item.itemuid}`}
                                                    content={item.description}
                                                    position='mouse'
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className='col-2 p-0 settings-other__actions'>
                                    <Button
                                        className='settings-other__edit-button'
                                        outlined
                                        onClick={() =>
                                            editedItem.itemuid
                                                ? setEditedItem({})
                                                : setEditedItem(item)
                                        }
                                        disabled={
                                            !item.itemuid ||
                                            !!item.isdefault ||
                                            item.itemuid === NEW_ITEM
                                        }
                                        severity={
                                            !item.itemuid ||
                                            item.itemuid === NEW_ITEM ||
                                            !!item.isdefault
                                                ? "secondary"
                                                : "success"
                                        }
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className='settings-other__delete-button'
                                        outlined
                                        onClick={() => handleDeleteHowKnow(item)}
                                        disabled={
                                            !item.itemuid ||
                                            !!item.isdefault ||
                                            item.itemuid === NEW_ITEM
                                        }
                                        severity={
                                            !item.itemuid ||
                                            item.itemuid === NEW_ITEM ||
                                            !!item.isdefault
                                                ? "secondary"
                                                : "danger"
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {editedItem.itemuid === NEW_ITEM && (
                            <div className='settings-other__row'>
                                <div className='col-10 flex align-items-center p-0'>
                                    <div className='flex row-edit'>
                                        <InputText
                                            type='text'
                                            value={editedItem.description || ""}
                                            className='row-edit__input'
                                            onChange={(e) =>
                                                setEditedItem({
                                                    ...editedItem,
                                                    description: e.target.value,
                                                })
                                            }
                                            ref={newInputRef}
                                        />
                                        <Button
                                            className='p-button row-edit__button'
                                            onClick={handleSaveHowKnow}
                                            disabled={!editedItem.description}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                                <div className='col-2 p-0 settings-other__actions'>
                                    <Button
                                        className='settings-other__edit-button'
                                        outlined
                                        disabled
                                        severity='secondary'
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className='settings-other__delete-button'
                                        outlined
                                        disabled
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
