import { STATES_LIST } from "common/constants/states";
import { TITLE_STATUS_LIST } from "common/constants/title-status";
import { ComboBox } from "dashboard/common/form/dropdown";
import { DateInput } from "dashboard/common/form/inputs";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { observer } from "mobx-react-lite";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { ReactElement } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "store/hooks";

export const PurchaseTitle = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const {
        inventoryExtData: {
            titleHolderAddress,
            titleHolderName,
            titleHolderPhone,
            titleHolderZIP,
            titleHolderPayoff,
            titleHolderState,
            titleIsTradeIn,
            titleNumber,
            titleState,
            titleStatus,
            titlePrevAddress,
            titlePrevName,
            titlePrevPhone,
            titlePrevZIP,
            titlePrevState,
            titleReceived,
            titleReceivedDate,
        },
        changeInventoryExtData,
    } = store;
    const location = useLocation();
    const currentPath = location.pathname + location.search;

    return (
        <div className='grid purchase-title row-gap-2'>
            <div className='col-3 flex align-items-center'>
                <div className='purchase-title__checkbox flex'>
                    <Checkbox
                        inputId='title-trade-in'
                        name='title-trade-in'
                        className='mt-1'
                        checked={!!titleIsTradeIn}
                        onChange={() =>
                            changeInventoryExtData({
                                key: "titleIsTradeIn",
                                value: !!titleIsTradeIn ? 0 : 1,
                            })
                        }
                    />
                    <label htmlFor='title-trade-in' className='ml-2'>
                        Vehicle was a Trade-In
                    </label>
                </div>
            </div>
            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='id'
                    className='w-full purchase-title__dropdown'
                    value={titleStatus}
                    options={[...TITLE_STATUS_LIST]}
                    onChange={({ value }) => changeInventoryExtData({ key: "titleStatus", value })}
                    label='Status'
                />
            </div>
            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='id'
                    className='w-full purchase-title__dropdown'
                    value={titleState}
                    options={STATES_LIST}
                    onChange={({ value }) => changeInventoryExtData({ key: "titleState", value })}
                    label='State'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-title__text-input w-full'
                        value={titleNumber}
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "titleNumber", value })
                        }
                    />
                    <label className='float-label'>Number</label>
                </span>
            </div>

            <div className='col-3 flex align-items-center'>
                <div className='purchase-title__checkbox flex'>
                    <Checkbox
                        inputId='title-received'
                        name='title-received'
                        className='mt-1'
                        checked={!!titleReceived}
                        onChange={() =>
                            changeInventoryExtData({
                                key: "titleReceived",
                                value: !!titleReceived ? 0 : 1,
                            })
                        }
                    />
                    <label htmlFor='title-received' className='ml-2'>
                        Received
                    </label>
                </div>
            </div>

            <div className='col-3'>
                <DateInput
                    name='Date'
                    date={titleReceivedDate}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "titleReceivedDate",
                            value: Number(value),
                        });
                    }}
                />
            </div>

            <hr className='form-line' />

            <div className='col-6'>
                <CompanySearch
                    name='Holder Name'
                    value={titleHolderName}
                    onChange={({ target: { value } }) => {
                        changeInventoryExtData({
                            key: "titleHolderName",
                            value,
                        });
                    }}
                    onRowClick={(companyName) =>
                        changeInventoryExtData({
                            key: "titleHolderName",
                            value: companyName,
                        })
                    }
                    originalPath={currentPath}
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-title__text-input w-full'
                        value={titleHolderPhone}
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "titleHolderPhone", value })
                        }
                    />
                    <label className='float-label'>Holder Phone Number</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-title__text-input w-full'
                        value={titleHolderPayoff}
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "titleHolderPayoff", value })
                        }
                    />
                    <label className='float-label'>Holder Payoff</label>
                </span>
            </div>

            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-title__text-input w-full'
                        value={titleHolderAddress}
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "titleHolderAddress", value })
                        }
                    />
                    <label className='float-label'>Holder Address</label>
                </span>
            </div>
            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='id'
                    className='w-full purchase-title__dropdown'
                    value={titleHolderState}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "titleHolderState",
                            value,
                        });
                    }}
                    options={STATES_LIST}
                    label='Holder State'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-title__text-input w-full'
                        value={titleHolderZIP}
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "titleHolderZIP", value })
                        }
                    />
                    <label className='float-label'>Zip Code</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-6'>
                <CompanySearch
                    name='Previous Name'
                    value={titlePrevName}
                    onChange={({ target: { value } }) => {
                        changeInventoryExtData({
                            key: "titlePrevName",
                            value,
                        });
                    }}
                    onRowClick={(companyName) =>
                        changeInventoryExtData({
                            key: "titlePrevName",
                            value: companyName,
                        })
                    }
                    originalPath={currentPath}
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-title__text-input w-full'
                        value={titlePrevPhone}
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "titlePrevPhone", value })
                        }
                    />
                    <label className='float-label'>Previous Phone Number</label>
                </span>
            </div>
            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-title__text-input w-full'
                        value={titlePrevAddress}
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "titlePrevAddress", value })
                        }
                    />
                    <label className='float-label'>Previous Address</label>
                </span>
            </div>
            <div className='col-3'>
                <ComboBox
                    placeholder='State'
                    optionLabel='name'
                    optionValue='id'
                    className='w-full purchase-title__dropdown'
                    options={STATES_LIST}
                    value={titlePrevState}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "titlePrevState",
                            value,
                        });
                    }}
                    label='Previous State'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        className='purchase-title__text-input w-full'
                        value={titlePrevZIP}
                        onChange={({ target: { value } }) =>
                            changeInventoryExtData({ key: "titlePrevZIP", value })
                        }
                    />
                    <label className='float-label'>Zip Code</label>
                </span>
            </div>
        </div>
    );
});
