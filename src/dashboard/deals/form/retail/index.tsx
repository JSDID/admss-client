import { AccordionDealItems, Deals } from "dashboard/deals/common";
import { lazy } from "react";

const DealRetailLiens = lazy(() =>
    import("./liens").then((module) => ({ default: module.DealRetailLiens }))
);
const DealRetailTradeFirst = lazy(() =>
    import("./trade-first").then((module) => ({ default: module.DealRetailTradeFirst }))
);
const DealRetailTradeSecond = lazy(() =>
    import("./trade-second").then((module) => ({ default: module.DealRetailTradeSecond }))
);
const DealRetailTag = lazy(() =>
    import("./tag").then((module) => ({ default: module.DealRetailTag }))
);
const DealRetailInsurance = lazy(() =>
    import("./insurance").then((module) => ({ default: module.DealRetailInsurance }))
);
const DealRetailCharges = lazy(() =>
    import("./charges").then((module) => ({ default: module.DealRetailCharges }))
);
const DealRetailProducts = lazy(() =>
    import("./products").then((module) => ({ default: module.DealRetailProducts }))
);
const DealRetailFinances = lazy(() =>
    import("./finances").then((module) => ({ default: module.DealRetailFinances }))
);
const DealRetailPickup = lazy(() =>
    import("./pickup").then((module) => ({ default: module.DealRetailPickup }))
);
const DealRetailContract = lazy(() =>
    import("./contract").then((module) => ({ default: module.DealRetailContract }))
);
const DealLeaseHerePayHere = lazy(() =>
    import("./lease-here-pay-here").then((module) => ({ default: module.DealLeaseHerePayHere }))
);
const DealDismantle = lazy(() =>
    import("./dismantle").then((module) => ({ default: module.DealDismantle }))
);
const DealBuyHerePayHere = lazy(() =>
    import("./buy-here-pay-here").then((module) => ({ default: module.DealBuyHerePayHere }))
);

const baseForm = [
    { itemLabel: AccordionDealItems.LIENS, component: <DealRetailLiens /> },
    { itemLabel: AccordionDealItems.FIRST_TRADE, component: <DealRetailTradeFirst /> },
    { itemLabel: AccordionDealItems.SECOND_TRADE, component: <DealRetailTradeSecond /> },
    { itemLabel: AccordionDealItems.TAG, component: <DealRetailTag /> },
    { itemLabel: AccordionDealItems.INSURANCE, component: <DealRetailInsurance /> },
    { itemLabel: AccordionDealItems.CHARGES, component: <DealRetailCharges /> },
    { itemLabel: AccordionDealItems.PRODUCTS, component: <DealRetailProducts /> },
    { itemLabel: AccordionDealItems.FINANCES, component: <DealRetailFinances /> },
    { itemLabel: AccordionDealItems.PICKUP, component: <DealRetailPickup /> },
];

export const DealRetail: Pick<Deals, "label" | "items"> = {
    label: "Retail (Cash)",
    items: [
        ...baseForm,
        { itemLabel: AccordionDealItems.CONTRACT, component: <DealRetailContract /> },
    ],
};

export const DealLHPH: Pick<Deals, "label" | "items"> = {
    label: "Lease Here Pay Here",
    items: [
        ...baseForm,
        { itemLabel: AccordionDealItems.LHPH, component: <DealLeaseHerePayHere /> },
    ],
};

export const DealBHPH: Pick<Deals, "label" | "items"> = {
    label: "Buy Here Pay Here",
    items: [...baseForm, { itemLabel: AccordionDealItems.BHPH, component: <DealBuyHerePayHere /> }],
};

export const DealDismantleForm: Pick<Deals, "label" | "items"> = {
    label: "Dismantle",
    items: [
        { itemLabel: AccordionDealItems.DISMANTLE, component: <DealDismantle /> },
        { itemLabel: AccordionDealItems.PICKUP, component: <DealRetailPickup /> },
    ],
};

export const DealWholeSale: Pick<Deals, "label" | "items"> = {
    label: "Wholesale",
    items: [
        { itemLabel: AccordionDealItems.FINANCES, component: <DealRetailFinances /> },
        { itemLabel: AccordionDealItems.PICKUP, component: <DealRetailPickup /> },
    ],
};
