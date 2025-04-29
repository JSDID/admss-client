import { CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ReactElement } from "react";
import "./index.css";
import { useStore } from "store/hooks";
import { observer } from "mobx-react-lite";
import { InputNumber } from "primereact/inputnumber";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { useLocation } from "react-router-dom";

export const PurchaseConsign = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const location = useLocation();
    const currentPath = location.pathname + location.search;
    const {
        inventoryExtData: {
            csDate,
            csEarlyRemoval,
            csFee,
            csIsConsigned,
            csListingFee,
            csName,
            csNetToOwner,
            csNotes,
            csNumDays,
            csOwnerAskingPrice,
            csReserveAmt,
            csReserveFactor,
            csReturnDate,
            csReturned,
        },
        changeInventoryExtData,
    } = store;

    return (
        <div className='grid purchase-consign row-gap-2'>
            <div className='col-3 flex align-items-center'>
                <div className='purchase-consign__checkbox'>
                    <Checkbox
                        inputId='consign-vehicle'
                        name='consign-vehicle'
                        className='mt-1'
                        checked={!!csIsConsigned}
                        onChange={() =>
                            changeInventoryExtData({
                                key: "csIsConsigned",
                                value: !!csIsConsigned ? 0 : 1,
                            })
                        }
                    />
                    <label htmlFor='consign-vehicle' className='ml-2'>
                        Vehicle is Consigned
                    </label>
                </div>
            </div>
            <div className='col-6'>
                <CompanySearch
                    name='Consignor'
                    value={csName}
                    onChange={({ target: { value } }) => {
                        changeInventoryExtData({
                            key: "csName",
                            value,
                        });
                    }}
                    onRowClick={(companyName) =>
                        changeInventoryExtData({
                            key: "csName",
                            value: companyName,
                        })
                    }
                    originalPath={currentPath}
                />
            </div>
            <div className='col-3'>
                <DateInput
                    date={csDate}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "csDate",
                            value: Number(value),
                        });
                    }}
                    name='Consign Date'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-consign__text-input w-full'
                        value={csNetToOwner}
                        onChange={({ target: { value } }) => {
                            changeInventoryExtData({
                                key: "csNetToOwner",
                                value,
                            });
                        }}
                    />
                    <label className='float-label'>Net To Owner</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputNumber
                        className='purchase-consign__number-input'
                        value={csNumDays}
                        onChange={({ value }) => {
                            value &&
                                changeInventoryExtData({
                                    key: "csNumDays",
                                    value,
                                });
                        }}
                    />
                    <label className='float-label'># Days</label>
                </span>
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Consignment Fee'
                    value={csFee}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "csFee",
                                value,
                            });
                    }}
                />
            </div>

            <hr className='form-line' />

            <div className='col-3 flex align-items-center'>
                <div className='purchase-consign__checkbox'>
                    <Checkbox
                        inputId='consign-returned'
                        name='consign-returned'
                        className='mt-1'
                        checked={!!csReturned}
                        onChange={() =>
                            changeInventoryExtData({
                                key: "csReturned",
                                value: !!csReturned ? 0 : 1,
                            })
                        }
                    />
                    <label htmlFor='consign-returned' className='ml-2'>
                        Returned to Seller Unsold
                    </label>
                </div>
            </div>
            <div className='col-3'>
                <DateInput
                    name='Return Date'
                    date={csReturnDate}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "csReturnDate",
                            value: Number(value),
                        });
                    }}
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputNumber
                        className='purchase-consign__number-input w-full'
                        value={csReserveFactor}
                        onChange={({ value }) => {
                            value &&
                                changeInventoryExtData({
                                    key: "csReserveFactor",
                                    value,
                                });
                        }}
                    />
                    <label className='float-label'>Reserve Factor</label>
                </span>
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Reserve Amount'
                    value={csReserveAmt}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "csReserveAmt",
                                value,
                            });
                    }}
                />
            </div>
            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        className='purchase-consign__text-area'
                        value={csNotes}
                        onChange={({ target: { value } }) => {
                            changeInventoryExtData({
                                key: "csNotes",
                                value,
                            });
                        }}
                    />
                    <label className='float-label'>Consignment Notes</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Early Removal Fee'
                    value={csEarlyRemoval}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "csEarlyRemoval",
                                value,
                            });
                    }}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Listing Fee'
                    value={csListingFee}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "csListingFee",
                                value,
                            });
                    }}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    title='Owner’s Asking Price'
                    value={csOwnerAskingPrice}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "csOwnerAskingPrice",
                                value,
                            });
                    }}
                />
            </div>
        </div>
    );
});
