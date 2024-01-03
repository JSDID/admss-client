import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import "./index.css";
import { DashboardRadio } from "dashboard/common/form/inputs";
import { Slider, SliderChangeEvent } from "primereact/slider";
import {  useState } from "react";
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
        <div className='stock-new flex flex-column gap-4'>
            <div className='text-lg font-semibold'>Stock# for new inventory</div>
            <div className='flex align-items-center'>
                <Checkbox inputId={settings} name={settings} value={settings} checked />
                <label htmlFor={settings} className='ml-2'>
                    Sequental
                </label>
            </div>
            <div className='flex align-items-center justify-content-between'>
                <span className='p-float-label'>
                    <InputText id='stock-new-prefix' className='stock-new__input' />
                    <label htmlFor='stock-new-prefix'>Prefix</label>
                </span>
                <span className='p-float-label'>
                    <InputText id='stock-new-suffix' className='stock-new__input' />
                    <label htmlFor='stock-new-suffix'>Suffix</label>
                </span>
            </div>
            <DashboardRadio radioArray={radioSettings} />
            <div className='flex'>
                <label htmlFor={settings} className='ml-2'>
                    Fixed digits
                </label>
                <div className='flex-1 ml-8'>
                    <InputNumber
                        value={(value)}
                        max={10}
                        onChange={(e: InputNumberChangeEvent) =>
                            setValue(Number(e.value))
                        }
                        className='w-full'
                    />
                    <Slider
                        value={value}
                        onChange={(e: SliderChangeEvent) => setValue(Number(e.value))}
                        max={10}
                        className='w-full'
                    />
                </div>
            </div>
        </div>
    );
};
