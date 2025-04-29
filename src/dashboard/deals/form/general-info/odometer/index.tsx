import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { useStore } from "store/hooks";
import { Deal, DealExtData } from "common/models/deals";
import { useFormikContext } from "formik";
import { ComboBox } from "dashboard/common/form/dropdown";

export const DealGeneralOdometer = observer((): ReactElement => {
    const store = useStore().dealStore;
    const { values, errors, setFieldValue, getFieldProps } = useFormikContext<Deal & DealExtData>();
    const {
        dealExtData: { OdomInExcess, OdomNotActual },
        changeDealExtData,
    } = store;
    return (
        <div className='grid deal-general-odometer row-gap-2'>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        {...getFieldProps("OdometerReading")}
                        className={`'deal-odometer__text-input w-full' ${
                            errors.OdometerReading ? "p-invalid" : ""
                        }`}
                        value={values.OdometerReading}
                        onChange={(e) => {
                            setFieldValue("OdometerReading", e.target.value);
                            changeDealExtData({ key: "OdometerReading", value: e.target.value });
                        }}
                    />
                    <label className='float-label'>Reading at Time of Sale (required)</label>
                    <small className='p-error'>{errors.OdometerReading}</small>
                </span>
            </div>
            <div className='col-3'>
                <ComboBox
                    {...getFieldProps("OdomDigits")}
                    value={values.OdomDigits}
                    onChange={(e) => {
                        setFieldValue("OdomDigits", e.value);
                        changeDealExtData({ key: "OdomDigits", value: e.value });
                    }}
                    options={[5, 6, 7, 8]}
                    label='Number of Digits (required)'
                    required
                    className={`'w-full deal-odometer__dropdown' ${
                        errors.OdomDigits ? "p-invalid" : ""
                    }`}
                />

                <small className='p-error'>{errors.OdomDigits}</small>
            </div>
            <div className='col-3'>
                <div className='deal-odometer__checkbox flex px-2'>
                    <Checkbox
                        inputId='deal-odometer-reflects'
                        className='mt-1'
                        name='deal-odometer-reflects'
                        checked={!!OdomInExcess}
                        onChange={() =>
                            changeDealExtData({ key: "OdomInExcess", value: Number(!OdomInExcess) })
                        }
                    />
                    <label htmlFor='deal-odometer-reflects' className='ml-2'>
                        Odometer reflects the milage in EXCESS of its limits
                    </label>
                </div>
            </div>
            <div className='col-3'>
                <div className='deal-odometer__checkbox flex px-2'>
                    <Checkbox
                        inputId='deal-odometer-not-actual'
                        className='mt-1'
                        name='deal-odometer-not-actual'
                        checked={!!OdomNotActual}
                        onChange={() =>
                            changeDealExtData({
                                key: "OdomNotActual",
                                value: Number(!OdomNotActual),
                            })
                        }
                    />
                    <label htmlFor='deal-odometer-not-actual' className='ml-2'>
                        Odometer is NOT the actual mileage - DISCREPANCY
                    </label>
                </div>
            </div>
        </div>
    );
});
