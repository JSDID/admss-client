import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { InputText } from "primereact/inputtext";
import { DateInput, StateDropdown } from "dashboard/common/form/inputs";
import { useStore } from "store/hooks";
import { useFormikContext } from "formik";
import { PartialDeal } from "dashboard/deals/form";

export const DealRetailLiens = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        changeDealExtData,
        dealExtData: {
            First_Lien_Name,
            First_Lien_Address,
            First_Lien_State,
            First_Lien_City,
            First_Lien_Zip_Code,
            First_Lien_Date,
            First_Lien_Acct_Num,
            First_Lien_Lienholder_ID,
        },
    } = store;

    const { values, errors, setFieldValue } = useFormikContext<PartialDeal>();
    return (
        <div className='grid deal-retail-liens row-gap-2'>
            <div className='col-6'>
                <CompanySearch
                    name='Lessor'
                    value={First_Lien_Name}
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "First_Lien_Name", value })
                    }
                    onRowClick={(value) =>
                        changeDealExtData({
                            key: "First_Lien_Name",
                            value,
                        })
                    }
                />
            </div>
            <div className='col-3 relative'>
                <span className='p-float-label'>
                    <InputText
                        className={`'deal-liens__text-input w-full' ${
                            errors.First_Lien_Phone_Num ? "p-invalid" : ""
                        }`}
                        value={values.First_Lien_Phone_Num}
                        onChange={({ target: { value } }) => {
                            setFieldValue("First_Lien_Phone_Num", value);
                            changeDealExtData({ key: "First_Lien_Phone_Num", value });
                        }}
                    />
                    <label className='float-label'>Phone Number</label>
                </span>
                <small className='p-error'>{errors.First_Lien_Phone_Num}</small>
            </div>

            <hr className='form-line' />

            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        className='deal-liens__text-input w-full'
                        value={First_Lien_Address}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "First_Lien_Address", value })
                        }
                    />
                    <label className='float-label'>Address</label>
                </span>
            </div>
            <div className='col-3'>
                <StateDropdown
                    value={First_Lien_State}
                    name='State'
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "First_Lien_State", value })
                    }
                    className='w-full deal-liens__dropdown'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={First_Lien_City}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "First_Lien_City", value });
                        }}
                        className='w-full deal-liens__text'
                    />
                    <label className='float-label'>City</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={First_Lien_Zip_Code}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "First_Lien_Zip_Code", value });
                        }}
                        className='deal-liens__text-input w-full'
                    />
                    <label className='float-label'>Zip Code</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <DateInput
                    name='Date'
                    date={First_Lien_Date}
                    onChange={({ value }) =>
                        value && changeDealExtData({ key: "First_Lien_Date", value: Number(value) })
                    }
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={First_Lien_Acct_Num}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "First_Lien_Acct_Num", value });
                        }}
                        className='deal-liens__text-input w-full'
                    />
                    <label className='float-label'>Account#</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={First_Lien_Lienholder_ID}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "First_Lien_Lienholder_ID", value });
                        }}
                        className='deal-liens__text-input w-full'
                    />
                    <label className='float-label'>Lesser ID#</label>
                </span>
            </div>
        </div>
    );
});
