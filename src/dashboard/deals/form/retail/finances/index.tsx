import { observer } from "mobx-react-lite";
import { ReactElement, useEffect } from "react";
import "./index.css";
import { CurrencyInput } from "dashboard/common/form/inputs";
import { Button } from "primereact/button";
import { dealFinancesRecalculate, dealFinancesWashout } from "http/services/deals.service";
import { useParams } from "react-router-dom";
import { DealFinance } from "common/models/deals";
import { useStore } from "store/hooks";

export const DealRetailFinances = observer((): ReactElement => {
    const { id } = useParams();
    const store = useStore().dealStore;
    const { dealFinances, getDealFinances, changeDealFinances } = store;

    useEffect(() => {
        id && getDealFinances(id);
    }, [id]);

    const changeFinance = (key: keyof DealFinance, value: number | null) => {
        if (dealFinances) {
            changeDealFinances({ key, value: value || 0 });
        }
    };

    return (
        <div className='grid deal-retail-finances row-gap-2'>
            <div className='col-12'>
                <div className='flex justify-content-end gap-3 mt-5 mr-3'>
                    <Button
                        outlined
                        onClick={() => {
                            id && dealFinancesWashout(id);
                        }}
                        className='finances__button bold px-6'
                    >
                        Washout
                    </Button>
                    <Button
                        outlined
                        onClick={() => {
                            id && dealFinancesRecalculate(id);
                        }}
                        className='finances__button bold px-6'
                    >
                        Recalculate
                    </Button>
                </div>
            </div>
            <div className='col-6 finances-column'>
                <div className='finances-item'>
                    <label className='finances-item__label finances-item--bold'>Cash Price</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.CashPrice) || 0}
                        onChange={({ value }) => changeFinance("CashPrice", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Total Trade Allowance</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.TradeAllowance) || 0}
                        onChange={({ value }) => changeFinance("TradeAllowance", value)}
                    />
                </div>

                <div className='finances-item finances-item--sum'>
                    <span className='finances-item__label'>Taxable amount</span>
                    <span className='finances-item__amount'>
                        <span>$</span>
                        {dealFinances.TaxableAmount || "0.00"}
                    </span>
                </div>

                <div className='finances-item'>
                    <label className='finances-item__label'>Tax Rate</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.TaxRate) || 0}
                        onChange={({ value }) => changeFinance("TaxRate", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Taxes</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.Taxes) || 0}
                        onChange={({ value }) => changeFinance("Taxes", value)}
                    />
                </div>

                <div className='finances-item finances-item--sum'>
                    <span className='finances-item__label'>Subtotal</span>
                    <span className='finances-item__amount'>
                        <span>$</span>
                        {dealFinances.SubTotal || "0.00"}
                    </span>
                </div>

                <div className='finances-item'>
                    <label className='finances-item__label'>Accessory Price</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.Accessory) || 0}
                        onChange={({ value }) => changeFinance("Accessory", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Miscellaneous</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.Misc) || 0}
                        onChange={({ value }) => changeFinance("Misc", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Tag Fee</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.Tags) || 0}
                        onChange={({ value }) => changeFinance("Tags", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Title Transfer Fee</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.Title) || 0}
                        onChange={({ value }) => changeFinance("Title", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>License and Registration Fees</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.LicenseAndReg) || 0}
                        onChange={({ value }) => changeFinance("LicenseAndReg", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Service Contract</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.Warranty) || 0}
                        onChange={({ value }) => changeFinance("Warranty", value)}
                    />
                </div>
            </div>

            <div className='col-6 finances-column'>
                <div className='finances-item'>
                    <label className='finances-item__label'>GAP</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.Gap) || 0}
                        onChange={({ value }) => changeFinance("Gap", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Accident & Health</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.AH) || 0}
                        onChange={({ value }) => changeFinance("AH", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Credit Life</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.CL) || 0}
                        onChange={({ value }) => changeFinance("CL", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>VSI</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.MR) || 0}
                        onChange={({ value }) => changeFinance("MR", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>
                        Electronic Registration & Titling
                    </label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.ERT) || 0}
                        onChange={({ value }) => changeFinance("ERT", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Documentation Fee</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.DocFee) || 0}
                        onChange={({ value }) => changeFinance("DocFee", value)}
                    />
                </div>

                <div className='finances-item finances-item--sum'>
                    <span className='finances-item__label'>Total Price</span>
                    <span className='finances-item__amount'>
                        <span>$</span>
                        {dealFinances.TotalPrice?.replace("$", "") || "0.00"}
                    </span>
                </div>

                <div className='finances-item'>
                    <label className='finances-item__label'>Trade in Pay-Off Amount</label>
                    <span className='finances-item__amount finances-item__amount--bold'>
                        <span>$</span>
                        {dealFinances.TradeInPayoff || "0.00"}
                    </span>
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Net Trade Allowance</label>
                    <span className='finances-item__amount finances-item__amount--bold'>
                        <span>$</span> {dealFinances.NetTradeAllowance || "0.00"}
                    </span>
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Cash Down Payment</label>
                    <CurrencyInput
                        className='finances-item__input'
                        value={Number(dealFinances.CashDown) || 0}
                        onChange={({ value }) => changeFinance("CashDown", value)}
                    />
                </div>
                <div className='finances-item'>
                    <label className='finances-item__label'>Total Down Payment</label>
                    <span className='finances-item__amount finances-item__amount--bold'>
                        <span>$</span>
                        {dealFinances.TotalDown || "0.00"}
                    </span>
                </div>

                <div className='finances-item finances-item--sum'>
                    <span className='finances-item__label'>Amount Financed</span>
                    <span className='finances-item__amount finances-item__amount--bold'>
                        <span>$</span>
                        {dealFinances.BalanceDue || "0.00"}
                    </span>
                </div>
            </div>
        </div>
    );
});
