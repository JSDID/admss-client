import { observer } from "mobx-react-lite";
import { InputText } from "primereact/inputtext";
import { ReactElement } from "react";
import { useStore } from "store/hooks";

export const ExportWebFuel = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const { inventoryExportWeb, changeExportWeb } = store;
    return (
        <div className='grid export-web-fuel row-gap-2'>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='export-web-fuel__text-input w-full'
                        value={inventoryExportWeb.CityMPG}
                        onChange={({ target: { value } }) =>
                            changeExportWeb({ key: "CityMPG", value })
                        }
                    />
                    <label className='float-label'>City MPG</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='export-web-fuel__text-input w-full'
                        value={inventoryExportWeb.HwyMPG}
                        onChange={({ target: { value } }) =>
                            changeExportWeb({ key: "HwyMPG", value })
                        }
                    />
                    <label className='float-label'>Hwy MPG</label>
                </span>
            </div>
        </div>
    );
});
