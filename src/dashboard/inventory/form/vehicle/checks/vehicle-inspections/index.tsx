import { InventoryExtData, Inventory } from "common/models/inventory";
import { observer } from "mobx-react-lite";
import { Checkbox } from "primereact/checkbox";
import { ReactElement } from "react";
import { useStore } from "store/hooks";

export const VehicleInspections = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const {
        inventory: { FactoryCertified, DealerCertified },
        changeInventoryExtData,
        changeInventory,
        inventoryExtData: {
            chkAutocheckChecked,
            chkInspected,
            chkOil,
            chkCustom0,
            chkCustom1,
            chkCustom2,
            chkCustom3,
            chkCustom4,
            chkCustom5,
            chkCustom6,
            chkCustom7,
            chkCustom8,
            chkCustom9,
        },
    } = store;

    const handleChange = (
        key: keyof InventoryExtData | keyof Pick<Inventory, "DealerCertified" | "FactoryCertified">,
        value: number
    ) => {
        if (key === "DealerCertified" || key === "FactoryCertified") {
            changeInventory({ key, value: !!value ? 0 : 1 });
        } else {
            changeInventoryExtData({ key, value: !!value ? 0 : 1 });
        }
    };
    return (
        <div className='grid flex-column vehicle-checks'>
            <div className='grid flex-column vehicle-checks__top'>
                <div className='vehicle-checks__column'>
                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='chkAutocheckChecked'
                            onChange={() =>
                                handleChange("chkAutocheckChecked", chkAutocheckChecked)
                            }
                            checked={!!chkAutocheckChecked}
                        />
                        <label htmlFor='chkAutocheckChecked' className='ml-2'>
                            AutoCheck done
                        </label>
                    </div>
                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='chkInspected'
                            onChange={() => handleChange("chkInspected", chkInspected)}
                            checked={!!chkInspected}
                        />
                        <label htmlFor='chkInspected' className='ml-2'>
                            State inspection Performed
                        </label>
                    </div>
                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='DealerCertified'
                            onChange={() => handleChange("DealerCertified", DealerCertified)}
                            checked={!!DealerCertified}
                        />
                        <label htmlFor='DealerCertified' className='ml-2'>
                            Dealer Certified
                        </label>
                    </div>
                </div>
                <div className='vehicle-checks__column'>
                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='chkOil'
                            onChange={() => handleChange("chkOil", chkOil)}
                            checked={!!chkOil}
                        />
                        <label htmlFor='chkOil' className='ml-2'>
                            Oil and Filter inspected and changed
                        </label>
                    </div>
                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='FactoryCertified'
                            onChange={() => handleChange("FactoryCertified", FactoryCertified)}
                            checked={!!FactoryCertified}
                        />
                        <label htmlFor='FactoryCertified' className='ml-2'>
                            Factory Certified
                        </label>
                    </div>
                </div>
            </div>
            <div className='grid flex-column vehicle-checks__bottom'>
                <div className='vehicle-checks__column'>
                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='custom0'
                            onChange={() => handleChange("chkCustom0", chkCustom0)}
                            checked={!!chkCustom0}
                        />
                        <label htmlFor='custom0' className='ml-2'>
                            User defined inspection #1
                        </label>
                    </div>
                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='custom1'
                            onChange={() => handleChange("chkCustom1", chkCustom1)}
                            checked={!!chkCustom1}
                        />
                        <label htmlFor='custom1' className='ml-2'>
                            User defined inspection #2
                        </label>
                    </div>

                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='custom2'
                            onChange={() => handleChange("chkCustom2", chkCustom2)}
                            checked={!!chkCustom2}
                        />
                        <label htmlFor='custom2' className='ml-2'>
                            User defined inspection #3
                        </label>
                    </div>

                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='custom3'
                            onChange={() => handleChange("chkCustom3", chkCustom3)}
                            checked={!!chkCustom3}
                        />
                        <label htmlFor='custom3' className='ml-2'>
                            User defined inspection #4
                        </label>
                    </div>

                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='custom4'
                            onChange={() => handleChange("chkCustom4", chkCustom4)}
                            checked={!!chkCustom4}
                        />
                        <label htmlFor='custom4' className='ml-2'>
                            User defined inspection #5
                        </label>
                    </div>
                </div>
                <div className='vehicle-checks__column'>
                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='custom5'
                            onChange={() => handleChange("chkCustom5", chkCustom5)}
                            checked={!!chkCustom5}
                        />
                        <label htmlFor='custom5' className='ml-2'>
                            User defined inspection #6
                        </label>
                    </div>

                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='custom6'
                            onChange={() => handleChange("chkCustom6", chkCustom6)}
                            checked={!!chkCustom6}
                        />
                        <label htmlFor='custom6' className='ml-2'>
                            User defined inspection #7
                        </label>
                    </div>

                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='custom7'
                            onChange={() => handleChange("chkCustom7", chkCustom7)}
                            checked={!!chkCustom7}
                        />
                        <label htmlFor='custom7' className='ml-2'>
                            User defined inspection #8
                        </label>
                    </div>

                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='custom8'
                            onChange={() => handleChange("chkCustom8", chkCustom8)}
                            checked={!!chkCustom8}
                        />
                        <label htmlFor='custom8' className='ml-2'>
                            User defined inspection #9
                        </label>
                    </div>

                    <div className='vehicle-checks__checkbox flex align-items-center'>
                        <Checkbox
                            inputId='custom9'
                            onChange={() => handleChange("chkCustom9", chkCustom9)}
                            checked={!!chkCustom9}
                        />
                        <label htmlFor='custom9' className='ml-2'>
                            User defined inspection #10
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
});
