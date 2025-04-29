import {
    BorderedCheckbox,
    CurrencyInput,
    DateInput,
    PercentInput,
} from "dashboard/common/form/inputs";
import { InputText } from "primereact/inputtext";
import { ReactElement } from "react";
import "./index.css";
import { InputTextarea } from "primereact/inputtextarea";
import { observer } from "mobx-react-lite";
import { useStore } from "store/hooks";
import { InputNumber } from "primereact/inputnumber";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { useLocation } from "react-router-dom";

export const PurchasePurchases = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const location = useLocation();
    const currentPath = location.pathname + location.search;
    const {
        inventoryExtData: {
            purLotNo,
            purPurchaseAddress,
            purPurchaseAmount,
            purPurchaseAuctCo,
            purPurchaseBuyerComm,
            purPurchasedFrom,
            purPurchaseBuyerName,
            purPurchaseBuyerPercent,
            purPurchaseCheck,
            purPurchaseCheckDate,
            purPurchaseCity,
            purPurchaseDate,
            purPurchasePhone,
            purPurchaseEmail,
            purPurchaseZipCode,
            purSoldByLot,
            purPurchaseCheckMemo,
        },
        changeInventoryExtData,
    } = store;

    return (
        <div className='grid purchase-purchases row-gap-2'>
            <div className='col-6'>
                <CompanySearch
                    name='Purchased From'
                    value={purPurchasedFrom}
                    onChange={({ target: { value } }) => {
                        changeInventoryExtData({
                            key: "purPurchasedFrom",
                            value,
                        });
                    }}
                    onRowClick={(companyName) => {
                        changeInventoryExtData({
                            key: "purPurchasedFrom",
                            value: companyName,
                        });
                    }}
                    className='purchase-purchases__text-input'
                    originalPath={currentPath}
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-purchases__text-input w-full'
                        value={purPurchaseEmail}
                        onChange={({ target: { value } }) => {
                            changeInventoryExtData({
                                key: "purPurchaseEmail",
                                value,
                            });
                        }}
                    />
                    <label className='float-label'>E-mail</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-purchases__text-input w-full'
                        value={purPurchasePhone}
                        onChange={({ target: { value } }) => {
                            changeInventoryExtData({
                                key: "purPurchasePhone",
                                value,
                            });
                        }}
                    />
                    <label className='float-label'>Phone number</label>
                </span>
            </div>

            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-purchases__text-input w-full'
                        value={purPurchaseAddress}
                        onChange={({ target: { value } }) => {
                            changeInventoryExtData({
                                key: "purPurchaseAddress",
                                value,
                            });
                        }}
                    />
                    <label className='float-label'>Street address</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-purchases__text-input w-full'
                        value={purPurchaseCity}
                        onChange={({ target: { value } }) => {
                            changeInventoryExtData({
                                key: "purPurchaseCity",
                                value,
                            });
                        }}
                    />
                    <label className='float-label'>City</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-purchases__text-input w-full'
                        value={purPurchaseZipCode}
                        onChange={({ target: { value } }) => {
                            changeInventoryExtData({
                                key: "purPurchaseZipCode",
                                value,
                            });
                        }}
                    />
                    <label className='float-label'>Zip Code</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-6'>
                <CompanySearch
                    name='Auction Company'
                    value={purPurchaseAuctCo}
                    onChange={({ target: { value } }) => {
                        changeInventoryExtData({
                            key: "purPurchaseAuctCo",
                            value,
                        });
                    }}
                    onRowClick={(companyName) =>
                        changeInventoryExtData({
                            key: "purPurchaseAuctCo",
                            value: companyName,
                        })
                    }
                    originalPath={currentPath}
                />
            </div>
            <div className='col-6'>
                <CompanySearch
                    name='Buyer Name'
                    value={purPurchaseBuyerName}
                    onChange={({ target: { value } }) => {
                        changeInventoryExtData({
                            key: "purPurchaseBuyerName",
                            value,
                        });
                    }}
                    onRowClick={(companyName) =>
                        changeInventoryExtData({
                            key: "purPurchaseBuyerName",
                            value: companyName,
                        })
                    }
                    originalPath={currentPath}
                />
            </div>
            <div className='col-3'>
                <PercentInput
                    labelPosition='top'
                    title='Buyer Percent'
                    value={purPurchaseBuyerPercent}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "purPurchaseBuyerPercent",
                            value: Number(value),
                        });
                    }}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Buyer Commission'
                    value={purPurchaseBuyerComm}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "purPurchaseBuyerComm",
                            value: Number(value),
                        });
                    }}
                />
            </div>
            <div className='col-3 relative'>
                <DateInput
                    name='Date'
                    date={purPurchaseDate}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "purPurchaseDate",
                            value: Number(value),
                        });
                    }}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Amount'
                    value={purPurchaseAmount}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "purPurchaseAmount",
                            value: Number(value),
                        });
                    }}
                />
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-purchases__text-input w-full'
                        value={purPurchaseCheck}
                        onChange={({ target: { value } }) => {
                            changeInventoryExtData({
                                key: "purPurchaseCheck",
                                value,
                            });
                        }}
                    />
                    <label className='float-label'>Check Number</label>
                </span>
            </div>
            <div className='col-3'>
                <DateInput
                    name='Check Date'
                    date={purPurchaseCheckDate}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "purPurchaseCheckDate",
                            value: Number(value),
                        });
                    }}
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputNumber
                        className='purchase-purchases__number-input w-full'
                        value={purLotNo}
                        onChange={({ value }) => {
                            changeInventoryExtData({
                                key: "purLotNo",
                                value: Number(value),
                            });
                        }}
                    />
                    <label className='float-label'>Lot #</label>
                </span>
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Sold By Lot'
                    checked={!!purSoldByLot}
                    onChange={() =>
                        changeInventoryExtData({
                            key: "purSoldByLot",
                            value: !!purSoldByLot ? 0 : 1,
                        })
                    }
                />
            </div>
            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        className='purchase-purchases__text-area'
                        value={purPurchaseCheckMemo}
                        onChange={({ target: { value } }) => {
                            changeInventoryExtData({
                                key: "purPurchaseCheckMemo",
                                value,
                            });
                        }}
                    />
                    <label className='float-label'>Notes</label>
                </span>
            </div>
        </div>
    );
});
