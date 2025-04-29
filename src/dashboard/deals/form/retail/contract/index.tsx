import { observer } from "mobx-react-lite";
import { ReactElement } from "react";
import "./index.css";
import { InputText } from "primereact/inputtext";
import { CurrencyInput, DateInput, PercentInput } from "dashboard/common/form/inputs";
import { useStore } from "store/hooks";
import { InputNumber } from "primereact/inputnumber";
import { PAYMENT_FREQUENCY_LIST, TERM_MONTH_LIST } from "common/constants/contract-options";
import { ComboBox } from "dashboard/common/form/dropdown";

export const DealRetailContract = observer((): ReactElement => {
    const store = useStore().dealStore;
    const {
        dealExtData: {
            Con_Acct_Num,
            Con_Amt_To_Finance,
            Con_Pmt_Freq,
            Con_Term,
            Con_Int_Rate,
            Con_Pmt_Amt,
            Con_Final_Pmt,
            Con_Total_Interest,
            Con_Total_of_Pmts,
            Con_First_Pmt_Date,
            Con_Late_Fee,
            Con_Late_Fee_Max,
            Con_Late_Percent,
            Con_Grace_Period,
            Days_to_First_Payment,
        },
        changeDealExtData,
    } = store;
    return (
        <div className='grid deal-retail-contract row-gap-2'>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputText
                        value={Con_Acct_Num}
                        onChange={({ target: { value } }) =>
                            changeDealExtData({ key: "Con_Acct_Num", value })
                        }
                        className='deal-contract__text-input w-full'
                    />
                    <label className='float-label'>Account Number</label>
                </span>
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput
                    value={Con_Amt_To_Finance}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Amt_To_Finance", value: value || 0 })
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
                    value={Con_Int_Rate}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Int_Rate", value: value || 0 })
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

            <hr className='form-line' />

            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    value={Con_Total_Interest}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Total_Interest", value: value || 0 })
                    }
                    title='Total Interest'
                />
            </div>
            <div className='col-3'>
                <CurrencyInput
                    labelPosition='top'
                    value={Con_Total_of_Pmts}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Total_of_Pmts", value: value || 0 })
                    }
                    title='Total of Payments'
                />
            </div>
            <div className='col-3'>
                <span className='p-float-label'>
                    <InputNumber
                        min={1}
                        value={Days_to_First_Payment}
                        onChange={({ value }) =>
                            changeDealExtData({
                                key: "Days_to_First_Payment",
                                value: Number(value),
                            })
                        }
                        className='deal-contract__text-input w-full'
                    />
                    <label className='float-label'>Days to First Payment</label>
                </span>
            </div>
            <div className='col-3'>
                <DateInput
                    name='First Payment Due'
                    date={Con_First_Pmt_Date}
                    onChange={({ value }) =>
                        value &&
                        changeDealExtData({ key: "Con_First_Pmt_Date", value: Number(value) })
                    }
                />
            </div>
            <div className='col-3'>
                <DateInput
                    name='Final Payment Due'
                    date={Con_Final_Pmt}
                    onChange={({ value }) =>
                        value && changeDealExtData({ key: "Con_Final_Pmt", value: Number(value) })
                    }
                />
            </div>

            <hr className='form-line' />

            <div className='col-3'>
                <PercentInput
                    labelPosition='top'
                    value={Con_Late_Percent}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Late_Percent", value: value || 0 })
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
                    value={Con_Late_Fee}
                    onChange={({ value }) =>
                        changeDealExtData({ key: "Con_Late_Fee", value: value || 0 })
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
        </div>
    );
});
