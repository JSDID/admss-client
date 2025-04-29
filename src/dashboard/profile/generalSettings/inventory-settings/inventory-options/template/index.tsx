import { GeneralInventoryOptions } from "common/models/general-settings";
import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ReactElement } from "react";

export const NEW_ITEM = "new";

interface InventoryOptionRowProps {
    item: Partial<GeneralInventoryOptions>;
    index: number;
    isFirst: boolean;
    draggedItemId?: string | null;
    editedItem: Partial<GeneralInventoryOptions>;
    setEditedItem: (item: Partial<GeneralInventoryOptions>) => void;
    handleSetOrder: (option: Partial<GeneralInventoryOptions>, newOrder: number) => Promise<void>;
    handleSaveOption: (option: Partial<GeneralInventoryOptions>) => void;
    handleDeleteOption: (optionuid: string) => void;
    totalOffset?: number;
}

export const HeaderColumn = (): ReactElement => {
    const template = (numberPadding: 3 | 0, namePadding?: 5 | 2) => (
        <div className='col-6 grid m-0'>
            <div
                className={`settings-inventory__number settings-inventory__number pl-${numberPadding}`}
            >
                #
            </div>
            <div className='col-1'></div>
            <div className={`settings-inventory__name justify-content-start pl-${namePadding}`}>
                Option
            </div>
        </div>
    );
    return (
        <div className='settings-inventory__header col-12 grid m-0'>
            {template(0, 2)}
            {template(3, 5)}
        </div>
    );
};

export const InventoryOptionRow = observer(
    ({
        item,
        index,
        isFirst,
        editedItem,
        setEditedItem,
        handleSaveOption,
        handleSetOrder,
        handleDeleteOption,
        draggedItemId = null,
        totalOffset = 0,
    }: InventoryOptionRowProps): ReactElement => (
        <div
            key={item.itemuid}
            className={`settings-inventory__row ${index < totalOffset / 2 ? "justify-content-start" : "justify-content-end settings-inventory__row--right"} grid col-12 ${draggedItemId === item.itemuid ? "dragged" : ""}`}
        >
            <div className='option-control p-0'>
                {item.itemuid !== NEW_ITEM && (
                    <>
                        <Button
                            icon='pi pi-arrow-circle-up'
                            rounded
                            text
                            severity={isFirst ? "secondary" : "success"}
                            tooltip='To the top'
                            className='p-button-text option-control__button'
                            onClick={() => handleSetOrder(item, index - 1)}
                            disabled={isFirst || item.itemuid === NEW_ITEM}
                        />
                        <Button
                            icon='pi pi-arrow-circle-down'
                            rounded
                            text
                            severity={
                                item.itemuid === NEW_ITEM || index === totalOffset - 1
                                    ? "secondary"
                                    : "success"
                            }
                            tooltip='To the bottom'
                            disabled={item.itemuid === NEW_ITEM || index === totalOffset - 1}
                            onClick={() => handleSetOrder(item, index + 1)}
                            className='p-button-text option-control__button'
                        />
                    </>
                )}
            </div>
            <div className='col-8 p-0 flex align-items-center'>
                {editedItem.itemuid === item.itemuid ? (
                    <div className='flex row-edit'>
                        <InputText
                            type='text'
                            value={editedItem.name || ""}
                            className='row-edit__input'
                            onChange={(e) =>
                                setEditedItem({
                                    ...editedItem,
                                    name: e.target.value,
                                })
                            }
                        />
                        <Button
                            className='p-button row-edit__button'
                            icon='icon adms-arrow-right-1'
                            onClick={() => handleSaveOption(editedItem)}
                        />
                    </div>
                ) : (
                    item.name
                )}
            </div>
            <div className='col-2 p-0 option-control'>
                {item.itemuid !== NEW_ITEM && (
                    <>
                        <Button
                            tooltip='Edit option'
                            className='inventory-options__edit-button'
                            icon='icon adms-edit-item'
                            text
                            onClick={() =>
                                editedItem.itemuid ? setEditedItem({}) : setEditedItem(item)
                            }
                        />
                        <Button
                            tooltip='Delete option'
                            className='inventory-options__delete-button'
                            icon='icon adms-trash-can'
                            text
                            onClick={() => item?.itemuid && handleDeleteOption(item.itemuid)}
                        />
                    </>
                )}
            </div>
        </div>
    )
);
