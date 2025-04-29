import { Inventory } from "common/models/inventory";
import { ListData } from "common/models";
import { useFormikContext } from "formik";
import {
    getInventoryTransmissionTypesList,
    getInventoryFuelTypesList,
    getInventoryDrivelineList,
    getInventoryCylindersList,
    getInventoryEngineList,
    getInventoryBodyTypesList,
} from "http/services/inventory-service";
import { observer } from "mobx-react-lite";
import { ReactElement, useEffect, useState } from "react";
import { useStore } from "store/hooks";
import { ComboBox } from "dashboard/common/form/dropdown";

export const VehicleDescription = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const { inventory, changeInventory, formErrorIndex } = store;

    const { errors, setFieldValue } = useFormikContext<Inventory>();
    const [transmissionList, setTransmissionList] = useState<ListData[]>([]);
    const [fuelList, setFuelList] = useState<ListData[]>([]);
    const [driveLineList, setDriveLineList] = useState<ListData[]>([]);
    const [cylindersList, setCylindersList] = useState<ListData[]>([]);
    const [engineList, setEngineList] = useState<ListData[]>([]);
    const [bodyTypeList, setBodyTypeList] = useState<ListData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [transmission, fuel, driveline, cylinders, engine, bodyType] = await Promise.all([
                getInventoryTransmissionTypesList(),
                getInventoryFuelTypesList(),
                getInventoryDrivelineList(),
                getInventoryCylindersList(),
                getInventoryEngineList(),
                getInventoryBodyTypesList(),
            ]);
            setTransmissionList(transmission || []);
            setFuelList(fuel || []);
            setDriveLineList(driveline || []);
            setCylindersList(cylinders || []);
            setEngineList(engine || []);
            setBodyTypeList(bodyType || []);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (errors.TypeOfFuel_id) {
            store.formErrorIndex = [...formErrorIndex, 2];
        } else {
            store.formErrorIndex = formErrorIndex.filter((index) => index !== 2);
        }
    }, [errors]);

    return (
        <div className='grid vehicle-description row-gap-2'>
            <div className='col-6'>
                <ComboBox
                    optionLabel='name'
                    optionValue='id'
                    value={inventory.Transmission_id?.toString() || ""}
                    onChange={({ value }) => {
                        changeInventory({ key: "Transmission_id", value });
                    }}
                    options={transmissionList}
                    className='w-full vehicle-description__dropdown'
                    label='Transmission'
                />
            </div>

            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='id'
                    value={inventory.BodyStyle_id?.toString() || ""}
                    onChange={({ value }) => {
                        changeInventory({ key: "BodyStyle_id", value });
                    }}
                    options={bodyTypeList}
                    className='w-full vehicle-description__dropdown'
                    label='Body Type'
                />
            </div>

            <div className='col-3 relative'>
                <ComboBox
                    optionLabel='name'
                    optionValue='id'
                    options={fuelList}
                    value={inventory.TypeOfFuel_id?.toString()}
                    onChange={({ value }) => {
                        setFieldValue("TypeOfFuel_id", value || "0");
                        changeInventory({ key: "TypeOfFuel_id", value: value || "0" });
                    }}
                    className={`vehicle-description__dropdown w-full ${
                        errors.TypeOfFuel_id ? "p-invalid" : ""
                    }`}
                    label='Type of Fuel (required)'
                />
                <small className='p-error'>{errors.TypeOfFuel_id}</small>
            </div>
            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='id'
                    value={inventory.DriveLine_id?.toString() || ""}
                    onChange={({ value }) => {
                        changeInventory({ key: "DriveLine_id", value });
                    }}
                    options={driveLineList}
                    className='w-full vehicle-description__dropdown'
                    label='Drive Line'
                />
            </div>

            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='id'
                    value={inventory.Cylinders_id?.toString() || ""}
                    onChange={({ value }) => {
                        changeInventory({ key: "Cylinders_id", value });
                    }}
                    options={cylindersList}
                    className='w-full vehicle-description__dropdown'
                    label='Cylinders'
                />
            </div>

            <div className='col-6'>
                <ComboBox
                    optionLabel='name'
                    optionValue='id'
                    value={inventory.Engine_id?.toString() || ""}
                    onChange={({ value }) => {
                        changeInventory({ key: "Engine_id", value });
                    }}
                    options={engineList}
                    className='w-full vehicle-description__dropdown'
                    label='Engine description'
                />
            </div>
        </div>
    );
});
