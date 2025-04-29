import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { InputText } from "primereact/inputtext";
import {
    BorderedCheckbox,
    CurrencyInput,
    DateInput,
    PercentInput,
} from "dashboard/common/form/inputs";
import { useStore } from "store/hooks";
import { InputNumber } from "primereact/inputnumber";
import { PAYMENT_FREQUENCY_LIST, TERM_MONTH_LIST } from "common/constants/contract-options";
import { Checkbox } from "primereact/checkbox";
import { ComboBox } from "dashboard/common/form/dropdown";

export const DealBuyHerePayHere = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        deal: { accountInfo, dateeffective },
        dealExtData: {
            Con_Pmt_Freq,
            Con_Term,
            Con_Pmt_Amt,
            Con_Final_Pmt,
            Con_First_Pmt_Date,
            Con_Final_Pmt_Date,
            Con_Late_Fee,
            Con_Late_Fee_Max,
            Con_Late_Percent,
            Con_Grace_Period,
            Con_Interest_Method,
            Con_PassTimeBox,
            Con_OnTimeBox,
            Con_DontReportToCB,
        },
        dealFinance: { TaxableAmount, BHPHCollectedInterest },
        changeDeal,
        changeDealExtData,
        changeDealFinance,
    } = store;
    return (
        <div className='grid deal-buy-here row-gap-2'>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={accountInfo}
                        onChange={({ target: { value } }) =>
                            changeDeal({ key: "accountInfo", value })
                        }
                        className='deal-contract__text-input w-full'
                    />
                    <label className='float-label'>Account Number</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput
                    value={parseInt(TaxableAmount)}
                    onChange={({ value }) =>
                        changeDealFinance({ key: "TaxableAmount", value: value || 0 })
                    }
                    labelPosition='top'
                    title='Amount of Finance'
                />
            </div>
            <div className='col-3'>
                <ComboBox
                    optionLabel='name'
                    optionValue='id'
                    value={Con_Pmt_Freq}
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "Con_Pmt_Freq", value })
                    }
                    options={[...PAYMENT_FREQUENCY_LIST]}
                    required
                    className='w-full deal-sale__dropdown'
                    label='Payment Frequency'
                />
            </div>
            <div className='col-3'>
                <ComboBox
                    value={Con_Term}
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "Con_Term", value })
                    }
                    options={[...TERM_MONTH_LIST]}
                    editable
                    required
                    className='w-full deal-sale__dropdown'
                    label='Term (months)'
                />
            </div>
            <div className='col-3'>
                <PercentInput
                    value={BHPHCollectedInterest}
                    onChange={({ value }) =>
                        changeDealFinance({ key: "BHPHCollectedInterest", value: value || 0 })
                    }
                    labelPosition='top'
                    title='Interest Rate'
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    value={Con_Pmt_Amt}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Pmt_Amt", value: value || 0 })
                    }
                    title='Payment Amount'
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    value={Con_Final_Pmt}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Final_Pmt", value: value || 0 })
                    }
                    title='Final Payment'
                />
            </div>
            <div className='col-3'>
                <DateInput
                    name='First Payment Due'
                    date={Con_First_Pmt_Date}
                    emptyDate
                    onChange={({ value }) =>
                        value &&
                        changeDealExtData({ key: "Con_First_Pmt_Date", value: Number(value) })
                    }
                />
            </div>
            <div className='col-3'>
                <DateInput
                    name='Final Payment Due'
                    date={Con_Final_Pmt_Date}
                    emptyDate
                    onChange={({ value }) =>
                        value &&
                        changeDealExtData({ key: "Con_Final_Pmt_Date", value: Number(value) })
                    }
                />
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <PercentInput
                    labelPosition='top'
                    value={Con_Late_Fee}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Late_Fee", value: value || 0 })
                    }
                    title='Late Fee'
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    value={Con_Late_Fee_Max}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Late_Fee_Max", value: value || 0 })
                    }
                    title='Flat/ Min Late Fee'
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    value={Con_Late_Percent}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Late_Percent", value: value || 0 })
                    }
                    title='Late Fee Cap'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputNumber
                        value={Con_Grace_Period}
                        onChange={({ value }) =>
                            changeDealExtData({ key: "Con_Grace_Period", value: value || 0 })
                        }
                        className='deal-contract__text-input w-full'
                    />
                    <label className='float-label'>Grace Period</label>
                </span>
            </div>
            <div className='col-3'>
                <ComboBox
                    value={Con_Interest_Method}
                    editable
                    onChange={({ target: { value } }) =>
                        changeDealExtData({ key: "Con_Interest_Method", value })
                    }
                    label='Interest Method'
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!Con_PassTimeBox}
                    onChange={() =>
                        changeDealExtData({
                            key: "Con_PassTimeBox",
                            value: !Con_PassTimeBox ? 1 : 0,
                        })
                    }
                    name='Use PassTime Box'
                />
            </div>
            <div className='col-3'>
                <BorderedCheckbox
                    checked={!!Con_OnTimeBox}
                    onChange={() =>
                        changeDealExtData({
                            key: "Con_OnTimeBox",
                            value: !Con_OnTimeBox ? 1 : 0,
                        })
                    }
                    name='Use OnTime Box'
                />
            </div>
            <div className='col-3'>
                <DateInput
                    name='Effective Date'
                    date={Number(dateeffective)}
                    emptyDate
                    onChange={({ value }) =>
                        changeDeal({ key: "dateeffective", value: Number(value) })
                    }
                />
            </div>
            <div className='col-3 flex align-items-center'>
                <Checkbox
                    inputId='buy-here-report'
                    name='buy-here-report'
                    checked={!!Con_DontReportToCB}
                    onChange={() =>
                        changeDealExtData({
                            key: "Con_DontReportToCB",
                            value: !Con_DontReportToCB ? 1 : 0,
                        })
                    }
                />
                <label htmlFor='buy-here-report' className='ml-2'>
                    Don’t report to Credit Bureau
                </label>
            </div>
        </div>
    );
});
