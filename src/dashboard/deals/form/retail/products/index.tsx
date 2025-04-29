import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { CurrencyInput } from "dashboard/common/form/inputs";
import { InputTextarea } from "primereact/inputtextarea";
import { useStore } from "store/hooks";
import { TERM_MONTH_LIST } from "common/constants/contract-options";
import { ComboBox } from "dashboard/common/form/dropdown";

enum WarrantyTerm {
    MILES = "Miles",
    MONTH = "Month",
}

export const DealRetailProducts = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        deal: { price },
        dealExtData: {
            GAP_Company,
            Warranty_Name,
            Warranty_Miles,
            Warranty_Term,
            Warranty_Deductible,
            Warranty_Notes,
            Warranty_Price,
        },
        changeDeal,
        changeDealExtData,
    } = store;
    return (
        <div className='grid deal-retail-products row-gap-2'>
            <div className='col-6'>
                <CompanySearch
                    name='Service Contract Company'
                    value={Warranty_Name}
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "Warranty_Name", value })
                    }
                    onRowClick={(value) =>
                        changeDealExtData({
                            key: "Warranty_Name",
                            value,
                        })
                    }
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    value={Warranty_Price}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Warranty_Price", value: Number(value) || 0 })
                    }
                    labelPosition='top'
                    title='Price'
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    value={Warranty_Deductible}
                    onChange={({ value }) => {
                        changeDealExtData({ key: "Warranty_Deductible", value: value || 0 });
                    }}
                    title='Deductible'
                />
            </div>

            <div className='col-3'>
                <span className='p-float-label'>
                    <ComboBox
                        options={[WarrantyTerm.MONTH, WarrantyTerm.MILES]}
                        value={Warranty_Miles}
                        onChange={({ value }) =>
                            changeDealExtData({ key: "Warranty_Miles", value })
                        }
                        className='w-full deal-products__dropdown'
                    />
                    <label className='float-label'>Term (month or miles)</label>
                </span>
            </div>
            {Warranty_Miles === WarrantyTerm.MONTH && (
                <div className='col-3'>
                    <span className='p-float-label'>
                        <ComboBox
                            editable
                            options={[...TERM_MONTH_LIST]}
                            value={Warranty_Term}
                            onChange={({ value }) =>
                                changeDealExtData({ key: "Warranty_Term", value })
                            }
                            className='w-full deal-products__dropdown'
                        />
                        <label className='float-label'>Duration</label>
                    </span>
                </div>
            )}

            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        value={Warranty_Notes}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "Warranty_Notes", value })
                        }
                        className='deal-products__text-area'
                    />
                    <label className='float-label'>Notes</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-6'>
                <CompanySearch
                    value={GAP_Company}
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "GAP_Company", value })
                    }
                    onRowClick={(value) =>
                        changeDealExtData({
                            key: "GAP_Company",
                            value,
                        })
                    }
                    name='GAP Company'
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    value={
                        typeof price === "string" && price.includes("$")
                            ? Number(price.replace("$", ""))
                            : Number(price)
                    }
                    onChange={({ value }) => {
                        changeDeal({ key: "price", value: Number(value) || 0 });
                    }}
                    labelPosition='top'
                    title='Price'
                />
            </div>
        </div>
    );
});
