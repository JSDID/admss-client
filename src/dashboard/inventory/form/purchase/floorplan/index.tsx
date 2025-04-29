import { BorderedCheckbox, CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "store/hooks";

export const PurchaseFloorplan = observer((): ReactElement => {
    const store = useStore().inventoryStore;
    const location = useLocation();
    const currentPath = location.pathname + location.search;
    const {
        inventoryExtData: {
            fpFloorplanCompany,
            fpIsFloorplanned,
            fpPayoffBy,
            fpReductionDate,
            fpReduxAmt,
            fpRemainBal,
        },
        changeInventoryExtData,
    } = store;

    return (
        <div className='grid purchase-floorplan row-gap-2'>
            <div className='col-3'>
                <BorderedCheckbox
                    name='Floorplanned'
                    checked={!!fpIsFloorplanned}
                    onChange={() =>
                        changeInventoryExtData({
                            key: "fpIsFloorplanned",
                            value: !!fpIsFloorplanned ? 0 : 1,
                        })
                    }
                />
            </div>
            <div className='col-6'>
                <CompanySearch
                    name='Floorplan Company'
                    value={fpFloorplanCompany}
                    onChange={({ value }) =>
                        changeInventoryExtData({ key: "fpFloorplanCompany", value })
                    }
                    onRowClick={(companyName) =>
                        changeInventoryExtData({
                            key: "fpFloorplanCompany",
                            value: companyName,
                        })
                    }
                    originalPath={currentPath}
                />
            </div>
            <div className='col-3'>
                <DateInput
                    name='Reduction Date'
                    date={fpReductionDate}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "fpReductionDate",
                            value: Number(value),
                        });
                    }}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    name='Reduced amount'
                    title='Reduced amount'
                    labelPosition='top'
                    value={fpReduxAmt}
                    onChange={({ value }) => {
                        value &&
                            changeInventoryExtData({
                                key: "fpReduxAmt",
                                value,
                            });
                    }}
                />
            </div>
            <div className='col-3'>
                <DateInput
                    name='Pay Off By'
                    date={fpPayoffBy}
                    onChange={({ value }) => {
                        changeInventoryExtData({
                            key: "fpPayoffBy",
                            value: Number(value),
                        });
                    }}
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    title='Remain balance'
                    labelPosition='top'
                    value={fpRemainBal}
                    onChange={({ value }) =>
                        value &&
                        changeInventoryExtData({
                            key: "fpRemainBal",
                            value,
                        })
                    }
                />
            </div>
        </div>
    );
});
