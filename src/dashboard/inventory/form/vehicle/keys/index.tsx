import { ReactElement } from "react";
import { InputText } from "primereact/inputtext";
import { BorderedCheckbox } from "dashboard/common/form/inputs";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { InventoryExtData } from "common/models/inventory";

export const VehicleKeys = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const {
        inventoryExtData: { keysMissing, keysHasRemote, keysDuplicate, keyNumber },
        changeInventoryExtData,
    } = store;

    const handleChange = (key: keyof InventoryExtData, value: number) => {
        changeInventoryExtData({ key, value: !!value ? 0 : 1 });
    };

    return (
        <div className='grid vehicle-keys row-gap-2'>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Keys missing'
                    checked={!!keysMissing}
                    onChange={() => handleChange("keysMissing", keysMissing)}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Duplicate Keys'
                    checked={!!keysDuplicate}
                    onChange={() => handleChange("keysDuplicate", keysDuplicate)}
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Has Remote'
                    checked={!!keysHasRemote}
                    onChange={() => handleChange("keysHasRemote", keysHasRemote)}
                />
            </div>

            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        placeholder='Key number/ Location'
                        value={keyNumber}
                        className='w-full vehicle-keys__dropdown'
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "keyNumber", value })
                        }
                    />
                    <label className='float-label'>Key number/ Location</label>
                </span>
            </div>
        </div>
    );
});
