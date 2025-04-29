import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement } from "react";
import "./index.css";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { InventoryExtData } from "common/models/inventory";
import { BorderedCheckbox, StateDropdown } from "dashboard/common/form/inputs";

export const VehicleDisclosures = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const {
        inventoryExtData: {
            dam25,
            dam25Parts,
            damTheftParts,
            damTheft,
            damFlood,
            damODOMInExcess,
            damODOMNotActual,
            damReconstructed,
            damSalvage,
            damSalvageState,
        },
        changeInventoryExtData,
    } = store;

    const handleChange = (key: keyof InventoryExtData, value: number) => {
        changeInventoryExtData({ key, value: !!value ? 0 : 1 });
    };

    return (
        <div className='grid vehicle-disclosures row-gap-2'>
            <div className='flex col-12 py-3'>
                <h3 className='text-line__title text-line__title--red m-0 pr-3'>
                    Odometer discrepancy
                </h3>
                <hr className='text-line__line flex-1' />
            </div>
            <div className='col-6'>
                <BorderedCheckbox
                    className='mt-1'
                    inputId='disclosures-excess'
                    onChange={() => handleChange("damODOMInExcess", damODOMInExcess)}
                    checked={!!damODOMInExcess}
                    name='Odometer reflects the milage in EXCESS of its limits'
                />
            </div>
            <div className='col-6'>
                <BorderedCheckbox
                    className='mt-1'
                    inputId='disclosures-discrepancy'
                    onChange={() => handleChange("damODOMNotActual", damODOMNotActual)}
                    checked={!!damODOMNotActual}
                    name='Odometer is NOT the actual mileage - DISCREPANCY'
                />
            </div>

            <div className='flex col-12 py-3'>
                <h3 className='text-line__title text-line__title--red m-0 pr-3'>
                    Damage discrepancy
                </h3>
                <hr className='text-line__line flex-1' />
            </div>

            <div className='col-6'>
                <BorderedCheckbox
                    inputId='disclosures-salvage'
                    className='mt-1'
                    onChange={() => handleChange("damSalvage", damSalvage)}
                    checked={!!damSalvage}
                    name='Vehicle is a Salvage Vehicle'
                />
            </div>

            <div className='col-3'>
                <StateDropdown
                    name='State'
                    showClear={!!damSalvageState}
                    value={damSalvageState}
                    onChange={({ value }) =>
                        changeInventoryExtData({ key: "damSalvageState", value: value || "" })
                    }
                />
            </div>
            <div className='col-6 mr-2'>
                <BorderedCheckbox
                    inputId='disclosures-flood'
                    className='mt-1'
                    onChange={() => handleChange("damFlood", damFlood)}
                    checked={!!damFlood}
                    name='Vehicle is a Flood Vehicle'
                />
            </div>
            <div className='col-6 mr-2'>
                <BorderedCheckbox
                    inputId='disclosures-reconstructed'
                    className='mt-1'
                    onChange={() => handleChange("damReconstructed", damReconstructed)}
                    checked={!!damReconstructed}
                    name='Vehicle has been Reconstructed'
                />
            </div>

            <div className='col-6'>
                <BorderedCheckbox
                    inputId='disclosures-damage'
                    className='mt-1'
                    onChange={() => handleChange("dam25", dam25)}
                    checked={!!dam25}
                    name='Vehicle suffered damage of at least 25%'
                />
            </div>
            <div className='col-6'>
                <span className='p-float-label'>
                    <InputTextarea
                        className='w-full vehicle-disclosures__text-area'
                        value={dam25Parts}
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "dam25Parts", value })
                        }
                    />
                    <label className='float-label'>Parts Damaged</label>
                </span>
            </div>

            <div className='col-6'>
                <BorderedCheckbox
                    inputId='disclosures-recovered'
                    className='mt-1'
                    onChange={() => handleChange("damTheft", damTheft)}
                    checked={!!damTheft}
                    name='Vehicle is a Recovered Theft Vehicle'
                />
            </div>

            <div className='col-6'>
                <span className='p-float-label'>
                    <InputTextarea
                        className='w-full vehicle-disclosures__text-area'
                        value={damTheftParts}
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "damTheftParts", value })
                        }
                    />
                    <label className='float-label'>Theft Parts Damaged</label>
                </span>
            </div>
        </div>
    );
});
