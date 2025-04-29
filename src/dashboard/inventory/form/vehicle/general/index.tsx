import { InputText } from "primereact/inputtext";
import "./index.css";
import { ReactElement, useCallback, useEffect, useState } from "react";
import {
    getAutoMakeModelList,
    getInventoryAutomakesList,
    getInventoryExteriorColorsList,
    getInventoryInteriorColorsList,
    getInventoryLocations,
} from "http/services/inventory-service";

import { useFormikContext } from "formik";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { VehicleDecodeInfo } from "http/services/vin-decoder.service";
import { Checkbox } from "primereact/checkbox";
import { Audit, Inventory, InventoryLocations, MakesListData } from "common/models/inventory";
import { InputNumber } from "primereact/inputnumber";

import defaultMakesLogo from "assets/images/default-makes-logo.svg";
import { getUserGroupActiveList } from "http/services/auth-user.service";
import { UserGroup } from "common/models/user";
import { VINDecoder } from "dashboard/common/form/vin-decoder";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { ListData } from "common/models";
import { ComboBox } from "dashboard/common/form/dropdown";

const EQUIPMENT = "equipment";
const DEFAULT_LOCATION = "default";

const parseMileage = (mileage: string): number => {
    return parseFloat(mileage.replace(/,/g, ""));
};

export const VehicleGeneral = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const userStore = useStore().userStore;
    const { authUser } = userStore;
    const { inventory, currentLocation, changeInventory, inventoryAudit, changeInventoryAudit } =
        store;
    const { values, errors, setFieldValue, getFieldProps, validateField, setFieldTouched } =
        useFormikContext<Inventory>();

    const [initialAutoMakesList, setInitialAutoMakesList] = useState<MakesListData[]>([]);
    const [automakesList, setAutomakesList] = useState<MakesListData[]>([]);
    const [automakesModelList, setAutomakesModelList] = useState<ListData[]>([]);
    const [colorList, setColorList] = useState<ListData[]>([]);
    const [interiorList, setInteriorList] = useState<ListData[]>([]);
    const [groupClassList, setGroupClassList] = useState<UserGroup[]>([]);
    const [locationList, setLocationList] = useState<InventoryLocations[]>([]);
    const [allowOverwrite, setAllowOverwrite] = useState<boolean>(false);
    const [selectedAuditKey, setSelectedAuditKey] = useState<keyof Audit | null>(null);

    useEffect(() => {
        getInventoryAutomakesList().then((list) => {
            if (list) {
                const upperCasedList = list.map((item) => ({
                    ...item,
                    name: item.name.toUpperCase(),
                }));
                setInitialAutoMakesList(upperCasedList);
                setAutomakesList(upperCasedList);
            }
        });
        getInventoryExteriorColorsList().then((list) => {
            list && setColorList(list);
        });
        getInventoryInteriorColorsList().then((list) => {
            list && setInteriorList(list);
        });
    }, []);

    const handleGetInventoryGroupFullInfo = (groupName: string) => {
        if (groupName) {
            const activeGroup = groupClassList.find(
                (group) => group.description === inventory.GroupClassName
            );
            if (activeGroup) {
                store.inventoryGroupID = activeGroup.itemuid;
            }
        }
    };

    useEffect(() => {
        if (authUser) {
            getInventoryLocations(authUser.useruid).then((list) => {
                if (list && Array.isArray(list)) {
                    setLocationList(list);
                }
            });
            getUserGroupActiveList(authUser.useruid).then((list) => {
                if (list && Array.isArray(list)) {
                    setGroupClassList(list);
                    if (list.some((group) => group.description === inventory.GroupClassName)) {
                        handleGetInventoryGroupFullInfo(inventory.GroupClassName);
                    }
                }
            });
        }
    }, [authUser]);

    useEffect(() => {
        if (!values?.locationuid?.trim() && !!locationList.length) {
            const defaultLocation = locationList.find(
                (location) => location.locName.toLowerCase() === DEFAULT_LOCATION
            );
            store.currentLocation = defaultLocation?.locationuid || locationList[0]?.locationuid;
        }
    }, [currentLocation, locationList, values.locationuid, store]);

    const handleSelectMake = useCallback(() => {
        const makeSting = inventory.Make.toLowerCase().replaceAll(" ", "");
        if (automakesList.some((item) => item.name.toLocaleLowerCase() === makeSting)) {
            getAutoMakeModelList(makeSting).then((list) => {
                if (list && Object.keys(list).length) {
                    setAutomakesModelList(list);
                } else {
                    setAutomakesModelList([]);
                }
            });
        }
    }, [automakesList, inventory.Make]);

    useEffect(() => {
        if (inventory.Make) handleSelectMake();
    }, [handleSelectMake, inventory.Make]);

    const selectedAutoMakesTemplate = (option: MakesListData) => {
        return (
            <div className='flex align-items-center'>
                <img
                    alt={option.name}
                    src={option?.logo || defaultMakesLogo}
                    className='mr-2 vehicle-general__dropdown-icon'
                />
                <div>{option.name}</div>
            </div>
        );
    };

    const autoMakesOptionTemplate = (option: MakesListData) => {
        return (
            <div className='flex align-items-center'>
                <img
                    alt={option.name}
                    src={option?.logo || defaultMakesLogo}
                    className='mr-2 vehicle-general__dropdown-icon'
                />
                <div>{option.name}</div>
            </div>
        );
    };

    const handleVINchange = (vinInfo: VehicleDecodeInfo) => {
        if (vinInfo && inventory.GroupClassName !== EQUIPMENT) {
            if (allowOverwrite) {
                changeInventory({ key: "Make", value: vinInfo.Make || values.Make });
                changeInventory({ key: "Model", value: vinInfo.Model || values.Model });
                changeInventory({ key: "Year", value: vinInfo.Year || values.Year });
                changeInventory({
                    key: "GroupClassName",
                    value: vinInfo.GroupClassName || values.GroupClassName,
                });
                changeInventory({
                    key: "Transmission_id",
                    value: vinInfo.Transmission_id || values.Transmission_id,
                });
                changeInventory({
                    key: "TypeOfFuel_id",
                    value: vinInfo.TypeOfFuel_id || values.TypeOfFuel_id,
                });
                changeInventory({
                    key: "DriveLine_id",
                    value: vinInfo.DriveLine_id || values.DriveLine_id,
                });
                changeInventory({
                    key: "Cylinders_id",
                    value: vinInfo.Cylinders_id || values.Cylinders_id,
                });
                changeInventory({ key: "Engine_id", value: vinInfo.Engine_id || values.Engine_id });
                changeInventory({ key: "StockNo", value: vinInfo.StockNo || values.StockNo });
                changeInventory({ key: "Trim", value: vinInfo.Trim || values.Trim });
                changeInventory({
                    key: "BodyStyle_id",
                    value: vinInfo.BodyStyle || values.BodyStyle_id,
                });
                changeInventory({
                    key: "InteriorColor",
                    value: vinInfo.InteriorColor || values.InteriorColor,
                });
                changeInventory({
                    key: "ExteriorColor",
                    value: vinInfo.ExteriorColor || values.ExteriorColor,
                });
                changeInventory({ key: "mileage", value: vinInfo.mileage || values.mileage });
            } else {
                changeInventory({ key: "Make", value: inventory.Make || vinInfo.Make });
                changeInventory({ key: "Model", value: inventory.Model || vinInfo.Model });
                changeInventory({ key: "Year", value: inventory.Year || vinInfo.Year });
                changeInventory({
                    key: "GroupClassName",
                    value: inventory.GroupClassName || vinInfo.GroupClassName,
                });
                changeInventory({
                    key: "Transmission_id",
                    value: inventory.Transmission_id || vinInfo.Transmission_id,
                });
                changeInventory({
                    key: "TypeOfFuel_id",
                    value: inventory.TypeOfFuel_id || vinInfo.TypeOfFuel_id,
                });
                changeInventory({
                    key: "DriveLine_id",
                    value: inventory.DriveLine_id || vinInfo.DriveLine_id,
                });
                changeInventory({
                    key: "Cylinders_id",
                    value: inventory.Cylinders_id || vinInfo.Cylinders_id,
                });
                changeInventory({
                    key: "Engine_id",
                    value: inventory.Engine_id || vinInfo.Engine_id,
                });
                changeInventory({ key: "StockNo", value: inventory.StockNo || vinInfo.StockNo });
                changeInventory({ key: "Trim", value: inventory.Trim || vinInfo.Trim });
                changeInventory({
                    key: "BodyStyle_id",
                    value: inventory.BodyStyle_id || vinInfo.BodyStyle,
                });
                changeInventory({
                    key: "InteriorColor",
                    value: inventory.InteriorColor || vinInfo.InteriorColor,
                });
                changeInventory({
                    key: "ExteriorColor",
                    value: inventory.ExteriorColor || vinInfo.ExteriorColor,
                });
                changeInventory({ key: "mileage", value: inventory.mileage || vinInfo.mileage });
            }
        }
    };

    const renderedAuditKeys: (keyof Audit)[] = [
        "JustArrived",
        "NeedsCleaning",
        "DataNeedsUpdate",
        "ReadyForSale",
    ];

    useEffect(() => {
        const activeKey = renderedAuditKeys.find((key) => inventoryAudit[key] === 1) || null;
        setSelectedAuditKey(activeKey);
    }, [inventoryAudit]);

    const auditOptions = renderedAuditKeys.map((key) => ({
        label: key.replace(/(?!^)([A-Z]|\d+)/g, " $1"),
        value: key,
    }));

    const handleAuditChange = (value: keyof Audit) => {
        changeInventoryAudit(value);

        renderedAuditKeys.forEach((key) => {
            if (key !== value) {
                const auditValue = inventoryAudit[key] as number;
                if (auditValue === 1) {
                    changeInventoryAudit(key);
                }
            }
        });

        setSelectedAuditKey(value);
    };

    return (
        <div className='grid vehicle-general row-gap-2'>
            <div className='col-6 relative'>
                <ComboBox
                    optionLabel='locName'
                    optionValue='locationuid'
                    options={locationList}
                    value={values.locationuid}
                    onChange={({ value }) => {
                        setFieldValue("locationuid", value || locationList[0].locationuid);
                        changeInventory({
                            key: "locationuid",
                            value: value || locationList[0].locationuid,
                        });
                    }}
                    placeholder='Location name'
                    className={`w-full vehicle-general__dropdown ${
                        inventory.locationuid === "" && "p-inputwrapper-filled"
                    } ${errors.locationuid ? "p-invalid" : ""}`}
                    label='Location name (required)'
                />
                <small className='p-error'>{errors.locationuid}</small>
            </div>
            <div className='col-3 relative'>
                <ComboBox
                    optionLabel='description'
                    optionValue='description'
                    options={groupClassList}
                    value={values?.GroupClassName}
                    onChange={({ value }) => {
                        setFieldValue("GroupClassName", value);
                        changeInventory({
                            key: "GroupClassName",
                            value,
                        });
                        handleGetInventoryGroupFullInfo(value);
                    }}
                    placeholder='Group class'
                    className={`w-full vehicle-general__dropdown ${
                        errors.GroupClassName ? "p-invalid" : ""
                    }`}
                    label='Inventory group (required)'
                />
                <small className='p-error'>{errors.GroupClassName}</small>
            </div>

            <div className='col-12'>
                <hr className='form-line' />
            </div>
            {inventory.GroupClassName === EQUIPMENT ? (
                <div className='col-6 relative'>
                    <span className='p-float-label'>
                        <InputText
                            value={values.VIN}
                            onChange={({ target: { value } }) => {
                                setFieldValue("VIN", value);
                                changeInventory({ key: "VIN", value });
                            }}
                            className={`w-full ${errors.VIN ? "p-invalid" : ""}`}
                        />
                        <label className='float-label'>VIN (required)</label>
                    </span>
                    <small className='p-error'>{errors.VIN}</small>
                </div>
            ) : (
                <>
                    <div className='col-12'>
                        <div className='vehicle-general-overwrite pb-3'>
                            <Checkbox
                                checked={allowOverwrite}
                                inputId='vehicle-general-overwrite'
                                className='vehicle-general-overwrite__checkbox'
                                onChange={() => setAllowOverwrite(!allowOverwrite)}
                            />
                            <label
                                htmlFor='vehicle-general-overwrite'
                                className='pl-3 vehicle-general-overwrite__label'
                            >
                                Overwrite data
                            </label>
                            <Button
                                text
                                tooltip='Data received from the VIN decoder service will overwrite user-entered data.'
                                icon='icon adms-help'
                                type='button'
                                severity='info'
                                className='vehicle-general-overwrite__icon transparent'
                            />
                        </div>
                    </div>

                    <div className='col-6 relative'>
                        <VINDecoder
                            value={values.VIN}
                            onChange={async ({ target: { value } }) => {
                                await setFieldValue("VIN", value);
                                await setFieldTouched("VIN", true, true);
                                changeInventory({ key: "VIN", value });
                                await validateField("VIN");
                            }}
                            onAction={handleVINchange}
                            disabled={inventory.GroupClassName === "equipment"}
                            className={`w-full ${errors.VIN ? "p-invalid" : ""}`}
                        />
                        <small className='p-error'>{errors.VIN}</small>
                    </div>
                </>
            )}

            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <InputText
                        className={
                            "vehicle-general__text-input w-full" +
                            (errors.StockNo ? " p-invalid" : "")
                        }
                        name='StockNo'
                        value={values.StockNo}
                        onChange={async ({ target: { value } }) => {
                            await setFieldValue("StockNo", value);
                            await setFieldTouched("StockNo", true, true);
                            changeInventory({ key: "StockNo", value });
                            await validateField("StockNo");
                        }}
                        onInput={(event: React.FormEvent<HTMLInputElement>) => {
                            const value = (event.target as HTMLInputElement).value;
                            if (!value) {
                                return changeInventory({ key: "StockNo", value: "" });
                            }
                            setFieldValue("StockNo", value);
                            changeInventory({ key: "StockNo", value });
                        }}
                    />
                    <label className='float-label'>Stock#</label>
                </span>
                <small className='p-error'>{errors.StockNo}</small>
            </div>
            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <AutoComplete
                        {...getFieldProps("Make")}
                        value={values.Make}
                        suggestions={automakesList}
                        completeMethod={({ query }) => {
                            setAutomakesList(
                                initialAutoMakesList.filter((item) =>
                                    item.name.includes(query.toUpperCase())
                                )
                            );
                        }}
                        dropdown
                        onChange={({ value }) => {
                            const make = typeof value === "string" ? value : value.name;
                            setFieldValue("Make", make);
                            changeInventory({ key: "Make", value: make });
                        }}
                        itemTemplate={autoMakesOptionTemplate}
                        selectedItemTemplate={selectedAutoMakesTemplate}
                        placeholder='Make (required)'
                        className={`vehicle-general__dropdown w-full ${
                            errors.Make ? "p-invalid" : ""
                        }`}
                    />
                    <label className='float-label'>Make (required)</label>
                </span>

                <small className='p-error'>{errors.Make}</small>
            </div>

            <div className='col-6 relative'>
                <ComboBox
                    {...getFieldProps("Model")}
                    optionLabel='name'
                    optionValue='name'
                    value={values.Model}
                    editable
                    options={automakesModelList}
                    onChange={({ value }) => {
                        setFieldValue("Model", value);
                        changeInventory({ key: "Model", value });
                    }}
                    placeholder='Model (required)'
                    className={`vehicle-general__dropdown w-full ${
                        errors.Model ? "p-invalid" : ""
                    }`}
                    label='Model (required)'
                />
                <small className='p-error'>{errors.Model}</small>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='vehicle-general__text-input w-full'
                        value={inventory?.Trim || ""}
                        maxLength={16}
                        onChange={({ target: { value } }) =>
                            changeInventory({ key: "Trim", value })
                        }
                    />
                    <label className='float-label'>Trim</label>
                </span>
            </div>
            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <InputNumber
                        {...getFieldProps("Year")}
                        className={`vehicle-general__text-input w-full ${
                            errors.Year ? "p-invalid" : ""
                        }`}
                        useGrouping={false}
                        value={parseInt(values.Year) || null}
                        onChange={({ value }) => {
                            if (!value) {
                                return changeInventory({ key: "Year", value: "" });
                            }
                            setFieldValue("Year", value);
                            changeInventory({ key: "Year", value: String(value) });
                        }}
                        onInput={(event: React.FormEvent<HTMLInputElement>) => {
                            const value = (event.target as HTMLInputElement).value;
                            if (!value) {
                                return changeInventory({ key: "Year", value: "" });
                            }
                            setFieldValue("Year", value);
                            changeInventory({ key: "Year", value: String(value) });
                        }}
                    />
                    <label className='float-label'>Year (required)</label>
                </span>
                <small className='p-error'>{errors.Year}</small>
            </div>

            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <InputNumber
                        {...getFieldProps("mileage")}
                        className={`vehicle-general__text-input w-full ${
                            errors.mileage ? "p-invalid" : ""
                        }`}
                        required
                        value={parseMileage(inventory?.mileage || "0")}
                        useGrouping={false}
                        min={0}
                        onChange={({ value }) => {
                            changeInventory({
                                key: "mileage",
                                value: value ? String(value) : "0",
                            });
                        }}
                    />
                    <label className='float-label'>Mileage</label>
                </span>
                <small className='p-error'>{errors.mileage}</small>
            </div>
            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='name'
                    value={inventory?.ExteriorColor}
                    required
                    onChange={({ value }) => changeInventory({ key: "ExteriorColor", value })}
                    options={colorList}
                    className='w-full vehicle-general__dropdown'
                    label='Color'
                />
            </div>

            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='name'
                    value={inventory?.InteriorColor}
                    required
                    onChange={({ value }) => changeInventory({ key: "InteriorColor", value })}
                    options={interiorList}
                    className='w-full vehicle-general__dropdown'
                    label='Interior color'
                />
            </div>

            <div className='flex col-12'>
                <h3 className='vehicle-general__title m-0 pr-3'>Vehicle status</h3>
                <hr className='vehicle-general__line flex-1' />
            </div>

            <div className='col-3'>
                <ComboBox
                    options={auditOptions}
                    value={selectedAuditKey}
                    onChange={(e) => handleAuditChange(e.value as keyof Audit)}
                    className='w-full vehicle-general__dropdown'
                    label='Status'
                />
            </div>
        </div>
    );
});
