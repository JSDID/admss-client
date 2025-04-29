import { AccordionDealItems } from "dashboard/deals/common";
import { Inventory } from "dashboard/inventory/common";
import { lazy } from "react";

const DealsSale = lazy(() =>
    import("./sale").then((module) => ({ default: module.DealGeneralSale }))
);
const DealsOdometer = lazy(() =>
    import("./odometer").then((module) => ({ default: module.DealGeneralOdometer }))
);
const DealsSeller = lazy(() =>
    import("./seller").then((module) => ({ default: module.DealGeneralSeller }))
);

export const DealGeneralInfo: Pick<Inventory, "label" | "items"> = {
    label: "General information",
    items: [
        { itemLabel: AccordionDealItems.SALE, component: <DealsSale /> },
        { itemLabel: AccordionDealItems.ODOMETER, component: <DealsOdometer /> },
        { itemLabel: AccordionDealItems.SELLER, component: <DealsSeller /> },
    ],
};
