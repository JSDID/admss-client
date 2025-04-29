import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { CompanySearch } from "dashboard/contacts/common/company-search";
import { InputText } from "primereact/inputtext";
import { BorderedCheckbox, CurrencyInput, DateInput } from "dashboard/common/form/inputs";
import { InputTextarea } from "primereact/inputtextarea";
import { useStore } from "store/hooks";
import { InputNumber } from "primereact/inputnumber";

const [MIN_LIMIT, MAX_LIMIT] = [0, 1000000];

export const DealRetailInsurance = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        dealExtData: {
            Insurance_Company,
            Policy_Number,
            Insurance_Co_Num,
            Insurance_Eff_Date,
            Insurance_Exp_Date,
            Ins_Policy_Received,
            Agent_Name,
            Agent_Address,
            Agent_Phone_No,
            Ins_Liab_Limit1,
            Ins_Liab_Limit2,
            Insurance_Notes,
            Ins_Comp_Deduct,
            Ins_Prop_Limit,
            Ins_Col_Deduct,
        },
        changeDealExtData,
    } = store;
    return (
        <div className='grid deal-insurance row-gap-2'>
            <div className='col-6'>
                <CompanySearch
                    value={Insurance_Company}
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "Insurance_Company", value })
                    }
                    onRowClick={(value) =>
                        changeDealExtData({
                            key: "Insurance_Company",
                            value,
                        })
                    }
                    name='Insurance Company'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={Policy_Number}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "Policy_Number", value })
                        }
                        className='deal-insurance__text-input w-full'
                    />
                    <label className='float-label'>Policy Number</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={Insurance_Co_Num}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "Insurance_Co_Num", value })
                        }
                        className='deal-insurance__text-input w-full'
                    />
                    <label className='float-label'>Insurance Co#</label>
                </span>
            </div>

            <div className='col-3'>
                <DateInput
                    date={Insurance_Eff_Date}
                    emptyDate
                    onChange={({ value }) =>
                        value &&
                        changeDealExtData({ key: "Insurance_Eff_Date", value: Number(value) })
                    }
                    name='Effective Date'
                />
            </div>
            <div className='col-3'>
                <DateInput
                    date={Insurance_Exp_Date}
                    emptyDate
                    onChange={({ value }) =>
                        value &&
                        changeDealExtData({ key: "Insurance_Exp_Date", value: Number(value) })
                    }
                    name='Expiration Date'
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!Ins_Policy_Received}
                    onChange={() =>
                        changeDealExtData({
                            key: "Ins_Policy_Received",
                            value: Number(!Ins_Policy_Received),
                        })
                    }
                    name='Policy received'
                />
            </div>

            <hr className='form-line' />

            <div className='col-6'>
                <CompanySearch
                    value={Agent_Name}
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "Agent_Name", value })
                    }
                    onRowClick={(value) =>
                        changeDealExtData({
                            key: "Agent_Name",
                            value,
                        })
                    }
                    name="Agent's Name"
                />
            </div>
            <div className='col-6'>
                <span className='p-float-label'>
                    <InputText
                        value={Agent_Address}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "Agent_Address", value });
                        }}
                        className='deal-insurance__text-input w-full'
                    />
                    <label className='float-label'>Agent's Address</label>
                </span>
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={Agent_Phone_No}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "Agent_Phone_No", value });
                        }}
                        className='deal-insurance__text-input w-full'
                    />
                    <label className='float-label'>Phone Number</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    min={MIN_LIMIT}
                    max={MAX_LIMIT}
                    value={Ins_Comp_Deduct}
                    className={`deal-insurance__currency-input ${!Ins_Comp_Deduct ? "deal-insurance__currency-input--grey" : ""}`}
                    onChange={({ value }) => {
                        changeDealExtData({ key: "Ins_Comp_Deduct", value: Number(value) });
                    }}
                    title='Coverage Comprehencive'
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    min={MIN_LIMIT}
                    max={MAX_LIMIT}
                    value={Ins_Col_Deduct}
                    className={`deal-insurance__currency-input ${!Ins_Col_Deduct ? "deal-insurance__currency-input--grey" : ""}`}
                    onChange={({ value }) => {
                        changeDealExtData({ key: "Ins_Col_Deduct", value: Number(value) });
                    }}
                    title='Coverage Collision'
                />
            </div>
            <div className='col-6'>
                <div className='deal-insurance__liability'>
                    <span className='p-float-label deal-insurance__liability-item'>
                        <InputNumber
                            value={Ins_Liab_Limit1}
                            min={MIN_LIMIT}
                            max={MAX_LIMIT}
                            onChange={({ value }) => {
                                changeDealExtData({ key: "Ins_Liab_Limit1", value: Number(value) });
                            }}
                            className='deal-insurance__text-input w-full'
                        />
                        <label className='float-label'>Liability Row</label>
                    </span>

                    <div className='deal-insurance__divider-vertical' />

                    <span className='p-float-label deal-insurance__liability-item'>
                        <InputNumber
                            value={Ins_Liab_Limit2}
                            min={MIN_LIMIT}
                            max={MAX_LIMIT}
                            onChange={({ value }) => {
                                changeDealExtData({ key: "Ins_Liab_Limit2", value: Number(value) });
                            }}
                            className='deal-insurance__text-input w-full'
                        />
                    </span>

                    <div className='deal-insurance__divider-vertical' />

                    <span className='p-float-label deal-insurance__liability-item'>
                        <InputNumber
                            value={Ins_Prop_Limit}
                            min={MIN_LIMIT}
                            max={MAX_LIMIT}
                            onChange={({ value }) => {
                                changeDealExtData({ key: "Ins_Prop_Limit", value: Number(value) });
                            }}
                            className='deal-insurance__text-input w-full'
                        />
                    </span>
                </div>
            </div>

            <div className='col-12'>
                <span className='p-float-label'>
                    <InputTextarea
                        value={Insurance_Notes}
                        onChange={({ target: { value } }) => {
                            changeDealExtData({ key: "Insurance_Notes", value });
                        }}
                        className='deal-insurance__text-area'
                    />
                    <label className='float-label'>Notes</label>
                </span>
            </div>
        </div>
    );
});
