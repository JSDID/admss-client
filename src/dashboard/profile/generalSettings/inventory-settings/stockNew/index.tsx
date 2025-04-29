import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import "./index.css";
import { DashboardRadio } from "dashboard/common/form/inputs";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { useState } from "react";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";

interface SettingsStockNewProps {
    settings?: any;
    radioSettings: {
        name: string;
        title: string;
        value: number;
    }[];
}

export const SettingsStockNew = ({ settings, radioSettings }: SettingsStockNewProps) => {
    const [value, setValue] = useState<number>(5);
    return (
        <div className='grid'>
            <div className='col-3'>
                <div className='flex align-items-center'>
                    <Checkbox inputId={settings} name={settings} value={settings} checked />
                    <label htmlFor={settings} className='ml-2'>
                        Sequental
                    </label>
                </div>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText className='stock-new__input' />
                    <label className='float-label'>Prefix</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText className='stock-new__input' />
                    <label className='float-label'>Suffix</label>
                </span>
            </div>
            <div className='col-6'>
                <DashboardRadio radioArray={radioSettings} />
            </div>

            <div className='col-6 mt-3'>
                <span className='p-float-label'>
                    <InputNumber
                        value={value}
                        max={10}
                        onChange={(e: InputNumberChangeEvent) => setValue(Number(e.value))}
                        className='w-full'
                    />
                    <Slider
                        value={value}
                        onChange={(e: SliderChangeEvent) => setValue(Number(e.value))}
                        max={10}
                        className='w-full'
                    />
                    <label htmlFor={settings} className='float-label'>
                        Fixed digits
                    </label>
                </span>
            </div>
        </div>
    );
};
