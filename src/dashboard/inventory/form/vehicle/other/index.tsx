import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement } from "react";
import "./index.css";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";

export const VehicleOther = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const { inventory, changeInventory } = store;

    return (
        <div className='grid vehicle-other row-gap-2'>
            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        value={inventory?.Notes}
                        onChange={({ target: { value } }) =>
                            changeInventory({ key: "Notes", value })
                        }
                        className='w-full vehicle-other__text-area'
                    />
                    <label className='float-label'>Notes</label>
                </span>
            </div>
        </div>
    );
});
