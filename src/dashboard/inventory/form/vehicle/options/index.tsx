import { Checkbox } from "primereact/checkbox";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { getInventoryGroupOptions, getInventoryOptions } from "http/services/inventory-service";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { InventoryOptions, OptionsListData } from "common/models/inventory";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";

export const VehicleOptions = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const toast = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const { inventoryGroupID, inventoryOptions, changeInventoryOptions } = store;
    const [options, setOptions] = useState<OptionsListData[]>([]);

    const handleGetInventoryOptionsGroupList = async () => {
        const response = await getInventoryGroupOptions(inventoryGroupID);
        if (response?.error && !Array.isArray(response)) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: response.error,
                life: TOAST_LIFETIME,
            });
        } else {
            const options = response as unknown as OptionsListData[];
            setOptions(options?.filter(Boolean));
        }
    };

    const handleGetInventoryOptionsList = async () => {
        if (!id) return;
        const response = await getInventoryOptions(id);
        if (response?.error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: response.error,
                life: TOAST_LIFETIME,
            });
        } else {
            const { options_list } = response as InventoryOptions;
            if (!options_list?.filter(Boolean).length && inventoryGroupID) {
                handleGetInventoryOptionsList();
            } else {
                setOptions(
                    options_list?.filter((option): option is OptionsListData => option != null)
                );
            }
        }
    };

    useEffect(() => {
        if (id) {
            handleGetInventoryOptionsList();
        } else {
            inventoryGroupID && handleGetInventoryOptionsGroupList();
        }
    }, [id, inventoryGroupID]);

    return (
        <div className='grid flex-column vehicle-options'>
            <Button
                label='Edit options'
                type='button'
                className='p-button vehicle-options__button'
                onClick={() => {
                    navigate(`/dashboard/settings`);
                }}
            />
            {!id && !inventoryGroupID && (
                <p className='vehicle-options__title'>
                    Select inventory group first for getting options
                </p>
            )}

            {!id && inventoryGroupID && !options?.length && (
                <p className='vehicle-options__title'>Inventory group has no options</p>
            )}
            <div className='vehicle-options__list'>
                {options?.map(({ name, index }) => (
                    <div key={index} className='vehicle-options__checkbox flex align-items-center'>
                        <Checkbox
                            inputId={name}
                            name={name}
                            onChange={() => changeInventoryOptions(name)}
                            checked={inventoryOptions.includes(name)}
                        />
                        <label htmlFor={name} className='ml-2'>
                            {name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
});
