import { observer } from "mobx-react-lite";
import { ReactElement, useCallback, useEffect, useState } from "react";
import "./index.css";
import { InputText } from "primereact/inputtext";
import {
    getAutoMakeModelList,
    getInventoryAutomakesList,
    getInventoryBodyTypesList,
    getInventoryExteriorColorsList,
} from "http/services/inventory-service";
import { DropdownProps } from "primereact/dropdown";
import defaultMakesLogo from "assets/images/default-makes-logo.svg";
import { useFormikContext } from "formik";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import { useStore } from "store/hooks";
import { PartialDeal } from "dashboard/deals/form";
import { VINDecoder } from "dashboard/common/form/vin-decoder";
import { VehicleDecodeInfo } from "http/services/vin-decoder.service";
import { MakesListData } from "common/models/inventory";
import { ListData } from "common/models";
import { ComboBox } from "dashboard/common/form/dropdown";

export const DealRetailTradeFirst = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        dealExtData: {
            Trade1_Color,
            Trade1_Mileage,
            Trade1_Year,
            Trade1_BodyStyle,
            Trade1_Title_Num,
            Trade1_StockNum,
            Trade1_OdomInExcess,
            Trade1_OdomNotActual,
            Trade1_Allowance,
            Trade1_Lien_Payoff,
            Trade1_Lien_Payoff_Good_Through,
            Trade1_Lien_Name,
            Trade1_Lien_Contact,
        },
        deal: { addToInventory },
        changeDeal,
        changeDealExtData,
    } = store;
    const { values, errors, setFieldValue } = useFormikContext<PartialDeal>();

    const [automakesList, setAutomakesList] = useState<MakesListData[]>([]);
    const [automakesModelList, setAutomakesModelList] = useState<ListData[]>([]);
    const [colorList, setColorList] = useState<ListData[]>([]);
    const [bodyTypeList, setBodyTypeList] = useState<ListData[]>([]);
    const [allowOverwrite, setAllowOverwrite] = useState<boolean>(false);

    useEffect(() => {
        getInventoryAutomakesList().then((list) => {
            if (list) {
                const upperCasedList = list.map((item) => ({
                    ...item,
                    name: item.name.toUpperCase(),
                }));
                setAutomakesList(upperCasedList);
            }
        });
        getInventoryBodyTypesList().then((list) => {
            list && setBodyTypeList(list);
        });
        getInventoryExteriorColorsList().then((list) => {
            list && setColorList(list);
        });
    }, []);

    const handleSelectMake = useCallback(() => {
        const makeSting = values.Trade1_Make.toLowerCase().replaceAll(" ", "");
        if (automakesList.some((item) => item.name.toLocaleLowerCase() === makeSting)) {
            getAutoMakeModelList(makeSting).then((list) => {
                if (list && Object.keys(list).length) {
                    setAutomakesModelList(list);
                } else {
                    setAutomakesModelList([]);
                }
            });
        }
    }, [automakesList, values.Trade1_Make]);

    useEffect(() => {
        if (values.Trade1_Make) handleSelectMake();
    }, [handleSelectMake, values.Trade1_Make]);

    const selectedAutoMakesTemplate = (option: MakesListData, props: DropdownProps) => {
        if (option) {
            return (
                <div className='flex align-items-center'>
                    <img
                        alt={option.name}
                        src={option?.logo || defaultMakesLogo}
                        className='mr-2 vehicle__dropdown-icon'
                    />
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const autoMakesOptionTemplate = (option: MakesListData) => {
        return (
            <div className='flex align-items-center'>
                <img
                    alt={option.name}
                    src={option?.logo || defaultMakesLogo}
                    className='mr-2 vehicle__dropdown-icon'
                />
                <div>{option.name}</div>
            </div>
        );
    };

    const handleVINchange = (vinInfo: VehicleDecodeInfo) => {
        if (vinInfo) {
            if (allowOverwrite) {
                changeDealExtData({
                    key: "Trade1_Make",
                    value: vinInfo.Make || values.Trade1_Make,
                });
                changeDealExtData({
                    key: "Trade1_Model",
                    value: vinInfo.Model || values.Trade1_Model,
                });
                changeDealExtData({
                    key: "Trade1_Year",
                    value: vinInfo.Year || values.Trade1_Year,
                });
                changeDealExtData({
                    key: "Trade1_StockNum",
                    value: vinInfo.StockNo || Trade1_StockNum,
                });
                changeDealExtData({
                    key: "Trade1_BodyStyle",
                    value: vinInfo.BodyStyle || Trade1_BodyStyle,
                });
                changeDealExtData({
                    key: "Trade1_Color",
                    value: vinInfo.ExteriorColor || Trade1_Color,
                });
                changeDealExtData({
                    key: "Trade1_Mileage",
                    value: vinInfo.mileage || Trade1_Mileage,
                });
            } else {
                changeDealExtData({
                    key: "Trade1_Make",
                    value: values.Trade1_Make || vinInfo.Make,
                });
                changeDealExtData({
                    key: "Trade1_Model",
                    value: values.Trade1_Model || vinInfo.Model,
                });
                changeDealExtData({
                    key: "Trade1_Year",
                    value: values.Trade1_Year || vinInfo.Year,
                });
                changeDealExtData({
                    key: "Trade1_StockNum",
                    value: Trade1_StockNum || vinInfo.StockNo,
                });
                changeDealExtData({
                    key: "Trade1_BodyStyle",
                    value: Trade1_BodyStyle || vinInfo.BodyStyle,
                });
                changeDealExtData({
                    key: "Trade1_Color",
                    value: Trade1_Color || vinInfo.ExteriorColor,
                });
                changeDealExtData({
                    key: "Trade1_Mileage",
                    value: Trade1_Mileage || vinInfo.mileage,
                });
            }
        }
    };

    return (
        <div className='grid deal-retail-trade row-gap-2'>
            <div className='col-12'>
                <div className='trade-overwrite pb-3'>
                    <Checkbox
                        checked={allowOverwrite}
                        id='trade-overwrite'
                        className='trade-overwrite__checkbox'
                        onChange={() => setAllowOverwrite(!allowOverwrite)}
                    />
                    <label className='pl-3 trade-overwrite__label'>Overwrite data</label>
                    <i className='icon adms-help trade-overwrite__icon' />
                </div>
            </div>
            <div className='col-6 relative'>
                <VINDecoder
                    value={values.Trade1_VIN}
                    onChange={({ target: { value } }) => {
                        setFieldValue("Trade1_VIN", value);
                        changeDealExtData({ key: "Trade1_VIN", value });
                    }}
                    onAction={handleVINchange}
                    className={`${errors.Trade1_VIN ? "p-invalid" : ""}`}
                />
                <small className='p-error'>{errors.Trade1_VIN || ""}</small>
            </div>
            <div className='col-6 relative'>
                <ComboBox
                    optionLabel='name'
                    optionValue='name'
                    value={values.Trade1_Make}
                    required
                    options={automakesList}
                    onChange={({ value }) => {
                        setFieldValue("Trade1_Make", value);
                        changeDealExtData({ key: "Trade1_Make", value });
                    }}
                    valueTemplate={selectedAutoMakesTemplate}
                    itemTemplate={autoMakesOptionTemplate}
                    className={`deal-trade__dropdown w-full ${
                        errors.Trade1_Make ? "p-invalid" : ""
                    }`}
                    label='Make (required)'
                />

                <small className='p-error'>{errors.Trade1_Make || ""}</small>
            </div>

            <div className='col-6 relative'>
                <ComboBox
                    optionLabel='name'
                    optionValue='name'
                    value={values.Trade1_Model}
                    editable={!automakesModelList.length}
                    options={automakesModelList}
                    onChange={({ value }) => {
                        setFieldValue("Model", value);
                        changeDealExtData({ key: "Trade1_Model", value });
                    }}
                    className={`deal-trade__dropdown w-full ${
                        errors.Trade1_Model ? "p-invalid" : ""
                    }`}
                    label='Model (required)'
                />
                <small className='p-error'>{errors.Trade1_Model}</small>
            </div>
            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <InputNumber
                        className={`deal-trade__text-input w-full ${
                            errors.Trade1_Year ? "p-invalid" : ""
                        }`}
                        required
                        min={0}
                        useGrouping={false}
                        value={parseInt(Trade1_Year) || null}
                        onChange={({ value }) => {
                            if (!value) {
                                return changeDealExtData({ key: "Trade1_Year", value: "" });
                            }
                            setFieldValue("Trade1_Year", value);
                            changeDealExtData({ key: "Trade1_Year", value: String(value) });
                        }}
                    />
                    <label className='float-label'>Year (required)</label>
                </span>
                <small className='p-error'>{errors.Trade1_Year}</small>
            </div>

            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <InputNumber
                        className={`deal-trade__text-input w-full ${errors.Trade1_Mileage ? "p-invalid" : ""}`}
                        required
                        value={
                            values.Trade1_Mileage
                                ? parseFloat(values.Trade1_Mileage.replace(/[^0-9.]/g, ""))
                                : null
                        }
                        useGrouping
                        min={0}
                        onChange={({ value }) => {
                            const valAsString = value?.toString() || "";
                            setFieldValue("Trade1_Mileage", valAsString);
                            changeDealExtData({
                                key: "Trade1_Mileage",
                                value: valAsString,
                            });
                        }}
                    />
                    <label className='float-label'>Mileage (required)</label>
                </span>

                <small className='p-error'>{errors.Trade1_Mileage || ""}</small>
            </div>
            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='name'
                    value={Trade1_Color}
                    options={colorList}
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "Trade1_Color", value })
                    }
                    className='w-full deal-trade__dropdown'
                    label='Color'
                />
            </div>

            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='name'
                    value={Trade1_BodyStyle}
                    onChange={({ target: { value } }) => {
                        changeDealExtData({ key: "Trade1_BodyStyle", value });
                    }}
                    editable
                    options={bodyTypeList}
                    className='w-full deal-trade__dropdown'
                    label='Body Style'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={Trade1_Title_Num}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "Trade1_Title_Num", value });
                        }}
                        className='deal-trade__text-input w-full'
                    />
                    <label className='float-label'>Title#</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={Trade1_StockNum}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "Trade1_StockNum", value });
                        }}
                        className='deal-trade__text-input w-full'
                    />
                    <label className='float-label'>Stock#</label>
                </span>
            </div>

            <div className='col-3 deal-trade__checkbox flex align-items-center'>
                <Checkbox
                    inputId='Trade1_OdomInExcess'
                    name='Trade1_OdomInExcess'
                    checked={!!Trade1_OdomInExcess}
                    onChange={() =>
                        changeDealExtData({
                            key: "Trade1_OdomInExcess",
                            value: Number(!Trade1_OdomInExcess),
                        })
                    }
                />
                <label htmlFor='Trade1_OdomInExcess' className='ml-2'>
                    Disclosure IN EXCESS
                </label>
            </div>
            <div className='col-3 deal-trade__checkbox flex align-items-center'>
                <Checkbox
                    inputId='Trade1_OdomNotActual'
                    name='Trade1_OdomNotActual'
                    checked={!!Trade1_OdomNotActual}
                    onChange={() =>
                        changeDealExtData({
                            key: "Trade1_OdomNotActual",
                            value: Number(!Trade1_OdomNotActual),
                        })
                    }
                />
                <label htmlFor='Trade1_OdomNotActual' className='ml-2'>
                    Disclosure NOT ACTUAL
                </label>
            </div>
            <div className='col-3 deal-trade__checkbox flex align-items-center'>
                <Checkbox
                    inputId='Trade1_AddToInventory'
                    name='Trade1_AddToInventory'
                    checked={!!addToInventory}
                    onChange={() =>
                        changeDeal({
                            key: "addToInventory",
                            value: !addToInventory ? 1 : 0,
                        })
                    }
                />
                <label htmlFor='Trade1_AddToInventory' className='ml-2'>
                    Add to inventory
                </label>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput
                    value={Number(Trade1_Allowance) || 0}
                    onChange={({ value }) => {
                        changeDealExtData({ key: "Trade1_Allowance", value: value || 0 });
                    }}
                    labelPosition='top'
                    title='Allowance'
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    value={Number(Trade1_Lien_Payoff) || 0}
                    onChange={({ value }) => {
                        changeDealExtData({ key: "Trade1_Lien_Payoff", value: value || 0 });
                    }}
                    labelPosition='top'
                    title='Payoff Amount'
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    value={Number(Trade1_Lien_Payoff) || 0}
                    onChange={({ value }) => {
                        changeDealExtData({ key: "Trade1_Lien_Payoff", value: value || 0 });
                    }}
                    labelPosition='top'
                    title='Payoff Amount'
                />
            </div>
            <div className='col-3'>
                <DateInput
                    date={Trade1_Lien_Payoff_Good_Through}
                    checkbox
                    onChange={({ value }) =>
                        value &&
                        changeDealExtData({
                            key: "Trade1_Lien_Payoff_Good_Through",
                            value: Number(value),
                        })
                    }
                    name='PO Good Thru'
                />
            </div>

            <hr className='form-line' />

            <div className='col-6'>
                <CompanySearch
                    name='Lienholder Name'
                    value={Trade1_Lien_Name}
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "Trade1_Lien_Name", value })
                    }
                    onRowClick={(value) =>
                        changeDealExtData({
                            key: "Trade1_Lien_Name",
                            value,
                        })
                    }
                />
            </div>
            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <InputText
                        className={`'deal-trade__text-input w-full' ${
                            errors.Trade1_Lien_Address ? "p-invalid" : ""
                        }`}
                        value={values.Trade1_Lien_Address}
                        onChange={({ target: { value } }) => {
                            setFieldValue("Trade1_Lien_Address", value);
                            changeDealExtData({ key: "Trade1_Lien_Address", value });
                        }}
                    />
                    <label className='float-label'>Mailing address</label>
                </span>
                <small className='p-error'>{errors.Trade1_Lien_Address}</small>
            </div>

            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <InputText
                        className={`'deal-trade__text-input w-full' ${
                            errors.Trade1_Lien_Phone ? "p-invalid" : ""
                        }`}
                        value={values.Trade1_Lien_Phone}
                        onChange={({ target: { value } }) => {
                            setFieldValue("Trade1_Lien_Phone", value);
                            changeDealExtData({ key: "Trade1_Lien_Phone", value });
                        }}
                    />
                    <label className='float-label'>Phone Number</label>
                </span>
                <small className='p-error'>{errors.Trade1_Lien_Phone}</small>
            </div>
            <div className='col-6'>
                <CompanySearch
                    value={Trade1_Lien_Contact}
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "Trade1_Lien_Contact", value })
                    }
                    onRowClick={(value) =>
                        changeDealExtData({
                            key: "Trade1_Lien_Contact",
                            value,
                        })
                    }
                    name='Contact'
                />
            </div>
        </div>
    );
});
