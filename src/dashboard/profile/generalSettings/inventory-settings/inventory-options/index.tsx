import "./index.css";
import { Button } from "primereact/button";
import { ReactElement, useEffect, useState, useMemo } from "react";
import { UserGroup } from "common/models/user";
import { TOAST_LIFETIME } from "common/settings";
import { useToast } from "dashboard/common/toast";
import { useStore } from "store/hooks";
import { getInventoryGroupOptions } from "http/services/inventory-service";
import { Dropdown } from "primereact/dropdown";
import { observer } from "mobx-react-lite";
import { GeneralInventoryOptions } from "common/models/general-settings";
import { NEW_ITEM, InventoryOptionRow, HeaderColumn } from "./template";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import {
    deleteInventoryGroupOption,
    restoreInventoryGroupDefaults,
    setInventoryGroupOption,
} from "http/services/settings.service";
import { Loader } from "dashboard/common/loader";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const SettingsInventoryOptions = observer((): ReactElement => {
    const toast = useToast();
    const store = useStore().generalSettingsStore;
    const { inventoryGroupID, inventoryGroups } = store;
    const [isLoading, setIsLoading] = useState(false);

    const [inventoryOptions, setInventoryOptions] = useState<Partial<GeneralInventoryOptions>[]>(
        []
    );
    const [editedItem, setEditedItem] = useState<Partial<GeneralInventoryOptions>>({});

    const handleGetInventoryOptionsGroupList = async () => {
        setIsLoading(true);
        const response = await getInventoryGroupOptions(inventoryGroupID);
        if (response?.error && !Array.isArray(response)) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: response.error,
                life: TOAST_LIFETIME,
            });
        } else {
            const options = response as unknown as UserGroup[];
            setInventoryOptions(options?.filter(Boolean));
        }
        setIsLoading(false);
    };

    useEffect(() => {
        inventoryGroupID && handleGetInventoryOptionsGroupList();
    }, [inventoryGroupID]);

    const handleSaveOption = async (option: Partial<GeneralInventoryOptions>) => {
        setIsLoading(true);
        if (!option.name) {
            toast.current?.show({
                severity: "warn",
                summary: "Warning",
                detail: "Option name is required",
                life: TOAST_LIFETIME,
            });
            return;
        }

        if (!option.itemuid) {
            toast.current?.show({
                severity: "warn",
                summary: "Warning",
                detail: "Option UID is required",
                life: TOAST_LIFETIME,
            });
            return;
        }

        try {
            const isNew = option.itemuid === NEW_ITEM;
            const response = await setInventoryGroupOption(inventoryGroupID, option);
            if (response?.error) {
                throw new Error(response.error);
            }

            await handleGetInventoryOptionsGroupList();
            setEditedItem({});

            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: isNew ? "Option created successfully" : "Option updated successfully",
                life: TOAST_LIFETIME,
            });
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: `Failed to ${option.itemuid === NEW_ITEM ? "create" : "update"} option`,
                life: TOAST_LIFETIME,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteOption = async (optionuid: string) => {
        setIsLoading(true);
        const response = await deleteInventoryGroupOption(optionuid);
        if (response?.error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: response?.error,
                life: TOAST_LIFETIME,
            });
        } else {
            await handleGetInventoryOptionsGroupList();
        }
        setIsLoading(false);
    };

    const handleChangeOrder = async (
        option: Partial<GeneralInventoryOptions>,
        newOrder?: number
    ) => {
        const response = await setInventoryGroupOption(inventoryGroupID, {
            ...option,
            order: newOrder || option.order,
        });
        if (response?.error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update order",
                life: TOAST_LIFETIME,
            });
        } else {
            await handleGetInventoryOptionsGroupList();
        }
    };

    const handleRestoreDefaults = async () => {
        setIsLoading(true);
        const response = await restoreInventoryGroupDefaults(inventoryGroupID);
        if (response?.error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: response?.error,
                life: TOAST_LIFETIME,
            });
        } else {
            await handleGetInventoryOptionsGroupList();
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Inventory group defaults restored successfully",
                life: TOAST_LIFETIME,
            });
        }
        setIsLoading(false);
    };

    const handleDragItem = async (layout: Layout[], oldItem: Layout, newItem: Layout) => {
        if (oldItem.x === newItem.x && oldItem.y === newItem.y) {
            return;
        }

        setIsLoading(true);
        const sortedLayout = [...layout].sort((a, b) => {
            if (a.x === b.x) return a.y - b.y;
            return a.x - b.x;
        });

        const updatedOptions = sortedLayout
            .map((layoutItem, index) => {
                const originalItem = inventoryOptions.find((opt) => opt.itemuid === layoutItem.i);
                return {
                    ...originalItem,
                    order: index,
                };
            })
            .filter(Boolean) as Partial<GeneralInventoryOptions>[];

        const updatedOption = updatedOptions.find((opt) => opt.itemuid === newItem.i);
        updatedOption && (await handleChangeOrder(updatedOption));
        setIsLoading(false);
    };

    const layouts = useMemo(() => {
        const itemsPerColumn = Math.ceil(inventoryOptions.length / 2);
        return {
            lg: inventoryOptions.map((item, index) => ({
                i: item.itemuid || `${index}`,
                x: index < itemsPerColumn ? 0 : 1,
                y: index % itemsPerColumn,
                w: 1,
                h: 1,
            })),
        };
    }, [inventoryOptions]);

    const handleNewOption = () => {
        setEditedItem({ name: "", itemuid: NEW_ITEM });
        setInventoryOptions([...inventoryOptions, { name: "", itemuid: NEW_ITEM }]);
        setTimeout(() => {
            const contentRef = document.querySelector(
                ".settings-inventory__tabs .p-tabview-panels"
            ) as HTMLDivElement;
            if (contentRef) {
                contentRef.scrollTo({ top: contentRef.scrollHeight, behavior: "smooth" });
            }
        }, 100);
    };

    return isLoading ? (
        <div className='form-loader'>
            <Loader />
        </div>
    ) : (
        <>
            <div className='flex justify-content-end align-items-center mb-4'>
                <div className='col-3'>
                    <span className='p-float-label'>
                        <Dropdown
                            optionLabel='description'
                            optionValue='itemuid'
                            filter
                            options={inventoryGroups}
                            value={inventoryGroupID}
                            onChange={(e) => {
                                store.inventoryGroupID = e.value;
                            }}
                            placeholder='Group class'
                            className={`w-full vehicle-general__dropdown`}
                        />
                        <label className='float-label'>Options by inventory group</label>
                    </span>
                </div>
                <Button
                    className='ml-auto settings-form__button'
                    severity='warning'
                    outlined
                    onClick={handleRestoreDefaults}
                >
                    Reset to Default
                </Button>
                <Button className='ml-4 settings-form__button' outlined onClick={handleNewOption}>
                    New Option
                </Button>
            </div>
            <div className='grid general-inventory-option p-2'>
                <HeaderColumn />

                {!inventoryOptions.length ? (
                    <div className='col-12'>No options available</div>
                ) : (
                    <div className='col-12 grid p-0 inventory-options-container'>
                        <div className='inventory-numbers inventory-numbers--left'>
                            {inventoryOptions
                                .slice(0, Math.ceil(inventoryOptions.length / 2))
                                .map((_, index) => (
                                    <div
                                        key={index}
                                        className='inventory-option-number col-1 flex align-items-center'
                                    >
                                        <span className='option-control__number'>{index + 1}</span>
                                    </div>
                                ))}
                        </div>
                        {}
                        <div className='inventory-content'>
                            <ResponsiveReactGridLayout
                                className='layout relative'
                                layouts={layouts}
                                cols={{ lg: 2, md: 2, sm: 2, xs: 2, xxs: 1 }}
                                rowHeight={45}
                                width={600}
                                margin={[10, 1]}
                                isDraggable={true}
                                isDroppable={true}
                                onDragStop={handleDragItem}
                                draggableCancel='.option-control__button, .inventory-options__edit-button, .inventory-options__delete-button, .row-edit'
                            >
                                {inventoryOptions.map((item, index) => (
                                    <div
                                        key={item.itemuid || `${index}`}
                                        className={`cursor-move ${
                                            index < Math.ceil(inventoryOptions.length / 2)
                                                ? "mr-2"
                                                : "pl-3"
                                        }`}
                                    >
                                        <InventoryOptionRow
                                            item={item}
                                            index={index}
                                            isFirst={index === 0}
                                            editedItem={editedItem}
                                            setEditedItem={setEditedItem}
                                            handleSaveOption={handleSaveOption}
                                            handleSetOrder={handleChangeOrder}
                                            handleDeleteOption={handleDeleteOption}
                                            totalOffset={inventoryOptions.length}
                                        />
                                    </div>
                                ))}
                            </ResponsiveReactGridLayout>
                        </div>
                        <div className='inventory-numbers inventory-numbers--right'>
                            {inventoryOptions
                                .slice(Math.ceil(inventoryOptions.length / 2))
                                .map((_, index) => (
                                    <div
                                        key={index}
                                        className='inventory-option-number col-1 flex align-items-center'
                                    >
                                        <span className='option-control__number'>
                                            {index + Math.ceil(inventoryOptions.length / 2) + 1}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
});
