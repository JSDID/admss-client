import { observer } from "mobx-react-lite";
import { ReactElement, useEffect, useState } from "react";
import "./index.css";
import { DateInput } from "dashboard/common/form/inputs";
import { InputText } from "primereact/inputtext";
import { useStore } from "store/hooks";
import {
    getDealInventoryStatuses,
    getDealStatuses,
    getDealTypes,
    getHowToKnowList,
    getSaleTypes,
} from "http/services/deals.service";
import { HowToKnow, IndexedDealList } from "common/models/deals";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { InventorySearch } from "dashboard/inventory/common/inventory-search";
import { BaseResponseError } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { useFormikContext } from "formik";
import { PartialDeal } from "dashboard/deals/form";
import { ContactUser } from "common/models/contact";
import { Inventory } from "common/models/inventory";
import { useLocation, useParams } from "react-router-dom";
import { ComboBox } from "dashboard/common/form/dropdown";

export const DealGeneralSale = observer((): ReactElement => {
    const { values, errors, setFieldValue, getFieldProps } = useFormikContext<PartialDeal>();
    const { id } = useParams();
    const store = useStore().dealStore;
    const userStore = useStore().userStore;
    const toast = useToast();
    const location = useLocation();
    const currentPath = location.pathname + location.search;

    const { authUser } = userStore;
    const { deal, changeDeal, changeDealExtData } = store;

    const [dealTypesList, setDealTypesList] = useState<IndexedDealList[]>([]);
    const [saleTypesList, setSaleTypesList] = useState<IndexedDealList[]>([]);
    const [dealStatusesList, setDealStatusesList] = useState<IndexedDealList[]>([]);
    const [howToKnowList, setHowToKnowList] = useState<Partial<HowToKnow[]>>([]);
    const [inventoryStatusesList, setInventoryStatusesList] = useState<IndexedDealList[]>([]);

    useEffect(() => {
        getDealTypes().then((res) => {
            const { error } = res as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                });
            } else {
                setDealTypesList(res as IndexedDealList[]);
            }
        });
        getSaleTypes().then((res) => {
            const { error } = res as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                });
            } else {
                setSaleTypesList(res as IndexedDealList[]);
            }
        });
        getDealStatuses().then((res) => {
            const { error } = res as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                });
            } else {
                setDealStatusesList(res as IndexedDealList[]);
            }
        });
        getDealInventoryStatuses().then((res) => {
            const { error } = res as BaseResponseError;
            if (error && toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: error,
                });
            } else {
                setInventoryStatusesList(res as IndexedDealList[]);
            }
        });
    }, [toast]);

    useEffect(() => {
        if (authUser?.useruid) {
            getHowToKnowList(authUser?.useruid).then((res) => {
                if (Array.isArray(res) && res.length) setHowToKnowList(res);
            });
        }
    }, [authUser, toast]);

    const handleGetCompanyInfo = (contact: ContactUser) => {
        setFieldValue(
            "contactinfo",
            contact.companyName ||
                `${contact.firstName} ${contact.lastName}`.trim() ||
                contact.userName
        );
        changeDeal({
            key: "contactinfo",
            value:
                contact.companyName ||
                `${contact.firstName} ${contact.lastName}`.trim() ||
                contact.userName,
        });
        changeDeal({
            key: "contactuid",
            value: contact.contactuid,
        });
    };

    const handleGetInventoryInfo = (inventory: Inventory) => {
        setFieldValue("inventoryinfo", inventory.name || inventory.Make);
        changeDeal({
            key: "inventoryinfo",
            value: inventory.name || inventory.Make,
        });
        changeDeal({
            key: "inventoryuid",
            value: inventory.itemuid,
        });
    };

    return (
        <section className='grid deal-general-sale row-gap-2'>
            <div className='col-6 relative'>
                <CompanySearch
                    {...getFieldProps("contactinfo")}
                    onChange={({ target: { value } }) => {
                        setFieldValue("contactinfo", value);
                        changeDeal({ key: "contactinfo", value });
                    }}
                    originalPath={currentPath}
                    value={values?.contactinfo}
                    getFullInfo={handleGetCompanyInfo}
                    name='Buyer Name (required)'
                    className={`${errors.contactinfo && "p-invalid"}`}
                />
                <small className='p-error'>{errors.contactinfo}</small>
            </div>
            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <InventorySearch
                        {...getFieldProps("inventoryinfo")}
                        className={`${errors.inventoryinfo && "p-invalid"}`}
                        onChange={({ target: { value } }) => {
                            setFieldValue("inventoryinfo", value);
                            changeDeal({ key: "inventoryinfo", value });
                        }}
                        value={values?.inventoryinfo}
                        getFullInfo={handleGetInventoryInfo}
                        name='Vehicle (required)'
                    />
                    <label className='float-label'></label>
                </span>
                <small className='p-error'>{errors.inventoryinfo}</small>
            </div>
            <div className='col-6 relative'>
                <ComboBox
                    {...getFieldProps("dealtype")}
                    optionLabel='name'
                    optionValue='id'
                    required
                    options={dealTypesList}
                    label='Type of Deal (required)'
                    value={values.dealtype}
                    onChange={(e) => {
                        setFieldValue("dealtype", e.value);
                        store.dealType = e.value;
                        changeDeal({ key: "dealtype", value: e.value });
                    }}
                    className={`w-full deal-sale__dropdown ${errors.dealtype && "p-invalid"}`}
                />

                <small className='p-error'>{errors.dealtype}</small>
            </div>
            <div className='col-3 relative'>
                <ComboBox
                    {...getFieldProps("dealstatus")}
                    optionLabel='name'
                    optionValue='id'
                    value={values.dealstatus}
                    onChange={(e) => {
                        setFieldValue("dealstatus", e.value);
                        changeDeal({ key: "dealstatus", value: e.value });
                    }}
                    options={dealStatusesList}
                    required
                    className={`w-full deal-sale__dropdown ${errors.dealstatus && "p-invalid"}`}
                    label='Sale status (required)'
                />
                <small className='p-error'>{errors.dealstatus}</small>
            </div>
            <div className='col-3 relative'>
                <ComboBox
                    {...getFieldProps("saletype")}
                    optionLabel='name'
                    optionValue='id'
                    required
                    options={saleTypesList}
                    value={values.saletype}
                    onChange={(e) => {
                        setFieldValue("saletype", e.value);
                        changeDeal({ key: "saletype", value: e.value });
                    }}
                    label='Sale type (required)'
                    className={`w-full deal-sale__dropdown ${errors.saletype && "p-invalid"}`}
                />
                <small className='p-error'>{errors.saletype}</small>
            </div>
            <div className='col-3 relative'>
                <DateInput
                    {...getFieldProps("datepurchase")}
                    className={`${errors.datepurchase && "p-invalid"}`}
                    name='Sale date (required)'
                    date={new Date(values.datepurchase)}
                    onChange={({ value }) => {
                        setFieldValue("datepurchase", Number(value));
                        changeDeal({ key: "datepurchase", value: Number(value) });
                    }}
                />
                <small className='p-error'>{errors.datepurchase}</small>
            </div>
            <div className='col-3 relative'>
                <DateInput
                    {...getFieldProps("dateeffective")}
                    className={`${errors.dateeffective && "p-invalid"}`}
                    name='First operated (required)'
                    date={new Date(values.dateeffective)}
                    onChange={({ value }) => {
                        setFieldValue("dateeffective", Number(value));
                        changeDeal({ key: "dateeffective", value: Number(value) });
                    }}
                />
                <small className='p-error'>{errors.dateeffective}</small>
            </div>
            <div className='col-3 relative'>
                <ComboBox
                    {...getFieldProps("inventorystatus")}
                    optionLabel='name'
                    optionValue='id'
                    value={
                        values.inventorystatus !== undefined ? Number(values.inventorystatus) : null
                    }
                    options={inventoryStatusesList}
                    onChange={(e) => {
                        setFieldValue("inventorystatus", e.value);
                        changeDeal({ key: "inventorystatus", value: e.value });
                    }}
                    required
                    className={`w-full deal-sale__dropdown ${errors.inventorystatus && "p-invalid"}`}
                    label='New or Used (req.)'
                />
                <small className='p-error'>{errors.inventorystatus}</small>
            </div>

            <div className='col-12 text-line'>
                <h3 className='text-line__title m-0 pr-3'>Vehicle payments tracking</h3>
                <hr className='text-line__line flex-1' />
            </div>

            <div className='col-3'>
                <DateInput
                    name='Warn Overdue After X Days'
                    date={deal.warnOverdueDays}
                    emptyDate
                    onChange={({ value }) =>
                        changeDeal({ key: "warnOverdueDays", value: Number(value) })
                    }
                />
            </div>
            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <InputText
                        {...getFieldProps("accountInfo")}
                        className='w-full deal-sale__text-input'
                        disabled={!!id}
                        value={deal.accountInfo || ""}
                        onChange={({ target: { value } }) => {
                            if (id) return;
                            setFieldValue("accountInfo", value);
                            changeDeal({ key: "accountInfo", value });
                        }}
                    />
                    <label className='float-label'>Account number</label>
                </span>
            </div>

            <hr className='col-12 form-line' />

            <div className='col-6 relative'>
                <ComboBox
                    {...getFieldProps("HowFoundOut")}
                    required
                    optionLabel='description'
                    optionValue='itemuid'
                    options={howToKnowList}
                    value={values.HowFoundOut}
                    onChange={(e) => {
                        setFieldValue("HowFoundOut", e.value);
                        changeDealExtData({ key: "HowFoundOut", value: e.value });
                    }}
                    editable
                    className={`w-full deal-sale__dropdown ${errors.HowFoundOut && "p-invalid"}`}
                    label='How did you hear about us? (required)'
                />
                <small className='p-error'>{errors.HowFoundOut}</small>
            </div>
            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <InputText
                        {...getFieldProps("SaleID")}
                        className={`deal-sale__text-input w-full ${errors.SaleID && "p-invalid"}`}
                        value={values.SaleID}
                        onChange={(e) => {
                            setFieldValue("SaleID", e.target.value);
                            changeDealExtData({ key: "SaleID", value: e.target.value });
                        }}
                    />
                    <label className='float-label'>ROS SaleID (required)</label>
                </span>
                <small className='p-error'>{errors.SaleID}</small>
            </div>
        </section>
    );
});
